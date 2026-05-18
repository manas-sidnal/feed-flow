from flask import Flask, request, jsonify
from flask_cors import CORS
import collections

from data_generator import generate_articles, generate_users, generate_reference_string
from search_engine import build_topic_index, compute_feed_hash
from ranking_engine import rank_feed
from cache import LRUCache, FIFOCache, OptimalCache

app = Flask(__name__)
CORS(app)


def generate_user_feed(user_id, users, topic_index, trending_articles=None):
    user = next(u for u in users if u.id == user_id)
    feed = compute_feed_hash(user, topic_index)
    ranked = rank_feed(user, feed, trending_articles)
    return ranked


@app.route("/api/simulate", methods=["POST"])
def simulate():
    body = request.get_json(force=True)
    num_users = int(body.get("users", 20))
    num_articles = int(body.get("articles", 100))
    num_requests = int(body.get("requests", 55))
    hit_bias = float(body.get("hit_bias", 0.4))
    cache_capacity = body.get("cache_capacity")
    cache_capacity = int(cache_capacity) if cache_capacity else max(1, int(num_users * 0.2))

    # Generate data
    articles = generate_articles(num_articles=num_articles)
    users = generate_users(num_users=num_users)
    requests_list = generate_reference_string(
        num_requests=num_requests, num_users=num_users, cache_hit_ratio=hit_bias
    )
    topic_index = build_topic_index(articles)

    # --- Speedup test ---
    import time
    user0 = users[0]
    start_linear = time.perf_counter_ns()
    from search_engine import compute_feed_linear
    compute_feed_linear(user0, articles)
    end_linear = time.perf_counter_ns()
    linear_time_us = (end_linear - start_linear) / 1000.0

    start_hash = time.perf_counter_ns()
    compute_feed_hash(user0, topic_index)
    end_hash = time.perf_counter_ns()
    hash_time_us = (end_hash - start_hash) / 1000.0

    speedup = linear_time_us / hash_time_us if hash_time_us > 0 else None

    # --- Sample feed for first 2 users ---
    sample_feeds = []
    for user in users[:2]:
        feed = compute_feed_hash(user, topic_index)
        ranked = rank_feed(user, feed)
        top5 = [
            {"score": round(score, 2), "title": article.title, "topic": article.topic}
            for score, article in ranked[:5]
        ]
        sample_feeds.append({
            "user_id": user.id,
            "user_name": user.name,
            "preferences": user.preferred_topics,
            "top5": top5,
        })

    # --- LRU simulation ---
    lru = LRUCache(num_users=num_users, capacity=cache_capacity)
    lru_log = []
    for i, user_id in enumerate(requests_list):
        hit, _ = lru.get(user_id)
        if hit:
            status = "HIT"
        else:
            status = "MISS"
            feed = generate_user_feed(user_id, users, topic_index)
            lru.put(user_id, feed)
        lru_log.append({
            "request": i + 1,
            "user_id": user_id,
            "status": status,
            "cache": list(lru.get_keys()),
        })

    lru_hits = lru.hits
    lru_misses = lru.misses

    # --- Algorithm comparison ---
    def simulate_cache_algo(cache_instance):
        for user_id in requests_list:
            hit, _ = cache_instance.get(user_id)
            if not hit:
                feed = generate_user_feed(user_id, users, topic_index)
                cache_instance.put(user_id, feed)
        return cache_instance.hits, cache_instance.misses

    fifo_hits, fifo_misses = simulate_cache_algo(FIFOCache(num_users=num_users, capacity=cache_capacity))
    opt_hits, opt_misses = simulate_cache_algo(OptimalCache(requests_list, num_users=num_users, capacity=cache_capacity))
    total = len(requests_list)

    algo_comparison = [
        {"algorithm": "FIFO", "hits": fifo_hits, "misses": fifo_misses, "hit_ratio": round((fifo_hits / total) * 100, 1)},
        {"algorithm": "LRU",  "hits": lru_hits,  "misses": lru_misses,  "hit_ratio": round((lru_hits  / total) * 100, 1)},
        {"algorithm": "Optimal", "hits": opt_hits, "misses": opt_misses, "hit_ratio": round((opt_hits / total) * 100, 1)},
    ]

    # --- Trending windows ---
    window_size = 10
    recent_feeds = []
    trending_snapshots = []
    for i, user_id in enumerate(requests_list):
        article_counts = {}
        for feed in recent_feeds:
            for article_id in feed:
                article_counts[article_id] = article_counts.get(article_id, 0) + 1
        trending_articles = {aid for aid, count in article_counts.items() if count >= 3}
        ranked = generate_user_feed(user_id, users, topic_index, trending_articles)
        current_feed_ids = [article.id for _, article in ranked]
        recent_feeds.append(current_feed_ids)
        if len(recent_feeds) > window_size:
            recent_feeds.pop(0)
        if (i + 1) % 10 == 0:
            trending_snapshots.append({
                "request": i + 1,
                "trending": sorted(list(trending_articles)),
            })

    return jsonify({
        "config": {
            "users": num_users,
            "articles": num_articles,
            "requests": num_requests,
            "cache_capacity": cache_capacity,
            "hit_bias": hit_bias,
        },
        "reference_string": requests_list,
        "speedup": {
            "linear_time_us": round(linear_time_us, 2),
            "hash_time_us": round(hash_time_us, 2),
            "speedup": round(speedup, 1) if speedup else None,
        },
        "sample_feeds": sample_feeds,
        "lru_log": lru_log,
        "lru_stats": {
            "total": total,
            "hits": lru_hits,
            "misses": lru_misses,
            "hit_ratio": round((lru_hits / total) * 100, 1),
            "miss_ratio": round((lru_misses / total) * 100, 1),
        },
        "algo_comparison": algo_comparison,
        "trending_snapshots": trending_snapshots,
    })


if __name__ == "__main__":
    app.run(port=5000, debug=True)
