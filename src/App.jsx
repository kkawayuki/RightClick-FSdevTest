import React, { useState } from "react";
import "./App.css";
import customerObj from "./data/customers.json"; //import json file as object

//global Objects from which to gather data
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
                        <th>Id</th>
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
                            <td>
                                {customer.squareFootage ??
                                    customer.sqft ??
                                    "n/a"}
                            </td>
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
                        <th>Id</th>
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

function TotalCostCalculator() {
    const [inputId, setInputId] = useState(""); //for customer input
    const [equipmentId, setEquipmentId] = useState(""); //for equipment input
    const [selectedCustomer, setSelectedCustomer] = useState(null); //for customer object
    const [selectedServices, setSelectedServices] = useState([]); //for selection service(s)
    const [selectedEquipment, setSelectedEquipment] = useState([]); //for equipment object

    //2d arr to determine divisor of SQFT
    const timeConstants = {
        diagnostic: { standard: 2000, complex: 1500 },
        repair: { standard: 2000, complex: 1500 },
        install: { standard: 500, complex: 400 },
        maintenance: { standard: 2000, complex: 1800 },
        ductwork: { standard: 2000, complex: 600 },
    };

    const handleCustomerLookup = () => {
        const found = customerData.find((c) => c.id === inputId.trim());

        if (found) {
            setSelectedCustomer(found);
        } else {
            alert("Customer Id not found!");
            setSelectedCustomer(null);
        }
    };

    //for (jobtype, level) tuple additions
    const handleServiceChange = (jobType, level) => {
        setSelectedServices((prev) => {
            const exists = prev.find(
                (s) => s.jobType === jobType && s.level === level,
            );
            if (exists) {
                return prev.filter(
                    (s) => !(s.jobType === jobType && s.level === level),
                );
            } else {
                return [...prev, { jobType, level }];
            }
        });
    };

    //for equipment lookups+additions
    const handleEquipmentLookup = () => {
        const found = equipmentData.find((e) => e.id === equipmentId.trim());

        if (found) {
            // Correct way to update an array state:
            setSelectedEquipment((prev) => [...prev, found]);
            setEquipmentId("");
        } else {
            alert("Equipment Id not found!");
        }
    };

    // This runs on every re-render
    let runningTotal = 0;
    let totalEstimatedHours = 0;
    let equipmentSubtotal = 0;
    let laborSubtotal = 0;

    if (selectedCustomer) {
        const sqft =
            selectedCustomer.squareFootage ?? selectedCustomer.sqft ?? 0;

        //labor prices
        laborSubtotal = selectedServices.reduce((acc, selection) => {
            const rateData = laborRatesData.find(
                (r) =>
                    r.jobType === selection.jobType &&
                    r.level === selection.level,
            );
            const divisor =
                timeConstants[selection.jobType]?.[selection.level] ?? 2000;
            const hoursForThisJob = sqft / divisor;

            totalEstimatedHours += hoursForThisJob;
            return acc + hoursForThisJob * (rateData?.hourlyRate || 0);
        }, 0);

        //equipment prices
        equipmentSubtotal = selectedEquipment.reduce((acc, item) => {
            const cost = item.baseCost ?? item.base_cost ?? 0;
            return acc + cost;
        }, 0);

        //grand total
        runningTotal = laborSubtotal + equipmentSubtotal;
    }

    return (
        <div className="PriceCalculator">
            <div className="CustomerArea FieldArea">
                <h2>Enter Customer Id:</h2>
                <p>
                    <i>Including the "Id" prefix, eg: CUST001</i>
                </p>

                <input
                    className="inputBox"
                    type="text"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                    placeholder="Enter Customer Id..."
                />
                <button onClick={handleCustomerLookup}>Find</button>
            </div>

            {selectedCustomer && (
                <div className="ResultArea">
                    <div className="CustomerInfo FieldArea">
                        <h3>Quote for: {selectedCustomer.name}</h3>
                        <p>
                            Property Type:{" "}
                            {selectedCustomer.propertyType ??
                                selectedCustomer.property_type ??
                                "n/a"}
                        </p>
                    </div>

                    <div className="ServiceOptions FieldArea">
                        <h3>Select Services:</h3>
                        {laborRatesData.map((service) => {
                            // Unique Id for each combination
                            const isChecked = selectedServices.some(
                                (s) =>
                                    s.jobType === service.jobType &&
                                    s.level === service.level,
                            );

                            return (
                                <div
                                    key={`${service.jobType}-${service.level}`}
                                    className="checkbox-row"
                                >
                                    <input
                                        type="checkbox"
                                        id={`service-${service.jobType}-${service.level}`}
                                        checked={isChecked}
                                        onChange={() =>
                                            handleServiceChange(
                                                service.jobType,
                                                service.level,
                                            )
                                        }
                                    />
                                    <label
                                        htmlFor={`service-${service.jobType}-${service.level}`}
                                    >
                                        <strong
                                            style={{
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            {service.jobType}
                                        </strong>
                                        {` (${service.level}) — $${service.hourlyRate}/hr`}
                                    </label>
                                </div>
                            );
                        })}
                    </div>

                    {selectedServices.some(
                        (service) => service.jobType === "install",
                    ) && (
                        <div className="EquipmentOptions FieldArea">
                            <h3>Add Installed Equipment</h3>
                            <p>
                                <i>
                                    Using the equipment's "Id" prefix, eg: EQ001
                                </i>
                            </p>
                            <input
                                type="text"
                                value={equipmentId}
                                onChange={(e) => setEquipmentId(e.target.value)}
                                placeholder="Enter Equipment Id..."
                            />
                            <button onClick={handleEquipmentLookup}>
                                Find
                            </button>
                        </div>
                    )}

                    <div className="QuoteSummary FieldArea">
                        <h3>Quote Summary</h3>

                        {/* Added Equipment */}
                        {selectedEquipment.length > 0 && (
                            <div className="EquipmentList">
                                <h4>Equipment:</h4>
                                <ul>
                                    {selectedEquipment.map((item, index) => (
                                        <li key={index}>
                                            {item.name}: $
                                            {item.baseCost ?? item.base_cost}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Labor Totals */}
                        <p>
                            <strong>Labor Total:</strong> $
                            {laborSubtotal.toFixed(2)} (
                            {totalEstimatedHours.toFixed(1)} hrs)
                        </p>
                        <p>
                            <strong>Equipment Total:</strong> $
                            {equipmentSubtotal.toFixed(2)}
                        </p>
                        <h2 className="GrandTotal">
                            Grand Total: ${runningTotal.toLocaleString()}
                        </h2>
                    </div>
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

            <TotalCostCalculator />

            <h2>Database Reference Tables:</h2>
            <CustomerList />
            <EquipmentList />
            <LaborRatesList />
        </>
    );
}

export default App;
