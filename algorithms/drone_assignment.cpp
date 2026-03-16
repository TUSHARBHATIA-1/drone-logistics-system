#include <iostream>
#include <vector>
#include <string>
#include "dijkstra.cpp"

using namespace std;

int main(int argc, char* argv[]) {
    // Initialize standard delivery graph
    Graph deliveryNetwork(6);
    deliveryNetwork.setNodeName(0, "HQ Warehouse");
    deliveryNetwork.setNodeName(1, "Urban Hub A");
    deliveryNetwork.setNodeName(2, "Storage Zone B");
    deliveryNetwork.setNodeName(3, "Delivery Dock C");
    deliveryNetwork.setNodeName(4, "Landing Pad D");
    deliveryNetwork.setNodeName(5, "Emergency Hub E");

    deliveryNetwork.addEdge(0, 1, 5);
    deliveryNetwork.addEdge(0, 2, 8);
    deliveryNetwork.addEdge(1, 2, 3);
    deliveryNetwork.addEdge(1, 3, 10);
    deliveryNetwork.addEdge(2, 4, 2);
    deliveryNetwork.addEdge(3, 4, 4);
    deliveryNetwork.addEdge(3, 5, 12);
    deliveryNetwork.addEdge(4, 5, 5);

    if (argc < 3) {
        cerr << "Usage: " << argv[0] << " <MODE> <PARAM1> [PARAM2]" << endl;
        return 1;
    }

    string mode = argv[1];

    if (mode == "OPTIMIZE") {
        int start = stoi(argv[2]);
        int target = stoi(argv[3]);
        DijkstraResult res = dijkstra(deliveryNetwork, start);
        if (res.distances[target] == INF) cout << "RESULT:FAILED" << endl;
        else {
            vector<int> path = getPath(res.parent, target);
            cout << "RESULT:SUCCESS" << endl;
            cout << "DISTANCE:" << res.distances[target] << endl;
            cout << "ROUTE:";
            for (int i=0; i<path.size(); ++i) { cout << deliveryNetwork.getNodeName(path[i]) << (i < path.size()-1 ? "," : ""); }
            cout << endl;
        }
    } else if (mode == "SAFETY") {
        int current = stoi(argv[2]);
        DijkstraResult res = dijkstra(deliveryNetwork, current);
        vector<int> hubs = {0, 2, 5};
        int near = -1, minD = INF;
        for (int h : hubs) { if (h != current && res.distances[h] < minD) { minD = res.distances[h]; near = h; } }
        if (near != -1) {
            vector<int> path = getPath(res.parent, near);
            cout << "RESULT:SUCCESS" << endl;
            cout << "NEAREST_HUB:" << deliveryNetwork.getNodeName(near) << endl;
            cout << "DISTANCE:" << minD << endl;
            cout << "ROUTE:";
            for (int i=0; i<path.size(); ++i) { cout << deliveryNetwork.getNodeName(path[i]) << (i < path.size()-1 ? "," : ""); }
            cout << endl;
        } else cout << "RESULT:FAILED" << endl;
    }
    return 0;
}
