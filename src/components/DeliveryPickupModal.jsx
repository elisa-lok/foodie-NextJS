"use client";

import React, { useState } from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

const DeliveryPickupModal = ({ open, onClose }) => {
  console.log("Modal open:", open);
  if (!open) return null;

  const [address, setAddress] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      setAddress(place.formatted_address || address);
    }
  };

  return (
    <Modal className="pickup" open={open} onClose={onClose}>
      <div className="modal-content">
        <h2>Choose Delivery or Pickup</h2>
        <div className="button-group">
          <Button onClick={() => console.log("Delivery selected")}>
            Delivery
          </Button>
          <Button onClick={() => console.log("Pickup selected")}>Pickup</Button>
        </div>
        <div className="address-input">
          <label>Enter Address:</label>
          {isLoaded ? (
            <Autocomplete
              onLoad={(autocompleteInstance) =>
                setAutocomplete(autocompleteInstance)
              }
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Search address"
              />
            </Autocomplete>
          ) : (
            <input type="text" placeholder="Loading..." disabled />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DeliveryPickupModal;
