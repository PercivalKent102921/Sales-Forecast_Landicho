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
  const data = {
    labels: Array.from({ length: actual.length + predicted.length }, (_, i) => `Month ${i + 1}`),
    datasets: [
      {
        label: "Actual Sales",
        data: [...actual, ...Array(predicted.length).fill(null)],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderWidth: 2,
        pointStyle: "circle",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: "Predicted Sales",
        data: [...Array(actual.length).fill(null), ...predicted],
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderWidth: 2,
        pointStyle: "rectRot",
        pointRadius: 5,
        pointHoverRadius: 7,
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
      },
      y: {
        title: { display: true, text: "Sales Quantity" },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default SalesChart;
