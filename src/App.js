import React, { useState } from "react";
import FileUpload from "./FileUpload";
import SalesChart from "./SalesChart";
import { buildModel, trainModel, predictSales } from "./modelUtils";
import "./styles.css";

const App = () => {
  const [actualSales, setActualSales] = useState([]);
  const [predictedSales, setPredictedSales] = useState([]);
  const [data, setData] = useState(null);

  // Handle the file upload and process data
  const handleDataProcessed = async (uploadedData) => {
    setData(uploadedData);
  };

  // Handle the "Train and Predict" button click
  const handleTrainAndPredict = async () => {
    if (!data || data.length === 0) {
      alert("Please upload a valid CSV file first.");
      return;
    }

    // Prepare inputs and outputs
    const inputs = data.map((d) => [d.sales_date, d.product_description]);
    const outputs = data.map((d) => d.quantity_sold);

    if (!inputs.length || !outputs.length || inputs.length !== outputs.length) {
      alert("Data is invalid. Ensure inputs and outputs are consistent.");
      return;
    }

    // Build and train the model
    const model = buildModel();
    await trainModel(model, inputs, outputs);

    // Predict sales for the next 6 months
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
      <button onClick={handleTrainAndPredict}>Train and Predict</button>
      <SalesChart actual={actualSales} predicted={predictedSales} />
    </div>
  );
};

export default App;
