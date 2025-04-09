import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Lightning } from "react-bootstrap-icons";

const VoltageGraph = ({ data }) => {
  const [selected, setSelected] = useState("v1");

  const renderLines = () => {
    switch (selected) {
      case "v1":
        return <Line type="monotone" dataKey="volt1" stroke="#FFD700" strokeWidth={2} dot={false} />;
      case "v2":
        return <Line type="monotone" dataKey="volt2" stroke="#FFA500" strokeWidth={2} dot={false} />;
      case "v3":
        return <Line type="monotone" dataKey="volt3" stroke="#FF4500" strokeWidth={2} dot={false} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: "#0B0B0B", borderRadius: "12px", padding: "1rem", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Lightning color="white" />
          <h5 style={{ margin: 0 }}>Voltage (V)</h5>
        </div>
        <div></div>
      </div>

      <div style={{ margin: "10px 0", display: "flex", gap: "0.5rem" }}>
        {["v1", "v2", "v3"].map((type) => (
          <button
            key={type}
            onClick={() => setSelected(type)}
            style={{
              backgroundColor: selected === type ? "#FF4500" : "#1f1f1f",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ts" hide />
          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #444",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#ccc" }}
            itemStyle={{ color: "#fff" }}
            labelFormatter={(label) => new Date(label).toLocaleString()}
          />


          {renderLines()}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VoltageGraph;
