import Papa from "papaparse";

const handleFileUpload = (file, callback) => {
  if (file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const csvData = event.target.result;
      Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          if (result && result.data) {
            callback(result.data);
          }
        },
      });
    };
    console.log(reader);
    reader.readAsText(file);
  }
};

export default handleFileUpload;
