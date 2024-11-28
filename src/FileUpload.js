import React, { useState } from "react";
import Papa from "papaparse";

const FileUpload = ({ onDataProcessed }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const processFile = () => {
    if (file) {
      Papa.parse(file, {
        header: true, // Parse the header row
        skipEmptyLines: true, // Skip empty lines in the CSV
        complete: (results) => {
          const data = results.data;

          // Validate required headers
          const headers = results.meta.fields;
          const requiredHeaders = ["sales_date", "product_description", "quantity_sold"];
          const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

          if (missingHeaders.length > 0) {
            alert(`Invalid file format. Missing headers: ${missingHeaders.join(", ")}`);
            return;
          }

          // Process data into the required format
          const processedData = data
            .filter(
              (row) =>
                row.sales_date &&
                row.product_description &&
                !isNaN(parseFloat(row.quantity_sold)) // Ensure `quantity_sold` is numeric
            )
            .map((row) => ({
              sales_date: new Date(row.sales_date).getFullYear() * 12 + new Date(row.sales_date).getMonth() + 1, // Convert to numeric month
              product_description: row.product_description === "Product A" ? 0 : 1, // Encode product descriptions
              quantity_sold: parseFloat(row.quantity_sold), // Convert `quantity_sold` to float
            }));

          if (processedData.length === 0) {
            alert("No valid data found in the file.");
            return;
          }

          onDataProcessed(processedData);
        },
        error: (error) => {
          alert(`Error processing file: ${error.message}`);
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
