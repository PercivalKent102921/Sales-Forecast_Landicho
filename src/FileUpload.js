import React, { useState } from "react";
import Papa from "papaparse";

const FileUpload = ({ onDataProcessed }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const processFile = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const processedData = results.data
            .filter((row) => row.sales_date && row.product_description && row.quantity_sold) // Filter out invalid rows
            .map((row) => ({
              sales_date: new Date(row.sales_date).getMonth() + 1, // Convert date to numeric month
              product_description: row.product_description === "Product A" ? 0 : 1, // Encode products
              quantity_sold: parseFloat(row.quantity_sold), // Convert to number
            }));
          onDataProcessed(processedData);
        },
      });
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <div className="file-upload">
      <input type="file" onChange={handleFileChange} />
      <button onClick={processFile}>Upload and Process</button>
    </div>
  );
};

export default FileUpload;
