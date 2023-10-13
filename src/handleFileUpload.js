import React, { Component } from "react";

 const handleFileUpload = (e) => {

    const file = e.target.files[0];
    
    
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const csvData = event.target.result;
        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          // Specify the columns for Street Address, City, and Zip Code
          columns: ["Street Address", "City", "Zip Code"],
          complete: (result) => {
            if (result && result.data) {
              const addresses = result.data.map((row) => ({
                streetAddress: row["Street Address"],
                city: row["City"],
                zipCode: row["Zip Code"],
              }));
              this.createPinsFromAddresses(addresses);
            }
          },
        });
      };

      reader.readAsText(file);
    }
  };

  export default handleFileUpload;