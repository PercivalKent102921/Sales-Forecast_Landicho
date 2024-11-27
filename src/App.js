import React, { useState } from "react";
import FileUpload from "./FileUpload";
import SalesChart from "./SalesChart";
import { buildModel, trainModel, predictSales } from "./modelUtils";
import "./styles.css";

const App = () => {
  const [actualSales, setActualSales] = useState([]);
  const [predictedSales, setPredictedSales] = useState([]);

  const handleDataProcessed = async (data) => {
    // Prepare inputs and outputs
    const inputs = data.map((d) => [d.sales_date, d.product_description]); // 2D array
    const outputs = data.map((d) => d.quantity_sold); // 1D array

    if (!inputs.length || !outputs.length || inputs.length !== outputs.length) {
      alert("Data is invalid. Ensure inputs and outputs are consistent.");
      return;
    }

    // Build and train the model
    const model = buildModel();
    await trainModel(model, inputs, outputs);

    // Predict sales for future data
    const futureData = [
      [13, 0],
      [14, 0],
      [15, 0],
      [16, 0],
      [17, 0],
      [18, 0],
    ];
    const predictions = predictSales(model, futureData);

    // Update state with actual and predicted sales
    setActualSales(outputs);
    setPredictedSales(predictions);
  };

  return (
    <div className="app">
      <h1>Sales Forecasting</h1>
      <FileUpload onDataProcessed={handleDataProcessed} />
      <SalesChart actual={actualSales} predicted={predictedSales} />
    </div>
  );
};

export default App;
