import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

// Custom Tooltip for both live & historical
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

    const value = payload[0].value;
    const labelName = payload[0].name === 'value' ? 'Energy' : 'Energy (Live)';
    const unit = 'kWh';

    return (
      <div style={{ backgroundColor: '#1e1e1e', padding: '8px', borderRadius: '4px', color: 'white' }}>
        <p>{formattedTime}</p>
        <p>
          {`${labelName}: ${
            typeof value === 'number' ? value.toFixed(2) : 'N/A'
          } ${unit}`}
        </p>
      </div>
    );
  }
  return null;
};


const EnergyGraph = ({ data }) => {
  // 🧠 Determine format type based on keys
  const isHistorical = data?.[0]?.time && data?.[0]?.value;

  const processedData = isHistorical
    ? data.map(d => ({ ts: d.time, energy_consumption: d.value })) // match live data shape
    : data; // already live data

  return (
    <div style={{ backgroundColor: "#0B0B0B", borderRadius: "12px", padding: "1rem", color: "white" }}>
      <h5>⚡ Energy Consumption (kWh)</h5>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={processedData}>
          <defs>
            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF5733" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#FF5733" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="ts" hide={true}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="energy_consumption"
            stroke="#FF5733"
            fill="url(#colorEnergy)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyGraph;
