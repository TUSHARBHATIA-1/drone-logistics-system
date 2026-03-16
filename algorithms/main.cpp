#include <iostream>
#include <vector>
#include <string>
#include "dijkstra.cpp"

using namespace std;

int main(int argc, char* argv[]) {
    // 1. Initialize Graph with 6 locations
    Graph deliveryNetwork(6);
    deliveryNetwork.setNodeName(0, "Main Warehouse");
    deliveryNetwork.setNodeName(1, "Downtown Hub");
    deliveryNetwork.setNodeName(2, "Suburban Station");
    deliveryNetwork.setNodeName(3, "Industrial Area");
    deliveryNetwork.setNodeName(4, "Residential Park");
    deliveryNetwork.setNodeName(5, "Coastal Port");

    deliveryNetwork.addEdge(0, 1, 5);
    deliveryNetwork.addEdge(0, 2, 10);
    deliveryNetwork.addEdge(1, 2, 3);
    deliveryNetwork.addEdge(1, 3, 8);
    deliveryNetwork.addEdge(2, 4, 2);
    deliveryNetwork.addEdge(3, 4, 6);
    deliveryNetwork.addEdge(3, 5, 4);
    deliveryNetwork.addEdge(4, 5, 12);

    // 2. Parse command line arguments
    if (argc < 3) {
        cerr << "Usage: " << argv[0] << " <mode> <param1> [param2]" << endl;
        cerr << "Modes: OPTIMIZE <start> <target> | SAFETY <currentLocation>" << endl;
        return 1;
    }

    string mode = argv[1];

    if (mode == "OPTIMIZE") {
        if (argc < 4) {
            cerr << "Usage: " << argv[0] << " OPTIMIZE <startID> <targetID>" << endl;
            return 1;
        }
        int start = stoi(argv[2]);
        int target = stoi(argv[3]);

        DijkstraResult result = dijkstra(deliveryNetwork, start);

        if (result.distances[target] == INF) {
            cout << "RESULT:FAILED" << endl;
        } else {
            vector<int> path = getPath(result.parent, target);
            cout << "RESULT:SUCCESS" << endl;
            cout << "DISTANCE:" << result.distances[target] << endl;
            cout << "ROUTE:";
            for (size_t i = 0; i < path.size(); ++i) {
                cout << deliveryNetwork.getNodeName(path[i]);
                if (i < path.size() - 1) cout << ",";
            }
            cout << endl;
        }
    } else if (mode == "SAFETY") {
        int current = stoi(argv[2]);
        DijkstraResult result = dijkstra(deliveryNetwork, current);

        // Indices of warehouses/safety hubs
        vector<int> safetyHubs = {0, 2, 5}; 
        int nearestHub = -1;
        int minDistance = INF;

        for (int hub : safetyHubs) {
            if (hub == current) continue; // Already at a hub
            if (result.distances[hub] < minDistance) {
                minDistance = result.distances[hub];
                nearestHub = hub;
            }
        }

        if (nearestHub != -1) {
            vector<int> path = getPath(result.parent, nearestHub);
            cout << "RESULT:SUCCESS" << endl;
            cout << "NEAREST_HUB:" << deliveryNetwork.getNodeName(nearestHub) << endl;
            cout << "DISTANCE:" << minDistance << endl;
            cout << "ROUTE:";
            for (size_t i = 0; i < path.size(); ++i) {
                cout << deliveryNetwork.getNodeName(path[i]);
                if (i < path.size() - 1) cout << ",";
            }
            cout << endl;
        } else {
            cout << "RESULT:FAILED" << endl;
        }
    }

    return 0;
}
