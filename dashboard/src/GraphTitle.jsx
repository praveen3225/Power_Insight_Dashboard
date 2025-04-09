import React from "react";
import "./GraphTitle.css";
import TimeModeSelector from "./TimeModeSelector";
import Button from "react-bootstrap/Button";

function GraphTitle({ timeMode, setTimeMode, title}) {
    return (
        <>
            <div className="title-row-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
                <div>
                    <h4 style={{ color: "white" }}>Statistics: Device {title}</h4>
                </div>
                
                <div>
                    <TimeModeSelector timeMode={timeMode} setTimeMode={setTimeMode} />
                </div>
            </div>
        </>
    );
}

export default GraphTitle;
