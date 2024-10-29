"use client";

import React, { useState, memo, useEffect, useRef } from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";

const DeliveryPickupModal = () => {
  const [isDeliveryPickupModalOpen, setIsDeliveryPickupModalOpen] =
    useState(true);
  const [selectedOption, setSelectedOption] = useState("Delivery");
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    let checkCount = 0;
    const maxChecks = 50;
    const checkGoogleMapsLoaded = () => {
      return window.google && window.google.maps && window.google.maps.places;
    };

    const checkAndWait = () => {
      if (checkGoogleMapsLoaded()) {
        if (isSubscribed) {
          setGoogleMapsLoaded(true);
        }
        return;
      }

      checkCount++;
      if (checkCount < maxChecks) {
        setTimeout(checkAndWait, 200);
      }
    };

    const loadGoogleMapsScript = () => {
      if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      checkAndWait();
    };

    loadGoogleMapsScript();

    return () => {
      isSubscribed = false;
      if (autocompleteRef.current && window.google && window.google.maps) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, []);

  useEffect(() => {
    if (!googleMapsLoaded || !inputRef.current || autocompleteRef.current)
      return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "nz" },
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.formatted_address) {
          setInputValue(place.formatted_address);
          setSuggestions([]);
        }
      });

      inputRef.current.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      });
    } catch (error) {
      console.error("Error initializing Autocomplete:", error);
    }
  }, [googleMapsLoaded]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value || !googleMapsLoaded) {
      setSuggestions([]);
      return;
    }

    try {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: "nz" },
          types: ["address"],
        },
        (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    } catch (error) {
      console.error("Error getting place predictions:", error);
      setSuggestions([]);
    }
  };

  const handleCloseModal = () => {
    setIsDeliveryPickupModalOpen(false);
  };

  const handleSelectAddress = (selectedAddress) => {
    setInputValue(selectedAddress);
    setSuggestions([]);
    localStorage.setItem("selectedAddress", selectedAddress);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.google.maps.Geocoder();

          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              if (status === "OK" && results[0]) {
                setInputValue(results[0].formatted_address);
                localStorage.setItem(
                  "selectedAddress",
                  results[0].formatted_address
                );
                setSuggestions([]);
              } else {
                console.error("Geocoder failed due to: " + status);
              }
            }
          );
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert(
              "Location access is required to use this feature. Please allow location access or manually enter your address."
            );
          } else {
            console.error("Error getting location:", error);
            alert(
              "Unable to retrieve your location. Please try again or enter your address manually."
            );
          }
        }
      );
    } else {
      alert(
        "Geolocation is not supported by this browser. Please enter your address manually."
      );
    }
  };

  return (
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
            backgroundColor: selectedOption === "Delivery" ? "#ffc404" : "#FFF",
            color: "#000",
            marginRight: "10px",
          }}
        >
          Delivery
        </Button>
        <Button
          onClick={() => setSelectedOption("Pickup")}
          style={{
            backgroundColor: selectedOption === "Pickup" ? "#ffc404" : "#FFF",
            color: "#000",
            marginBottom: "10px",
          }}
        >
          Pickup
        </Button>
      </div>

      <div>
        <p>Search for a place here:</p>
        <div style={{ width: "100%", marginTop: "10px", position: "relative" }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter a location"
            style={{
              width: "100%",
              height: "40px",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />

          {suggestions.length > 0 && (
            <ul
              style={{
                listStyle: "none",
                padding: "0",
                margin: "0",
                border: "1px solid #ccc",
                borderRadius: "4px",
                maxHeight: "200px",
                overflowY: "auto",
                position: "absolute",
                top: "100%",
                left: "0",
                right: "0",
                backgroundColor: "white",
                zIndex: "1000",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectAddress(suggestion.description)}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom:
                      index < suggestions.length - 1
                        ? "1px solid #eee"
                        : "none",
                    backgroundColor: "#fff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff";
                  }}
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Button onClick={handleCurrentLocation} style={{ marginTop: "20px" }}>
        Use My Current Location
      </Button>
    </Modal>
  );
};

export default memo(DeliveryPickupModal);
