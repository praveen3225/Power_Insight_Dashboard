import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ExpenseTracker from './ExpenseTracker';
import Title from './Title';
import GraphTitle from './GraphTitle';
import VoltageGraph from './VoltageGraph';
import CurrentGraph from './CurrentGraph';
import FrequencyGraph from './FrequencyGraph';
import PowerFactorGraph from './PowerFactorGraph';
import EnergyGraph from './EnergyGraph';
import GHGGraph from './GHGGraph';
import axios from 'axios';

function App() {
  const [selectedDevice, setSelectedDevice] = useState("18");
  const [voltageData, setVoltageData] = useState({});
  const [currentData, setCurrentData] = useState({});
  const [frequencyData, setFrequencyData] = useState({});
  const [powerFactorData, setPowerFactorData] = useState({});
  const [energyData, setEnergyData] = useState({});
  const [ghgData, setGhgData] = useState({});
  const [timeMode, setTimeMode] = useState("m");
  //const [fullEnergyData, setFullEnergyData] = useState({});
  const [summary, setSummary] = useState({
    today: { energy: 0, cost: 0 },
    month: { energy: 0, cost: 0 },
    year: { energy: 0, cost: 0 },
  });
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const ws = useRef(null);

  const fetchHistoricalData = async (deviceId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/history/${deviceId}`);
      const messages = res.data;
      
      
      const voltage = {};
      const current = {};
      const frequency = {};
      const powerFactor = {};
      const energy = {};
      const ghg = {};
  
      const groupedVoltage = {};
      const groupedCurrent = {};
  
      messages.forEach(({ ts, params }) => {
        const timestamp = new Date(ts).getTime();
  
        for (const key in params) {
          const match = key.match(/\/(\d+)\/([^/]+)\/EM\/Main$/);
          if (!match) continue;
  
          const [_, id, param] = match;
  
          // Voltage grouping
          if (["volt1", "volt2", "volt3"].includes(param)) {
            groupedVoltage[id] = groupedVoltage[id] || {};
            groupedVoltage[id][timestamp] = groupedVoltage[id][timestamp] || { ts: new Date(ts).getTime()};
            groupedVoltage[id][timestamp][param] = params[key];
          }
  
          // Current grouping
          if (["current1", "current2", "current3"].includes(param)) {
            groupedCurrent[id] = groupedCurrent[id] || {};
            groupedCurrent[id][timestamp] = groupedCurrent[id][timestamp] || { ts: new Date(ts).getTime()};
            groupedCurrent[id][timestamp][param] = params[key];
          }
  
          if (param === "frequency") {
            frequency[id] = frequency[id] || [];
            frequency[id].push({ ts: timestamp, frequency: params[key] });
          }
  
          if (param === "powerfactor") {
            powerFactor[id] = powerFactor[id] || [];
            powerFactor[id].push({ ts: timestamp, powerfactor: params[key] });
          }
  
          if (param === "energy_consumption") {
            const energyVal = params[key];
            const ghgVal = energyVal * 0.00058;
  
            energy[id] = energy[id] || [];
            ghg[id] = ghg[id] || [];
  
            energy[id].push({ ts: timestamp, energy_consumption: energyVal });
            ghg[id].push({ ts: timestamp, ghg: ghgVal });
          }
        }
      });
  
      // Convert grouped voltage/current maps to arrays
      Object.keys(groupedVoltage).forEach(id => {
        voltage[id] = Object.values(groupedVoltage[id]);
      });
  
      Object.keys(groupedCurrent).forEach(id => {
        current[id] = Object.values(groupedCurrent[id]);
      });
  
      // Final state update
      setVoltageData(voltage);
      setCurrentData(current);
      setFrequencyData(frequency);
      setPowerFactorData(powerFactor);
      setEnergyData(energy);
      setGhgData(ghg);
    } catch (error) {
      console.error("Failed to fetch historical data", error);
    }
  };

  useEffect(() => {
    fetchHistoricalData(selectedDevice);
  }, [selectedDevice]);
  
  
  // 🧠 WebSocket - Store all device data
  useEffect(() => {
    // clear all on fresh mount
    setVoltageData({});
    setCurrentData({});
    setFrequencyData({});
    setPowerFactorData({});
    setEnergyData({});
    setGhgData({});
    setSummary({
      today: { energy: 0, cost: 0, ghg: 0 },
      month: { energy: 0, cost: 0, ghg: 0 },
      year: { energy: 0, cost: 0, ghg: 0 },
    });

    ws.current = new WebSocket("ws://localhost:8080/ws/mqtt");

    ws.current.onmessage = (event) => {
      const { ts, params } = JSON.parse(event.data);
      const liveTS = new Date(ts).getTime();
      
      const nextVoltage = {};
      const nextCurrent = {};
      const nextFrequency = {};
      const nextPF = {};
      const nextEnergy = {};
      const nextGHG = {};

      for (const key in params) {
        const match = key.match(/\/(\d+)\/([^/]+)\/EM\/Main$/);
        if (!match) continue;

        const [_, id, param] = match;

        if (["volt1", "volt2", "volt3"].includes(param)) {
          nextVoltage[id] = {
            ...(nextVoltage[id] || {}),
            ts,
            [param]: params[key],
          };
        }

        if (["current1", "current2", "current3"].includes(param)) {
          nextCurrent[id] = {
            ...(nextCurrent[id] || {}),
            ts,
            [param]: params[key],
          };
        }

        if (param === "frequency") {
          nextFrequency[id] = { ts, frequency: params[key] };
        }

        if (param === "powerfactor") {
          nextPF[id] = { ts, powerfactor: params[key] };
        }

        if (param === "energy_consumption") {
          const energy = params[key];
          const ghg = energy * 0.00058;

          nextEnergy[id] = { ts: liveTS, energy_consumption: energy };
          nextGHG[id] = { ts: liveTS, ghg };
        }
      }

      for (const id in nextVoltage) {
        setVoltageData(prev => ({
          ...prev,
          [id]: [...(prev[id] || []), nextVoltage[id]].slice(-100),
        }));
      }

      for (const id in nextCurrent) {
        setCurrentData(prev => ({
          ...prev,
          [id]: [...(prev[id] || []), nextCurrent[id]].slice(-100),
        }));
      }

      for (const id in nextFrequency) {
        setFrequencyData(prev => ({
          ...prev,
          [id]: [...(prev[id] || []), nextFrequency[id]].slice(-100),
        }));
      }

      for (const id in nextPF) {
        setPowerFactorData(prev => ({
          ...prev,
          [id]: [...(prev[id] || []), nextPF[id]].slice(-100),
        }));
      }

      for (const id in nextEnergy) {
        setEnergyData(prev => ({
          ...prev,
          [id]: [...(prev[id] || []), nextEnergy[id]].slice(-100),
        }));
      }

      for (const id in nextGHG) {
        setGhgData(prev => ({
          ...prev,
          [id]: [...(prev[id] || []), nextGHG[id]].slice(-100),
        }));
      }
    };

    return () => ws.current?.close();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/summary/${selectedDevice}`);
        const data = res.data;
        // console.log("Fetched summary data", data);
        setSummary({
          today: {
            energy: data.energyToday || 0,
            cost: data.priceToday || 0,
          },
          month: {
            energy: data.energyThisMonth || 0,
            cost: data.priceThisMonth || 0,
          },
          year: {
            energy: data.energyThisYear || 0,
            cost: data.priceThisYear || 0,
          },
        });
        console.log("Fetched summary data", data);
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    fetchSummary();
    const interval = setInterval(fetchSummary, 10000);

    return () => clearInterval(interval);
  }, [energyData]);

  // useEffect(() => {
  //   const pricePerUnit = 8.25;
  //   const GHG_RATE = 0.00058;

  //   const now = new Date();
  //   const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  //   const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  //   const startOfYear = new Date(now.getFullYear(), 0, 1);

  //   const getSummary = (start) => {
  //     const data = energyData[selectedDevice] || [];

  //     const filtered = data
  //       .filter((d) => new Date(d.ts) >= start)
  //       .sort((a, b) => a.ts - b.ts);

  //     if (filtered.length >= 2) {
  //       const first = filtered[0].energy_consumption;
  //       const last = filtered[filtered.length - 1].energy_consumption;
  //       const units = last - first;
  //       const cost = units * pricePerUnit;
  //       const ghg = units * GHG_RATE;
  //       return { energy: units, cost, ghg };
  //     }

  //     return { energy: 0, cost: 0, ghg: 0 };
  //   };

  //   setSummary({
  //     today: getSummary(startOfToday),
  //     month: getSummary(startOfMonth),
  //     year: getSummary(startOfYear),
  //   });
  // }, [energyData, selectedDevice]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <Header />
        <div style={{ position: "absolute", zIndex: "-1" }}>
          <Sidebar />
        </div>
      </div>

      <Title onDeviceSelect={setSelectedDevice} />
      <ExpenseTracker details={summary} />
      <GraphTitle timeMode={timeMode} setTimeMode={setTimeMode} title={selectedDevice} />

      <div style={{ marginLeft: "3.5vw", paddingLeft: "20px", width: "750px" }}>
        <input
          type="datetime-local"
          step="3600"
          value={selectedDateTime || ""}
          onChange={(e) => setSelectedDateTime(e.target.value)}
        />
      </div>

      {/* Energy & GHG */}
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "20px" }}>
        <div style={{ marginLeft: "3.5vw", paddingLeft: "20px", width: "750px" }}>
          <EnergyGraph data={energyData[selectedDevice] || []} />
        </div>
        <div style={{ marginRight: "20px", width: "480px" }}>
          <GHGGraph data={ghgData[selectedDevice] || []} />
        </div>
      </div>

      {/* Voltage & Frequency */}
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div style={{ marginLeft: "3.5vw", marginTop: "20px", paddingLeft: "20px", width: "750px" }}>
          <VoltageGraph data={voltageData[selectedDevice] || []} />
        </div>
        <div style={{ marginRight: "20px", paddingTop: "0px", marginTop: "20px", width: "480px" }}>
          <FrequencyGraph data={frequencyData[selectedDevice] || []} />
        </div>
      </div>

      {/* Current & PF */}
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div style={{ marginLeft: "3.5vw", marginTop: "20px", paddingLeft: "20px", width: "750px" }}>
          <CurrentGraph data={currentData[selectedDevice] || []} />
        </div>
        <div style={{ marginRight: "20px", width: "480px", paddingTop: '20px' }}>
          <PowerFactorGraph data={powerFactorData[selectedDevice] || []} />
        </div>
      </div>
    </>
  );
}

export default App;
