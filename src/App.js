import React, { useState } from "react";
import FileUpload from "./FileUpload";
import SalesChart from "./SalesChart";
import { buildModel, trainModel, predictSales } from "./modelUtils";
import "./styles.css";

const App = () => {
  const [productAActual, setProductAActual] = useState([]);
  const [productBActual, setProductBActual] = useState([]);
  const [productAPredicted, setProductAPredicted] = useState([]);
  const [productBPredicted, setProductBPredicted] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("A"); // Default is Product A

  const handleDataProcessed = async (data) => {
    // Separate data for Product A and Product B
    const productAData = data.filter((d) => d.product_description === 0); // 0 corresponds to Product A
    const productBData = data.filter((d) => d.product_description === 1); // 1 corresponds to Product B

    // Prepare inputs and outputs for each product
    const inputsA = productAData.map((d) => [d.sales_date, d.product_description]);
    const outputsA = productAData.map((d) => d.quantity_sold);
    const inputsB = productBData.map((d) => [d.sales_date, d.product_description]);
    const outputsB = productBData.map((d) => d.quantity_sold);

    if (!inputsA.length || !inputsB.length || inputsA.length !== outputsA.length || inputsB.length !== outputsB.length) {
      alert("Data is invalid. Ensure inputs and outputs are consistent.");
      return;
    }

    // Build and train the model
    const model = buildModel();
    await trainModel(model, [...inputsA, ...inputsB], [...outputsA, ...outputsB]);

    // Predict sales for future data (for the next 6 months for each product)
    const futureDataA = [
      [13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0],
    ];
    const futureDataB = [
      [13, 1], [14, 1], [15, 1], [16, 1], [17, 1], [18, 1],
    ];

    const predictionsA = predictSales(model, futureDataA);
    const predictionsB = predictSales(model, futureDataB);

    // Update state with actual and predicted sales for both products
    setProductAActual(outputsA);
    setProductBActual(outputsB);
    setProductAPredicted(predictionsA);
    setProductBPredicted(predictionsB);
  };

  const handleProductSelection = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="app">
      <h1>Sales Forecasting</h1>
      <FileUpload onDataProcessed={handleDataProcessed} />
      
      {/* Buttons to toggle between Product A and Product B */}
      <div className="buttons">
        <button onClick={() => handleProductSelection("A")}>Product A</button>
        <button onClick={() => handleProductSelection("B")}>Product B</button>
      </div>

      {/* Conditionally render chart based on selected product */}
      <SalesChart
        actual={selectedProduct === "A" ? productAActual : productBActual}
        predicted={selectedProduct === "A" ? productAPredicted : productBPredicted}
      />
    </div>
  );
};

export default App;
