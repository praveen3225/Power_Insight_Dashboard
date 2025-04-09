import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formattedTime = new Date(label).toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(',', '');

    return (
      <div style={{ backgroundColor: '#1e1e1e', padding: '8px', borderRadius: '4px', color: 'white' }}>
        <p>{formattedTime}</p>
        <p>{`GHG: ${payload[0].value.toFixed(4)} tons CO₂e`}</p>
      </div>
    );
  }
  return null;
};

const GHGGraph = ({ data }) => (
  <div style={{ backgroundColor: "#0B0B0B", borderRadius: "12px", padding: "1rem", color: "white" }}>
    <h5>🌿 GHG Emission (tCO₂e)</h5>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorGHG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00FF66" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#00FF66" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="ts" hide />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="ghg" stroke="#00FF66" fill="url(#colorGHG)" strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default GHGGraph;
