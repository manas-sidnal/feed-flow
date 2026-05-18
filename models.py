from dataclasses import dataclass, field
from datetime import datetime
from typing import List

@dataclass
class Article:
    id: int
    title: str
    topic: str
    popularity: float
    timestamp: datetime
    
@dataclass
class User:
    id: int
    name: str
    preferred_topics: List[str]
    reading_history: List[int] = field(default_factory=list)