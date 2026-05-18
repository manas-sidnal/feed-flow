import random
from datetime import datetime, timedelta
from models import Article, User

TOPICS = ["tech", "sports", "politics", "health", "science", "finance", "entertainment", "world"]

def generate_articles(num_articles=100) -> list[Article]:
    articles = []
    now = datetime.now()
    for i in range(1, num_articles + 1):
        topic = random.choice(TOPICS)
        days_ago = random.randint(0, 30)
        timestamp = now - timedelta(days=days_ago)
        popularity = round(random.uniform(0.0, 10.0), 2)
        articles.append(Article(
            id=i,
            title=f"Article {i} on {topic}",
            topic=topic,
            popularity=popularity,
            timestamp=timestamp
        ))
    return articles

def generate_users(num_users=20) -> list[User]:
    users = []
    for i in range(1, num_users + 1):
        num_prefs = random.randint(1, 3)
        prefs = random.sample(TOPICS, num_prefs)
        users.append(User(
            id=i,
            name=f"User_{i}",
            preferred_topics=prefs
        ))
    return users

def generate_reference_string(num_requests=50, num_users=20, cache_hit_ratio=0.4) -> list[int]:
    requests = []
    hot_count = max(1, int(num_users * 0.2))
    hot_users = list(range(1, hot_count + 1))
    cold_users = list(range(hot_count+1, num_users + 1))
    
    for _ in range(num_requests):
        if not cold_users or random.random() < cache_hit_ratio + 0.1:
            requests.append(random.choice(hot_users))
        else:
            requests.append(random.choice(cold_users))
    return requests
