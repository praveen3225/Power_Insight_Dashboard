import React from "react";
import { CurrencyRupee, Lightning } from "react-bootstrap-icons";
import "./Card.css";

// Utility to format kWh with 2 decimal places
const formatKWh = (value) => {
  if (typeof value !== "number") return value;
  return `${value.toFixed(2)} kWh`;
};

// Utility to format currency into K (thousands)
const formatCurrency = (value) => {
  if (typeof value !== "number") return value;
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(2)} K`;
  return `₹${value.toFixed(2)}`;
};

function Card(props) {
  const iconStyle = {
    backgroundColor: props.cardColor,
    borderRadius: "100%",
    padding: "10px",
    display: "inline-block",
  };

  return (
    <>
      <div className="card-body" style={{ backgroundColor: props.cardColor }}>
        <div className="card-body-upper" style={{ backgroundColor: props.upperColor }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              color: "gray",
              alignItems: "baseline",
            }}
          >
            <div style={iconStyle}>
              <Lightning fill="white" size={20} />
            </div>
            <p style={{ paddingLeft: "10px" }}>{props.upperText}</p>
          </div>
          <div className="values" color="white">
            <h3 className="values-h3">{formatKWh(props.detailsup)}</h3>
          </div>
        </div>
        <div className="card-body-lower">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              color: "gray",
              alignItems: "baseline",
            }}
          >
            <div
              style={{
                backgroundColor: props.upperColor,
                borderRadius: "100%",
                padding: "10px",
                display: "inline-block",
              }}
            >
              <CurrencyRupee size={20} fill="white" />
            </div>
            <p style={{ paddingLeft: "10px" }}>{props.lowerText}</p>
          </div>
          <div className="values" color="white">
            <h3 className="values-h3">{formatCurrency(props.detailsdown)}</h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
