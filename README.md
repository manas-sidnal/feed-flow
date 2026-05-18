# FeedFlow

FeedFlow is a full-stack simulation of a high-performance personalized article feed system. It demonstrates core backend engineering concepts, including hash-based search indexing, dynamic ranking algorithms, and caching strategies, paired with a modern Next.js frontend for data visualization.

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+

### Running the Backend
```bash
cd backend
# Install dependencies (flask, flask-cors)
pip install flask flask-cors
# Run the API server
python api.py
```
*Alternatively, run the interactive CLI simulation directly:*
```bash
python main.py --users 50 --articles 200 --requests 100
```

### Running the Frontend
```bash
cd feedflow-ui
npm install
npm run dev
```
Navigate to `http://localhost:3000` to view the FeedFlow interactive dashboard.

## Architecture

The project is divided into a **Flask** backend (`backend/`) and a **Next.js** frontend (`feedflow-ui/`).

### Backend (`backend/`)
The backend provides the core engine for generating, searching, and caching user feeds. It exposes a simulation endpoint (`/api/simulate`) that runs performance tests and algorithm comparisons.
- **Search Engine**: Compares a linear scan against a hash-based topic index, demonstrating significant speedups in retrieving relevant articles.
- **Ranking Engine**: Ranks retrieved articles based on user topic preferences, article popularity, recency (days since published), and a trending boost (computed from a sliding window of recent feeds).
- **Caching Simulation**: Implements and compares different cache replacement algorithms (LRU, FIFO, and Optimal Cache) for caching generated user feeds, showing cache hit/miss ratios over a generated string of user requests.
- **Data Generator**: Mocks realistic user profiles (with topic preferences) and articles (with timestamps, topics, and popularity scores).
- **Interactive CLI & API**: The backend can be run as a standalone CLI (`main.py`) or as a Flask API (`api.py`) to feed data to the frontend.

### Frontend (`feedflow-ui/`)
The frontend is a Next.js web application designed to visualize the results of the backend simulation.
- Consumes the `/api/simulate` endpoint.
- Displays metrics such as Hash Index vs. Linear Search speedup.
- Visualizes Cache Algorithm performance (FIFO vs. LRU vs. Optimal).
- Displays real-time simulation logs for the LRU cache.
- Shows sample generated user feeds and trending topics over time.

## Design Choices & Algorithms

1. **Hash Index over Linear Search** 
   By pre-computing a topic-to-article hash map (`build_topic_index`), the system avoids $O(N)$ linear scans through the article database. It achieves $O(1)$ topic lookups, drastically reducing feed generation latency.

2. **Multi-Factor Ranking Algorithm** 
   Instead of relying solely on chronological ordering, the ranking engine scores articles using a weighted formula:
   `Score = (Topic Weight * Popularity) + Recency + Trending Boost`
   This ensures feeds are personalized, high-quality, fresh, and relevant to current events.

3. **Sliding Window for Trending Topics** 
   The system maintains a sliding window of the last $N$ user feeds to dynamically identify and boost "trending" articles that appear frequently, successfully mimicking viral content propagation.

4. **Cache Algorithm Benchmarking** 
   FeedFlow implements a custom `LRUCache` (using an `OrderedDict` for $O(1)$ access and updates) and compares it against a standard `FIFOCache` and an `OptimalCache` (Belady's anomaly-free theoretical upper bound). This benchmark demonstrates why LRU is an industry standard for feed caching in production scenarios.

5. **Decoupled Architecture** 
   By separating the simulation logic into a Python/Flask API and a React/Next.js UI, the system allows for easy scalability, independent testing, and clear separation of concerns.
