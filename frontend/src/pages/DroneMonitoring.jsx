import React, { useState, useEffect } from 'react';
import { 
    Activity, 
    Battery, 
    MapPin, 
    AlertCircle, 
    ShieldAlert, 
    RefreshCcw,
    Zap,
    Package,
    Navigation,
    Loader2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDronesMonitoring } from '../services/monitorService';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom hook to update map center when drone is selected
const RecenterMap = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 15, { duration: 1.5 });
        }
    }, [position, map]);
    return null;
};

const DroneMonitoring = () => {
    const [drones, setDrones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDrone, setSelectedDrone] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchTelemetry = async () => {
        try {
            const data = await getDronesMonitoring();
            const validData = Array.isArray(data) ? data : [];
            setDrones(validData);
            setLastUpdated(new Date());
            
            // Check for battery alerts
            validData.forEach(drone => {
                if (drone.currentBattery < 10) {
                    console.warn(`CRITICAL: Drone ${drone.droneId} battery is ${drone.currentBattery}%. EMERGENCY LANDING SUGGESTED.`);
                } else if (drone.currentBattery < 20) {
                    console.warn(`WARNING: Drone ${drone.droneId} battery is low (${drone.currentBattery}%).`);
                }
            });
        } catch (error) {
            console.error('Failed to fetch telemetry, using fallback', error);
            setDrones([
                {
                    _id: 't1',
                    droneId: 'SKY-001',
                    modelNumber: 'Phantom X',
                    currentBattery: 85,
                    status: 'available',
                    currentLocation: [28.6139, 77.2090]
                },
                {
                    _id: 't2',
                    droneId: 'ATLAS-09',
                    modelNumber: 'Heavy Lifter',
                    currentBattery: 15,
                    status: 'busy',
                    currentLocation: [28.6250, 77.2200],
                    assignedDelivery: 'DEL-104'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTelemetry();
        const interval = setInterval(fetchTelemetry, 5000); // 5s Polling
        return () => clearInterval(interval);
    }, []);

    const getStatusStyles = (status, battery) => {
        if (battery < 20) return { 
            color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', 
            label: 'Low Battery', 
            icon: Zap 
        };
        switch (status) {
            case 'available': return { color: 'text-green-400 bg-green-500/10 border-green-500/20', label: 'Available', icon: Activity };
            case 'busy': return { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', label: 'Delivering', icon: Navigation };
            case 'maintenance': return { color: 'text-red-400 bg-red-500/10 border-red-500/20', label: 'Under Repair', icon: AlertCircle };
            default: return { color: 'text-dark-400 bg-dark-500/10 border-dark-500/20', label: status, icon: Activity };
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl text-white font-bold">Live Fleet Monitor</h2>
                    <p className="text-dark-400 mt-1 flex items-center gap-2">
                        Real-time telemetry and battery status 
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse ml-2"></span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-dark-500">Live Sync Every 5s</span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">Last Signal</p>
                    <p className="text-sm text-white font-mono">{lastUpdated.toLocaleTimeString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                {/* Drone List */}
                <div className="lg:col-span-1 glass-card overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-dark-800 bg-dark-900/50 flex items-center justify-between">
                        <h3 className="font-bold text-white uppercase text-xs tracking-widest">Active Fleet</h3>
                        {loading && <Loader2 className="w-4 h-4 animate-spin text-primary-400" />}
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {!Array.isArray(drones) || drones.length === 0 ? (
                            <div className="p-8 text-center opacity-40 italic">No drones in range</div>
                        ) : drones.map(drone => {
                            const config = getStatusStyles(drone?.status, drone?.currentBattery);
                            const StatusIcon = config?.icon || Activity;
                            return (
                                <div 
                                    key={drone?._id || Math.random()}
                                    onClick={() => setSelectedDrone(drone)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer group ${selectedDrone?._id === drone?._id ? 'bg-primary-500/10 border-primary-500/50' : 'bg-dark-950 border-dark-800 hover:border-dark-700'}`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${config?.color} border`}>
                                                <StatusIcon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{drone?.droneId || 'Drone'}</h4>
                                                <p className="text-[10px] text-dark-500 uppercase font-black">{drone?.modelNumber || 'Unknown Model'}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${config?.color}`}>
                                            {config?.label || 'Status'}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-[10px]">
                                            <span className="text-dark-400">Battery Level</span>
                                            <span className={`font-bold ${drone?.currentBattery < 20 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{Math.round(drone?.currentBattery || 0)}%</span>
                                        </div>
                                        <div className="h-1 bg-dark-900 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-1000 ${drone?.currentBattery < 20 ? 'bg-red-500' : 'bg-primary-500'}`}
                                                style={{ width: `${drone?.currentBattery || 0}%` }}
                                            ></div>
                                        </div>
                                        {drone?.assignedDelivery && (
                                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dark-800/50">
                                                <Package className="w-3 h-3 text-blue-400" />
                                                <span className="text-[10px] font-bold text-blue-400">{drone?.assignedDelivery}</span>
                                            </div>
                                        )}
                                    </div>

                                    {(drone?.currentBattery || 0) < 10 && (
                                        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 animate-pulse">
                                            <ShieldAlert className="w-3 h-3 text-red-500" />
                                            <span className="text-[8px] font-black uppercase text-red-500">Emergency Landing Suggested</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Live Map Tracking */}
                <div className="lg:col-span-2 glass-card relative overflow-hidden z-0">
                    <MapContainer 
                        center={[28.6139, 77.2090]} 
                        zoom={13} 
                        style={{ height: '100%', width: '100%', background: '#020617' }}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        {Array.isArray(drones) && drones.map(drone => (
                            <Marker 
                                key={drone._id} 
                                position={drone.currentLocation || [28.6139, 77.2090]}
                                onClick={() => setSelectedDrone(drone)}
                            >
                                <Popup>
                                    <div className="font-outfit p-1">
                                        <p className="font-bold text-dark-950 uppercase text-[10px] tracking-widest">{drone?.droneId || 'Drone'}</p>
                                        <div className="mt-1 space-y-1">
                                            <p className="text-xs flex items-center gap-2">
                                                <Zap className="w-3 h-3 text-primary-600" />
                                                Battery: {Math.round(drone?.currentBattery || 0)}%
                                            </p>
                                            <p className="text-xs flex items-center gap-2">
                                                <Activity className="w-3 h-3 text-blue-600" />
                                                Status: {drone?.status || 'Active'}
                                            </p>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        <RecenterMap position={selectedDrone?.currentLocation} />
                    </MapContainer>
                    
                    {/* Map Overlay Controls */}
                    <div className="absolute top-4 right-4 z-[400] space-y-2">
                        <button 
                            type="button"
                            onClick={fetchTelemetry}
                            className="p-3 bg-dark-900/80 backdrop-blur-md border border-dark-800 rounded-xl hover:border-primary-500 transition-all text-dark-200"
                        >
                            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {/* Live Tracking Status Overlay */}
                    <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
                        <div className="bg-dark-900/90 backdrop-blur-md border border-dark-800 px-4 py-2 rounded-xl flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Tracking Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DroneMonitoring;
