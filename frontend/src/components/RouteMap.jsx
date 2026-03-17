import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon not showing correctly in some environments
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to fit bounds when route changes
const FitBounds = ({ route }) => {
    const map = useMap();
    useEffect(() => {
        if (route && route.length > 0) {
            map.fitBounds(L.polyline(route).getBounds(), { padding: [50, 50] });
        }
    }, [route, map]);
    return null;
};

const RouteMap = ({ data }) => {
    if (!data || !data.route) {
        return (
            <div className="h-full w-full bg-dark-950 flex items-center justify-center text-dark-500 font-outfit italic">
                Awaiting mission coordinates...
            </div>
        );
    }

    const { warehouse, pickup, deliveries, route } = data;

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border border-dark-800 shadow-2xl relative z-0">
            <MapContainer 
                center={warehouse} 
                zoom={13} 
                style={{ height: '100%', width: '100%', background: '#020617' }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                {/* Warehouse Marker */}
                <Marker position={warehouse}>
                    <Popup>
                        <div className="font-bold">HQ Warehouse</div>
                        <div className="text-xs">Central Hub</div>
                    </Popup>
                </Marker>

                {/* Pickup Marker */}
                <Marker position={pickup}>
                    <Popup>
                        <div className="font-bold text-primary-500">Pickup Point</div>
                        <div className="text-xs">Node ID: Active</div>
                    </Popup>
                </Marker>

                {/* Delivery Markers */}
                {Array.isArray(deliveries) && deliveries.map((pos, idx) => (
                    <Marker key={idx} position={pos}>
                        <Popup>
                            <div className="font-bold text-green-500">Delivery Location {idx + 1}</div>
                            <div className="text-xs">Destination Reachable</div>
                        </Popup>
                    </Marker>
                ))}

                {/* Optimized Route Polyline */}
                {Array.isArray(route) && route.length > 0 && (
                    <Polyline 
                        positions={route} 
                        color="#6366f1" 
                        weight={4} 
                        opacity={0.8}
                        dashArray="10, 10"
                    />
                )}

                <FitBounds route={route} />
            </MapContainer>
        </div>
    );
};

export default RouteMap;
