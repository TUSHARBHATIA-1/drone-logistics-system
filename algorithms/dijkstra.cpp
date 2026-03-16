#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
#include "graph.cpp"

using namespace std;

struct DijkstraResult {
    vector<int> distances;
    vector<int> parent;
};

DijkstraResult dijkstra(Graph& g, int start) {
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<int> dist(g.V, INF);
    vector<int> parent(g.V, -1);

    dist[start] = 0;
    pq.push({0, start});

    while (!pq.empty()) {
        int d = pq.top().first;
        int u = pq.top().second;
        pq.pop();

        if (d > dist[u]) continue;

        for (auto& edge : g.adj[u]) {
            if (dist[u] + edge.weight < dist[edge.to]) {
                dist[edge.to] = dist[u] + edge.weight;
                parent[edge.to] = u;
                pq.push({dist[edge.to], edge.to});
            }
        }
    }

    return {dist, parent};
}

vector<int> getPath(const vector<int>& parent, int target) {
    vector<int> path;
    for (int v = target; v != -1; v = parent[v]) {
        path.push_back(v);
    }
    reverse(path.begin(), path.end());
    return path;
}
