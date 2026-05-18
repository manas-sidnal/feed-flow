import argparse
from data_generator import generate_articles, generate_users, generate_reference_string
from search_engine import build_topic_index, run_speedup_test, compute_feed_hash
from ranking_engine import rank_feed, print_sample_feed
from cache import LRUCache, FIFOCache, OptimalCache

def generate_user_feed(user_id, users, topic_index, trending_articles=None):
    user = next(u for u in users if u.id == user_id)
    feed = compute_feed_hash(user, topic_index)
    ranked = rank_feed(user, feed, trending_articles)
    return ranked

def simulate_lru_with_output(requests, users, topic_index, capacity=5):
    print("=" * 55)
    print("LRU CACHE SIMULATION")
    print("=" * 55)
    
    lru = LRUCache(num_users=len(users), capacity=capacity)
    
    for i, user_id in enumerate(requests):
        hit, _ = lru.get(user_id)
        if hit:
            status = "HIT "
        else:
            status = "MISS"
            feed = generate_user_feed(user_id, users, topic_index)
            lru.put(user_id, feed)
            
        print(f"Request {i+1:<2} | User {user_id:<2} | {status} | Cache: {lru.get_keys()}")
        
    print("\nFinal statistics:")
    total = len(requests)
    print(f"Total Requests : {total}")
    print(f"Cache Hits     : {lru.hits}")
    print(f"Cache Misses   : {lru.misses}")
    print(f"Hit Ratio      : {(lru.hits/total)*100:.1f}%")
    print(f"Miss Ratio     : {(lru.misses/total)*100:.1f}%\n")
    return lru.hits, lru.misses

def simulate_cache(cache_instance, requests, users, topic_index):
    for user_id in requests:
        hit, _ = cache_instance.get(user_id)
        if not hit:
            feed = generate_user_feed(user_id, users, topic_index)
            cache_instance.put(user_id, feed)
    return cache_instance.hits, cache_instance.misses

def run_algorithm_comparison(requests, users, topic_index, lru_hits, lru_misses, capacity=5):
    print("=" * 55)
    print("ALGORITHM COMPARISON")
    print("=" * 55)
    
    fifo_hits, fifo_misses = simulate_cache(FIFOCache(num_users=len(users), capacity=capacity), requests, users, topic_index)
    opt_hits, opt_misses = simulate_cache(OptimalCache(requests, num_users=len(users), capacity=capacity), requests, users, topic_index)
    
    total = len(requests)
    
    def calc_ratio(hits): return (hits / total) * 100
    
    print("| Algorithm | Hits    | Misses  | Hit Ratio |")
    print("| --------- | ------- | ------- | --------- |")
    print(f"| FIFO      | {fifo_hits:<3}      | {fifo_misses:<3}   | {calc_ratio(fifo_hits):.1f}% |")
    print(f"| LRU       | {lru_hits:<3}      | {lru_misses:<3}   | {calc_ratio(lru_hits):.1f}% |")
    print(f"| Optimal   | {opt_hits:<3}      | {opt_misses:<3}   | {calc_ratio(opt_hits):.1f}% |\n")
    
    best = "Optimal"
    improvement = calc_ratio(lru_hits) - calc_ratio(fifo_hits)
    print(f"Best: {best}")
    print(f"LRU outperforms FIFO by {improvement:.1f}%\n")


def simulate_trending(requests, users, topic_index):
    print("=" * 55)
    print("TRENDING WINDOW")
    print("=" * 55)
    
    window_size = 10
    recent_feeds = [] # list of lists of article IDs
    
    for i, user_id in enumerate(requests):
        # trending articles based on the last 10 feeds
        article_counts = {}
        for feed in recent_feeds:
            for article_id in feed:
                article_counts[article_id] = article_counts.get(article_id, 0) + 1
                
        trending_articles = {aid for aid, count in article_counts.items() if count >= 3}
        
        # feed with trending boost
        ranked = generate_user_feed(user_id, users, topic_index, trending_articles)
        
        # sliding window
        current_feed_ids = [article.id for _, article in ranked]
        recent_feeds.append(current_feed_ids)
        if len(recent_feeds) > window_size:
            recent_feeds.pop(0)
            
        # Print every 10 requests
        if (i + 1) % 10 == 0:
            print(f"Request {i + 1}:")
            print(f"Trending articles: {list(trending_articles) if trending_articles else 'None'}\n")

def main():
    parser = argparse.ArgumentParser(description="FeedFlow Interactive CLI Simulation")
    parser.add_argument("--users", type=int, default=20, help="Total number of users (default: 20)")
    parser.add_argument("--articles", type=int, default=100, help="Total number of articles (default: 100)")
    parser.add_argument("--requests", type=int, default=55, help="Number of feed requests (default: 50)")
    parser.add_argument("--cache-capacity", type=int, default=None, help="Cache capacity (default: 20%% of users)")
    parser.add_argument("--hit-bias", type=float, default=0.4, help="Target cache hit ratio (0.0 to 1.0) (default: 0.4)")
    
    args = parser.parse_args()

    articles = generate_articles(num_articles=args.articles)
    users = generate_users(num_users=args.users)
    requests = generate_reference_string(num_requests=args.requests, num_users=args.users, cache_hit_ratio=args.hit_bias)
    topic_index = build_topic_index(articles)
    cache_size = args.cache_capacity or max(1, int(args.users * 0.2))

    print("=" * 55)
    print("SIMULATION CONFIGURATION")
    print("=" * 55)
    print(f"Users           : {args.users}")
    print(f"Articles        : {args.articles}")
    print(f"Requests        : {args.requests}")
    print(f"Cache Capacity  : {cache_size}")
    print(f"Hit Bias        : {args.hit_bias}")
    print()

    print("=" * 55)
    print("REFERENCE STRING")
    print("=" * 55)
    print(requests)
    print("\n")
    
    
    run_speedup_test(users, articles)
    
    print_sample_feed(users, articles, topic_index)
    
    lru_hits, lru_misses = simulate_lru_with_output(requests, users, topic_index, capacity=args.cache_capacity)
    
    run_algorithm_comparison(requests, users, topic_index, lru_hits, lru_misses, capacity=args.cache_capacity)
    
    simulate_trending(requests, users, topic_index)

if __name__ == "__main__":
    main()
