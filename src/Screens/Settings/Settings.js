import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerStyles.css'; // Import custom CSS for date picker styling
import api from '../../config/api';

function Settings(props) {
  // Calculate default start date and end date
  const currentDate = new Date();
  const defaultStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const defaultEndDate = new Date();

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const handleStartDateChange = date => {
    setStartDate(date);
  };

  const handleEndDateChange = date => {
    setEndDate(date);
  };

  const exportCheckin = async () => {
    try {
      // Make a request to your server to fetch check-in data between the selected dates
      const response = await api.post('/exportCheckin', {
        startDate,
        endDate,
        locationId: props.selectedLocation 
      });

      // Create a Blob object containing the CSV data
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      // Create a link element and click it to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `checkin_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting check-in data:', error);
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      <div className="settings-options">
        <span>Forgot User Name & Password?</span><br />
        <span>Manage Payment & Subscription</span>
      </div>

      <strong>Check In Report</strong>
      <div className="date-picker">
        <label htmlFor="startDate">Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd MMMM yyyy"
          className="date-picker-input"
        />
      </div>
      <div className="date-picker">
        <label htmlFor="endDate">End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          maxDate={new Date()}
          dateFormat="dd MMMM yyyy" 
          className="date-picker-input"
        />
      </div>
      <button
      onClick={exportCheckin} 
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Export Checkin
        </button>
    </div>
  );
}

export default Settings;
