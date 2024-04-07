import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup  } from "react-leaflet";
import L from "leaflet";
import markerIconUrl from '../../static/6.png';
import "leaflet/dist/leaflet.css";
import osm from "./osm-providers";

const markerIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconSize: [40, 40],
  iconAnchor: [20, 40], // 根据您的图标调整
  popupAnchor: [0, -40], // 根据您的图标调整
  shadowUrl: null, // 如果不需要阴影可以设置为null
  shadowSize: null, // 同上
  shadowAnchor: null, // 同上
});

const MarkersMap = ({ zoom, markers, lat, lng }) => {
  const [center, setCenter] = useState({ lat: lat, lng: lng });
  const ZOOM_LEVEL = zoom;
  const mapRef = useRef();

  return (
    <>
      <div className="row">
        <div className="col text-center">
          <div className="col">
            <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
              <TileLayer
                url={osm.maptiler.url}
                attribution={osm.maptiler.attribution}
              />

              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={[marker.lat, marker.lng]}
                  icon={markerIcon}
                >
                  <Popup>
                    <b>
                      {marker.state} :  {marker.accuracy}
                    </b>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarkersMap;
