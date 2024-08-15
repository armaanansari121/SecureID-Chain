"use client";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

// Define the type for our position objects
interface Position {
  id: string;
  latitude: string;
  longitude: string;
  name: string;
}

// Sample data (replace this with your actual data)
const positions: Position[] = [
  { id: "1", latitude: "51.505", longitude: "-0.09", name: "London" },
  { id: "2", latitude: "48.8566", longitude: "2.3522", name: "Paris" },
  { id: "3", latitude: "40.7128", longitude: "-74.0060", name: "New York" },
];

const Map: React.FC = () => {
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    setMapKey(1);
  }, []);

  // Custom icon (optional)
  const customIcon = new Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div
      style={{
        height: "calc(100vh )",
        width: "100%",
        position: "relative",
        zIndex: 10,
      }}
    >
      {typeof window !== "undefined" && (
        <MapContainer
          key={mapKey}
          center={[51.505, -0.09]}
          zoom={3}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {positions.map((position) => (
            <Marker
              key={position.id}
              position={[
                parseFloat(position.latitude),
                parseFloat(position.longitude),
              ]}
              icon={customIcon}
            >
              <Popup>{position.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
