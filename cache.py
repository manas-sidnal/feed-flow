import collections
from typing import List

class LRUCache:
    def __init__(self, num_users, capacity=None):
        self.cache = collections.OrderedDict()
        self.capacity = capacity or max(1, int(num_users * 0.2))
        self.hits = 0
        self.misses = 0

    def get(self, user_id):
        if user_id in self.cache:
            self.cache.move_to_end(user_id)
            self.hits += 1
            return True, self.cache[user_id]

        self.misses += 1
        return False, None

    def put(self, user_id, feed):
        self.cache[user_id] = feed
        self.cache.move_to_end(user_id)

        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

    def get_keys(self):
        return list(self.cache.keys())


class FIFOCache:
    def __init__(self, num_users, capacity=None):
        self.cache = {}
        self.queue = collections.deque()
        self.capacity = capacity or max(1, int(num_users * 0.2))
        self.hits = 0
        self.misses = 0

    def get(self, user_id):
        if user_id in self.cache:
            self.hits += 1
            return True, self.cache[user_id]

        self.misses += 1
        return False, None

    def put(self, user_id, feed):
        if user_id not in self.cache:
            if len(self.cache) >= self.capacity:
                oldest = self.queue.popleft()
                del self.cache[oldest]

            self.queue.append(user_id)

        self.cache[user_id] = feed

    def get_keys(self):
        return list(self.queue)


class OptimalCache:
    def __init__(self, requests: List[int], num_users, capacity=None):
        self.cache = {}
        self.capacity = capacity or max(1, int(num_users * 0.2))
        self.hits = 0
        self.misses = 0
        self.requests = requests
        self.current_index = 0

    def get(self, user_id):
        if user_id in self.cache:
            self.hits += 1
            result = (True, self.cache[user_id])
        else:
            self.misses += 1
            result = (False, None)

        self.current_index += 1
        return result

    def put(self, user_id, feed):
        if user_id not in self.cache:
            if len(self.cache) >= self.capacity:
                self._evict()

            self.cache[user_id] = feed

    def _evict(self):
        future_requests = self.requests[self.current_index:]
        farthest_user = None
        farthest_index = -1

        for user_id in self.cache.keys():
            if user_id not in future_requests:
                del self.cache[user_id]
                return

            index = future_requests.index(user_id)

            if index > farthest_index:
                farthest_index = index
                farthest_user = user_id

        if farthest_user is not None:
            del self.cache[farthest_user]

    def get_keys(self):
        return list(self.cache.keys())