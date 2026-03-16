const Drone = require('../models/Drone');

/**
 * Simulation Service
 * Handles real-time drone movement and battery depletion.
 * In a real production app, this would be a separate microservice or worker.
 */
const startSimulation = () => {
    console.log('Drone Telemetry Simulation Started (5s intervals)');
    
    setInterval(async () => {
        try {
            const busyDrones = await Drone.find({ status: 'busy' });

            for (const drone of busyDrones) {
                if (!drone.currentRoute || drone.currentRoute.length === 0) continue;

                const currentCoords = drone.currentLocation;
                const nextCoords = drone.currentRoute[0]; // Take the first available node in the route

                // Logic: Move to the next coordinate in the array
                // We'll treat the array as a queue of waypoints
                drone.currentLocation = nextCoords;
                
                // Remove the waypoint we just reached
                drone.currentRoute.shift();

                // Battery Drain: 1.5% per move
                drone.currentBattery = Math.max(0, drone.currentBattery - 1.5);

                // If no more nodes in route, drone has arrived
                if (drone.currentRoute.length === 0) {
                    drone.status = 'available';
                    drone.assignedDelivery = null;
                }

                await drone.save();
                console.log(`[SIM] Drone ${drone.droneId} moved to ${nextCoords}. Battery: ${drone.currentBattery}%`);
            }
        } catch (error) {
            console.error('[SIM ERROR]', error);
        }
    }, 5000); // 5 second tick
};

module.exports = { startSimulation };
