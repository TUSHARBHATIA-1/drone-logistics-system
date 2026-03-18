/**
 * Route Optimizer - JavaScript Implementation of Dijkstra's Algorithm
 * 
 * This module replaces the C++ engine runtime dependency to ensure 100% compatibility 
 * with cloud platforms like Render while preserving the DSA (Data Structures & Algorithms) 
 * logic of the project.
 */

const INF = Infinity;

const nodeNames = {
    0: "Main Warehouse",
    1: "Downtown Hub",
    2: "Suburban Station",
    3: "Industrial Area",
    4: "Residential Park",
    5: "Coastal Port"
};

// Adjacency list representation
// [target, weight]
const graph = {
    0: [[1, 5], [2, 10]],
    1: [[0, 5], [2, 3], [3, 8]],
    2: [[0, 10], [1, 3], [4, 2]],
    3: [[1, 8], [4, 6], [5, 4]],
    4: [[2, 2], [3, 6], [5, 12]],
    5: [[3, 4], [4, 12]]
};

/**
 * Dijkstra's Algorithm
 * @param {number} startNode - Starting node index
 * @returns {object} { distances, parent }
 */
function dijkstra(startNode) {
    const numNodes = 6;
    const distances = new Array(numNodes).fill(INF);
    const parent = new Array(numNodes).fill(-1);
    const visited = new Array(numNodes).fill(false);

    distances[startNode] = 0;

    for (let i = 0; i < numNodes - 1; i++) {
        let u = -1;
        for (let j = 0; j < numNodes; j++) {
            if (!visited[j] && (u === -1 || distances[j] < distances[u])) {
                u = j;
            }
        }

        if (distances[u] === INF) break;

        visited[u] = true;

        const neighbors = graph[u] || [];
        for (const [v, weight] of neighbors) {
            if (distances[u] + weight < distances[v]) {
                distances[v] = distances[u] + weight;
                parent[v] = u;
            }
        }
    }

    return { distances, parent };
}

/**
 * Reconstructs the path from start to target
 */
function getPath(parent, target) {
    const path = [];
    for (let v = target; v !== -1; v = parent[v]) {
        path.push(nodeNames[v]);
    }
    return path.reverse();
}

/**
 * Main OPTIMIZE mode logic
 */
const optimizeRoute = (start, target) => {
    try {
        const { distances, parent } = dijkstra(Number(start));
        if (distances[target] === INF) {
            return { success: false, message: "No path found" };
        }

        return {
            success: true,
            distance: distances[target],
            route: getPath(parent, target)
        };
    } catch (error) {
        console.error("Optimization Fallback Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Main SAFETY mode logic
 */
const getSafetyRoute = (current) => {
    try {
        const { distances, parent } = dijkstra(Number(current));
        const safetyHubs = [0, 2, 5];
        let nearestHub = -1;
        let minDistance = INF;

        for (const hub of safetyHubs) {
            if (hub === Number(current)) continue;
            if (distances[hub] < minDistance) {
                minDistance = distances[hub];
                nearestHub = hub;
            }
        }

        if (nearestHub !== -1) {
            return {
                success: true,
                nearestHub: nodeNames[nearestHub],
                distance: minDistance,
                route: getPath(parent, nearestHub)
            };
        }

        return { success: false, message: "No safety hub reachable" };
    } catch (error) {
        console.error("Safety Fallback Error:", error);
        return { success: false, message: error.message };
    }
};

module.exports = {
    optimizeRoute,
    getSafetyRoute
};
