import { useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import "../styles/globals.css";
import Places from "./places";
const mapContainerStyle = {
  width: "80vw",
  height: "100vh",
};
const libraries = ["places"];
const MapPrediction = () => {
  const [officePosition, setOfficePosition] = useState(null);
  const center = useMemo(() => ({ lat: 49.276765, lng: -122.917957 }), []);
  const options = useMemo(
    () => ({
      mapId: "55474bd884220168",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAOzdWMGEEIt-yYbLgI5xUZqDQz4LLqpYE",
    libraries,
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    // You can now use map.setTilt(45) and map.setHeading(90) here
    if (map.getTilt() !== 45) {
      map.setTilt(45);
    }
    map.setHeading(90); // Rotate 90 degrees from North
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <div className="container">
      <div className="controls">
        <h1>Commute?</h1>
        <Places
          setOffice={(position) => {
            setOfficePosition(position);
            mapRef.current?.panTo(position);
          }}
        />
      </div>
      <div className="map">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={18}
          center={center}
          mapTypeId={"satellite"}
          onLoad={onMapLoad}
        >
          {officePosition && (
            <>
              <Marker
                position={officePosition}
                // icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
              />
              <Circle
                center={officePosition}
                radius={100}
                options={closeOptions}
              />
              <Circle
                center={officePosition}
                radius={200}
                options={middleOptions}
              />
              <Circle
                center={officePosition}
                radius={300}
                options={farOptions}
              />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};
const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};
export default MapPrediction;
