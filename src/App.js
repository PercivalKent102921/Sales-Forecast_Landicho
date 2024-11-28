import React, { useState } from "react";
import FileUpload from "./FileUpload";
import SalesChart from "./SalesChart";
import { buildModel, trainModel, predictSales, normalizeData, denormalizeData } from "./modelUtils";
import "./styles.css";

const App = () => {
  const [actualSales, setActualSales] = useState([]);
  const [predictedSales, setPredictedSales] = useState([]);

  const handleDataProcessed = async (data) => {
    // Normalize the data
    const quantityValues = data.map((d) => d.quantity_sold);
    const minQuantity = Math.min(...quantityValues);
    const maxQuantity = Math.max(...quantityValues);

    // Prepare input and output tensors
    const inputs = data.map((d) => [d.sales_date, d.product_description]); // Features: sales_date and product_description
    const outputs = data.map((d) => normalizeData(d.quantity_sold, minQuantity, maxQuantity)); // Normalize quantity_sold

    // Train the model
    const model = buildModel();
    await trainModel(model, inputs, outputs);

    // Generate predictions for the next 6 months
    const lastSalesDate = Math.max(...data.map((d) => d.sales_date));
    const futureData = Array.from({ length: 6 }, (_, i) => [
      lastSalesDate + i + 1, // Increment months
      0, // Predict for Product A by default
    ]);
    const predictions = predictSales(model, futureData).map((pred) =>
      denormalizeData(pred, minQuantity, maxQuantity)
    );

    // Format predictions for visualization
    const predictedData = futureData.map((fd, idx) => ({
      sales_date: `${Math.floor(fd[0] / 12)}-${String(fd[0] % 12 || 12).padStart(2, "0")}`, // Convert back to YYYY-MM
      product_description: "Product A",
      quantity_sold: predictions[idx],
    }));

    // Update state for chart display
    setActualSales(data.map((d) => d.quantity_sold));
    setPredictedSales(predictedData.map((d) => d.quantity_sold));
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
