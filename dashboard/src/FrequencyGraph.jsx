import React from "react";
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

const FrequencyGraph = ({ data }) => {
  return (
    <div style={{ backgroundColor: "#0B0B0B", borderRadius: "12px", padding: "1rem", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Activity color="white" />
          <h5 style={{ margin: 0 }}>Frequency (Hz)</h5>
        </div>
        <div></div>
      </div>

      <ResponsiveContainer width="100%" height={305}>
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
          <Line type="monotone" dataKey="frequency" stroke="#FF1493" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FrequencyGraph;
