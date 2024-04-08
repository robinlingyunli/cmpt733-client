import React, { useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in kilometers
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = R * c; // Distance in kilometers
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
export default function Places({ setOffice, setLocations }) {
  const [selectionMade, setSelectionMade] = useState(false);
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ requestOptions: {}, debounce: 300 });

  const handleInput = (e) => {
    setValue(e.target.value);
    setSelectionMade(false);
  };
  const handleClearInput = () => {
    setValue("");
    clearSuggestions();
  };
  const sendLatLonToBackend = async (lat, lng) => {
    try {
      const response = await fetch("http://52.9.248.230/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat, lng }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const locations = await response.json();
      // Assuming setOffice or another state hook will be used to handle the received data
      console.log("Received from backend:", locations);
      // setLocations(locations);
      const locationsWithDistance = locations.map((location) => {
        const distance = getDistanceFromLatLonInKm(
          lat,
          lng,
          location.lat,
          location.lng
        );
        return { ...location, distance, isActive: false }; // Append distance to each location
      });
      setLocations(locationsWithDistance);
      // Here you might want to update the state or perform other actions with the locations
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    setSelectionMade(true);
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setOffice({ lat, lng }); // This sets the selected office location on the map
      sendLatLonToBackend(lat, lng); // Correctly passing lat and lng
    } catch (error) {
      console.error("Error: ", error);
      setSelectionMade(false);
    }
  };

  return (
    <Combobox onSelect={handleSelect}>
      <div style={{ position: "relative" }}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          className="combobox-input"
          placeholder="Enter a place name or postal code"
          style={{ width: "100%", paddingRight: "30px" }} // Ensure input takes full width of the container
        />
        {value && (
          <button
            onClick={handleClearInput}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              background: "transparent",
              border: "none",
              color: "#999",
              fontWeight: "bold",
            }}
            aria-label="Clear text"
          >
            X
          </button>
        )}
      </div>
      <ComboboxPopover>
        {status === "OK" ? (
          <ComboboxList>
            {data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
          </ComboboxList>
        ) : (
          !selectionMade &&
          value && (
            <div style={{ padding: "0.5rem" }}>
              No locations found. Try another postal code.
            </div>
          )
        )}
      </ComboboxPopover>
    </Combobox>
  );
}
