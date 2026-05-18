from datetime import datetime
from models import User, Article
from typing import Tuple

def rank_feed(user: User, feed: list[Article], trending_articles: set = None) -> list[Tuple[float, Article]]:
    ranked_feed = []
    today = datetime.now()
    
    top_preference = user.preferred_topics[0] if user.preferred_topics else None
    
    for article in feed:
        topic_weight = 2.0 if article.topic == top_preference else 1.0
        
        days_since_published = (today - article.timestamp).days
        recency_score = max(0, 10 - days_since_published)
        
        base_score = (topic_weight * article.popularity) + recency_score
        
        final_score = base_score
        if trending_articles and article.id in trending_articles:
            final_score += 2.0
            
        ranked_feed.append((final_score, article))
        
    ranked_feed.sort(key=lambda x: x[0], reverse=True)
    
    return ranked_feed[:10]

def print_sample_feed(users: list[User], articles: list[Article], topic_index: dict):
    from search_engine import compute_feed_hash
    print("=" * 55)
    print("SAMPLE FEED OUTPUT")
    print("=" * 55)
    
    for user in users[:2]:
        feed = compute_feed_hash(user, topic_index)
        ranked = rank_feed(user, feed)
        
        print(f"User {user.id} ({user.name}) Top 5 Feed:")
        print(f"Preferences: {user.preferred_topics}")
        for score, article in ranked[:5]:
            print(f"  - [Score: {score:.2f}] {article.title}")
        print()