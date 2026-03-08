import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet ka default icon fix karna padta hai React mein
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = ({ coordinates, businessName }) => {
  // MongoDB: [Lng, Lat] -> Leaflet: [Lat, Lng]
  // Coordinates ulte karne padenge
  const position = [coordinates[1], coordinates[0]];

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden z-0">
      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={false} 
        className="h-full w-full"
      >
        {/* OpenStreetMap Tile Layer (Free Skin) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={position}>
          <Popup>
            <span className="font-bold">{businessName}</span> <br /> is here.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;