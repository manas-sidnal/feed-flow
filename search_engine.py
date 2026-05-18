import time
from models import User, Article

def compute_feed_linear(user: User, articles: list[Article]) -> list[Article]:
    feed = []
    for article in articles:
        if article.topic in user.preferred_topics:
            feed.append(article)
    return feed

def build_topic_index(articles: list[Article]) -> dict[str, list[Article]]:
    topic_index = {}
    for article in articles:
        if article.topic not in topic_index:
            topic_index[article.topic] = []
        topic_index[article.topic].append(article)
    return topic_index

def compute_feed_hash(user: User, topic_index: dict[str, list[Article]]) -> list[Article]:
    feed = []
    for topic in user.preferred_topics:
        if topic in topic_index:
            feed.extend(topic_index[topic])
    return feed

def run_speedup_test(users: list[User], articles: list[Article]):
    print("=" * 55)
    print("HASH INDEX SPEEDUP REPORT")
    print("=" * 55)
    
    user = users[0]
    
    # Linear Scan
    start_linear = time.perf_counter_ns()
    compute_feed_linear(user, articles)
    end_linear = time.perf_counter_ns()
    linear_time_us = (end_linear - start_linear) / 1000.0
    
    # Hash Index
    topic_index = build_topic_index(articles)
    start_hash = time.perf_counter_ns()
    compute_feed_hash(user, topic_index)
    end_hash = time.perf_counter_ns()
    hash_time_us = (end_hash - start_hash) / 1000.0
    
    print(f"Linear time: {linear_time_us:.2f} microseconds")
    print(f"Hash time:   {hash_time_us:.2f} microseconds")
    
    if hash_time_us > 0:
        speedup = linear_time_us / hash_time_us
        print(f"Speedup = {linear_time_us:.2f} / {hash_time_us:.2f}")
        print(f"Hash index is {speedup:.1f}x faster than linear scan\n")
    else:
        print("Hash time was too small to measure speedup accurately.\n")
