import React, { useState } from 'react';
import FileUpload from './FileUpload';
import SalesChart from './SalesChart';
import { buildModel, trainModel, predictSales } from './modelUtils';
import './styles.css';
import './App.css';

const App = () => {
  const [actualSales, setActualSales] = useState([]);
  const [predictedSales, setPredictedSales] = useState([]);
  const [isModelTrained, setIsModelTrained] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle the processing of data
  const handleDataProcessed = async (data) => {
    try {
      setIsLoading(true);

      // Extract inputs (features) and outputs (labels)
      const inputs = data.map((d) => [d.sales_date, d.product_description]);
      const outputs = data.map((d) => d.quantity_sold);

      // Build and train the model
      const model = buildModel();
      await trainModel(model, inputs, outputs);

      // Predict future sales for the next 6 months (example: months 13-18)
      const futureData = [
        [13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0]
      ];
      const predictions = await predictSales(model, futureData);

      // Update state with actual sales and predictions
      setActualSales(outputs);
      setPredictedSales(predictions);

      setIsModelTrained(true);
    } catch (error) {
      console.error("Error processing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Sales Forecasting</h1>

      {/* Upload Component */}
      <FileUpload onDataProcessed={handleDataProcessed} />

      {/* Loading indicator */}
      {isLoading && <p>Loading... Please wait while we process the data.</p>}

      {/* Sales Chart */}
      {isModelTrained ? (
        <SalesChart actual={actualSales} predicted={predictedSales} />
      ) : (
        <p>Please upload your data to see the forecast.</p>
      )}
    </div>
  );
};

export default App;
