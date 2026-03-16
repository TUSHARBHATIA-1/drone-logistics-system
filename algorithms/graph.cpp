#ifndef GRAPH_H
#define GRAPH_H

#include <vector>
#include <string>
#include <map>

using namespace std;

const int INF = 1e9;

struct Edge {
    int to;
    int weight;
};

class Graph {
public:
    int V;
    vector<vector<Edge>> adj;
    map<int, string> nodeNames;

    Graph(int V) : V(V), adj(V) {}

    void addEdge(int u, int v, int w) {
        adj[u].push_back({v, w});
        adj[v].push_back({u, w}); // Undirected for this demo
    }

    void setNodeName(int id, string name) {
        nodeNames[id] = name;
    }

    string getNodeName(int id) {
        return nodeNames[id];
    }
};

#endif
