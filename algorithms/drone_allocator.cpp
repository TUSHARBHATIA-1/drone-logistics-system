#include <iostream>
#include <string>
#include <vector>

using namespace std;

struct Drone {
    string id;
    int batteryLevel;
    bool available;
};

class DroneAllocator {
public:
    void allocateDrone(string taskId, vector<Drone>& fleet) {
        for (auto& drone : fleet) {
            if (drone.available && drone.batteryLevel > 20) {
                cout << "Allocated Drone " << drone.id << " to Task " << taskId << endl;
                drone.available = false;
                return;
            }
        }
        cout << "No drones available for Task " << taskId << endl;
    }
};

int main() {
    cout << "Drone Allocator Engine initialized." << endl;
    return 0;
}
