"use client";

import React, { useState, memo, useCallback } from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

const DeliveryPickupModal = () => {
  const [isDeliveryPickupModalOpen, setIsDeliveryPickupModalOpen] =
    useState(true);
  const [address, setAddress] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedOption, setSelectedOption] = useState("Delivery");
  const [inputHasValue, setInputHasValue] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onPlaceChanged = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      console.log("Place:", place);
      console.log("Formatted address:", place.formatted_address);
      setAddress(place.formatted_address || address);
    }
  }, [autocomplete, address]);

  const handleInputChange = useCallback((e) => {
    const inputValue = e.target.value;
    setAddress(inputValue);
    setInputHasValue(inputValue.length > 0);
  }, []);

  const handleCloseModal = () => {
    if (!inputHasValue) {
      setIsDeliveryPickupModalOpen(false);
    }
  };

  return (
    <>
      <Modal
        className="pickup"
        open={isDeliveryPickupModalOpen}
        onClose={handleCloseModal}
      >
        <button
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            fontSize: "20px",
            color: "#000000",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
          }}
          onClick={handleCloseModal}
        >
          &times;
        </button>

        <div className="button-group">
          <Button
            onClick={() => setSelectedOption("Delivery")}
            style={{
              backgroundColor:
                selectedOption === "Delivery" ? "#007BFF" : "#FFF",
              color: selectedOption === "Delivery" ? "#FFF" : "#000",
              marginRight: "10px",
            }}
          >
            Delivery
          </Button>
          <Button
            onClick={() => setSelectedOption("Pickup")}
            style={{
              backgroundColor: selectedOption === "Pickup" ? "#007BFF" : "#FFF",
              color: selectedOption === "Pickup" ? "#FFF" : "#000",
              marginBottom: "10px",
            }}
          >
            Pickup
          </Button>
        </div>

        <div className="address-input">
          {isLoaded ? (
            <Autocomplete
              onLoad={(autocompleteInstance) =>
                setAutocomplete(autocompleteInstance)
              }
              onPlaceChanged={onPlaceChanged}
              options={{
                componentRestrictions: { country: "nz" },
              }}
            >
              <input
                type="text"
                value={address}
                onChange={handleInputChange}
                placeholder="Search address"
                style={{ padding: "10px", width: "80%" }}
              />
            </Autocomplete>
          ) : (
            <input
              type="text"
              placeholder="Loading..."
              disabled
              style={{ padding: "10px", width: "80%" }}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default memo(DeliveryPickupModal);
