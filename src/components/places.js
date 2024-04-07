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

export default function Places({ setOffice }) {
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

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setOffice({ lat, lng });
      setSelectionMade(true)
    } catch (error) {
      console.error("Error: ", error);
      setSelectionMade(false);
    }
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={handleInput}
        disabled={!ready}
        className="combobox-input"
        placeholder="Enter a place name or postal code"
      />
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
