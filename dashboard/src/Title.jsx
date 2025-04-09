import React, { useState } from "react";
import "./Title.css";
import { Button } from "react-bootstrap";
import { Download, List } from "react-bootstrap-icons";

const DEVICE_OPTIONS = ["1","6","8","10", "11", "12", "13", "16", "17","18"];

function Title({ onDeviceSelect }) {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleDeviceClick = (deviceId) => {
    onDeviceSelect(deviceId); // send selected device to parent
    setShowOverlay(false); // close overlay
  };

  return (
    <>
      <div className="title-row">
        <div style={{ display: "flex", padding: "0px 15px" }}>
          <List
            fill="lightgreen"
            size={30}
            style={{ cursor: "pointer" }}
            onClick={() => setShowOverlay(!showOverlay)}
          />
          <h4 style={{ marginLeft: "20px", color: "white" }}>Energy Meter</h4>
        </div>
        <div>
          <Button variant="success" className="flex items-center gap-2">
            <Download size={16} className="text-white" />
            Report
          </Button>
        </div>
      </div>

      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Select Device</h3>
            {DEVICE_OPTIONS.map((device) => (
              <Button
                key={device}
                variant="dark"
                className="my-2"
                onClick={() => handleDeviceClick(device)}
              >
                Device {device}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Title;
