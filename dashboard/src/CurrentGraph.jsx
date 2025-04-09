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
import { Activity } from "react-bootstrap-icons";

const CurrentGraph = ({ data }) => {
  const [selected, setSelected] = useState("a1");

  const renderLines = () => {
    switch (selected) {
      case "a1":
        return <Line type="monotone" dataKey="current1" stroke="#00FF7F" strokeWidth={2} dot={false} />;
      case "a2":
        return <Line type="monotone" dataKey="current2" stroke="#00CED1" strokeWidth={2} dot={false} />;
      case "a3":
        return <Line type="monotone" dataKey="current3" stroke="#1E90FF" strokeWidth={2} dot={false} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: "#0B0B0B", borderRadius: "12px", padding: "1rem", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Activity color="white" />
          <h5 style={{ margin: 0 }}>Current (A)</h5>
        </div>
        <div></div>
      </div>

      <div style={{ margin: "10px 0", display: "flex", gap: "0.5rem" }}>
        {["a1", "a2", "a3"].map((type) => (
          <button
            key={type}
            onClick={() => setSelected(type)}
            style={{
              backgroundColor: selected === type ? "#1E90FF" : "#1f1f1f",
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
          <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
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

export default CurrentGraph;
