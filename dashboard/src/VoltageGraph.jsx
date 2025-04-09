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

  const lineDefs = {
    v1: ["volt1"],
    v2: ["volt2"],
    v3: ["volt3"],
    all: ["volt1", "volt2", "volt3"],
  };

  const lineColors = {
    volt1: "#FFD700", // Gold
    volt2: "#FFA500", // Orange
    volt3: "#FF4500", // OrangeRed
  };

  const renderLines = () =>
    lineDefs[selected].map((key) => (
      <Line
        key={key}
        type="monotone"
        dataKey={key}
        stroke={lineColors[key]}
        strokeWidth={2}
        dot={false}
      />
    ));

  return (
    <div style={{ backgroundColor: "#0B0B0B", borderRadius: "12px", padding: "1rem", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Lightning color="white" />
          <h5 style={{ margin: 0 }}>Voltage (V)</h5>
        </div>
      </div>

      <div style={{ margin: "10px 0", display: "flex", gap: "0.5rem" }}>
        {["v1", "v2", "v3", "all"].map((type) => (
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
          <YAxis domain={["auto", "auto"]} />
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
