import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = ({ actual, predicted }) => {
  // Extend the predicted data to match the same length as the actual data or beyond
  const extendedPredictedData = [...Array(actual.length).fill(null), ...predicted]; // Set null for the actual months, then add predicted months

  const data = {
    labels: Array.from({ length: actual.length + predicted.length }, (_, i) => `Month ${i + 1}`), // Adjusting to include both actual and predicted months
    datasets: [
      {
        label: "Actual Sales",
        data: actual,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderWidth: 2,
        pointStyle: "circle",
        pointRadius: 1,
        pointHoverRadius: 7,
        fill: false, // No filling under the line
      },
      {
        label: "Predicted Sales",
        data: extendedPredictedData,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderWidth: 2,
        pointStyle: "rectRot",
        pointRadius: 1,
        pointHoverRadius: 7,
        fill: false, // No filling under the line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Actual vs Predicted Sales",
        font: { size: 20 },
      },
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Months" },
        ticks: {
          autoSkip: false,
          maxRotation: 45, // Rotate x-axis labels for better readability
        },
        min: 0,
        max: actual.length + predicted.length - 1, // Ensure the x-axis includes all months
      },
      y: {
        title: { display: true, text: "Sales Quantity" },
      },
    },
  };

  return (
    <div style={{ width: "80%", height: "600px", margin: "0 auto" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default SalesChart;
