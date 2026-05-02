import React, { useState } from "react";
import "./App.css";
import customerObj from "./data/customers.json"; //import json file as object

//global Objects
import customerData from "./data/customers.json";
import equipmentData from "./data/equipment.json";
import laborRatesData from "./data/labor_rates.json";

function CustomerList() {
    return (
        <div className="InfoTable">
            <h2>Customer Data List</h2>
            <table className="CustomerTable InfoTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Property Type</th>
                        <th>Square Footage</th>
                        <th>System Type</th>
                        <th>System Age</th>
                        <th>Last Service date</th>
                    </tr>
                </thead>
                <tbody>
                    {customerData.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.id || "Unknown"}</td>
                            <td>{customer.name || "Unknown"}</td>
                            <td>
                                {(customer.propertyType ||
                                    customer.property_type) ??
                                    "n/a"}
                            </td>
                            <td>{customer.squareFootage ?? "n/a"}</td>
                            <td>{customer.systemType ?? "n/a"}</td>
                            <td>{customer.systemAge ?? "n/a"}</td>
                            <td>{customer.lastServiceDate ?? "n/a"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function EquipmentList() {
    return (
        <div className="InfoTable">
            <h2>Equipment Inventory</h2>
            <table className="EquipmentTable InfoTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Model #</th>
                        <th>Base Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {equipmentData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name || "Unknown Item"}</td>
                            <td>{item.category ?? "n/a"}</td>
                            <td>{item.brand ?? "n/a"}</td>
                            <td>{item.modelNumber ?? "n/a"}</td>
                            <td>
                                {item.baseCost
                                    ? `$${item.baseCost.toLocaleString()}`
                                    : "n/a"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function LaborRatesList() {
    return (
        <div className="InfoTable">
            <h2>Labor & Service Rates</h2>
            <table className="LaborTable">
                <thead>
                    <tr>
                        <th>Job Type</th>
                        <th>Level</th>
                        <th>Hourly Rate</th>
                        <th>Est. Time (Hours)</th>
                    </tr>
                </thead>
                <tbody>
                    {laborRatesData.map((labor, index) => (
                        <tr key={labor.id || index}>
                            <td style={{ textTransform: "capitalize" }}>
                                {labor.jobType ?? "n/a"}
                            </td>
                            <td style={{ textTransform: "capitalize" }}>
                                {labor.level ?? "standard"}
                            </td>
                            <td>${labor.hourlyRate ?? 0}/hr</td>
                            <td>
                                {labor.estimatedHours
                                    ? `${labor.estimatedHours.min} - ${labor.estimatedHours.max} hrs`
                                    : "n/a"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function CalculateCostHours() {
    const [inputId, setInputId] = useState("");                     //for input
    const [selectedCustomer, setSelectedCustomer] = useState(null); //for customer object

    const handleCalculate = () => {
        const found = customerData.find((c) => c.id === inputId.trim());

        if (found) {
            setSelectedCustomer(found);
        } else {
            alert("Customer ID not found!");
            setSelectedCustomer(null);
        }
    };

    return (
        <div className="PriceCalculator">
            <h2>Enter Customer ID:</h2>
            <p>
                <i>Including the "ID" prefix, eg: CUST001</i>
            </p>

            <input
                type="text"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="Enter ID..."
            />

            <button onClick={handleCalculate}>Calculate</button>
            {selectedCustomer && (
                <div className="ResultArea">
                    <h3>Quote for: {selectedCustomer.name}</h3>
                    <p>System Age: {selectedCustomer.systemAge} years</p>
                    <p>Property Size: {selectedCustomer.squareFootage} sqft</p>
                    {/*logic */}
                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <>
            <h1>Price Calculation Tool</h1>
            <p>
                This web-hosted tool should help speed up the quote process for
                HVAC technicians
            </p>

            <CalculateCostHours/>

            <h2>Database Reference Tables:</h2>
            <CustomerList />
            <EquipmentList />
            <LaborRatesList />
        </>
    );
}

export default App;
