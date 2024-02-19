import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerStyles.css'; // Import custom CSS for date picker styling
import api from '../../config/api';
import toast, { Toaster } from 'react-hot-toast';
import fetchUserLocations from '../../components/fetch/fetchUserLocations';

function Reports(props) {
  // Calculate default start date and end date
  const currentDate = new Date();
  const defaultStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const defaultEndDate = new Date();
  const [activeTab, setActiveTab] = useState('Checkin');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const handleStartDateChange = date => {
    setStartDate(date);
  };

  const handleEndDateChange = date => {
    setEndDate(date);
  };

  const AllLocation = async() =>{
    const selectedLocation = await fetchUserLocations()
    console.log(selectedLocation)
  }

  const exportCheckin = async () => {
    try {
      let locationIds = [props.selectedLocation]; // Initialize with the selected location ID
  
      // If the checkbox is clicked, fetch all user locations and get their IDs
      if (document.getElementById('showAllCheckbox').checked) {
        const userLocations = await fetchUserLocations();
        locationIds = userLocations.map(location => location.LocationID);
      }
  
      // Make requests for each location ID
      const requests = locationIds.map(async locationId => {
        const response = await api.post('/exportCheckin', {
          startDate,
          endDate,
          locationId
        });
        return response.data;
      });
  
      // Wait for all requests to resolve
      const responses = await Promise.all(requests);
  
      // Combine all CSV data into one
      let combinedCSVData = 'Account,User,Street Address, City, State, ZIP Code, Company,Location,Meeting Notes,Checked in\n'; // Add titles
  
      responses.forEach(csvData => {
        combinedCSVData += csvData; // Add CSV data for each location
      });
  
      // Create a Blob object containing the CSV data
      const blob = new Blob([combinedCSVData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
  
      // Create a link element and click it to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `checkin_report.csv`);
      document.body.appendChild(link);
      link.click();
      toast.success("Export Successful");
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Error exporting check-in data');
    }
  };


//!-- export All accounts
  const exportAccounts = async () => {
    const locationId = props.selectedLocation;

    if(!locationId){
      toast.error("Select a location!")
    }
    else{
    try {
        const response = await api.post('/exportAccounts', { locationId }, {
            responseType: 'blob', // Ensure response type is blob
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response.status)
        if (response.status === 201){
          toast.error("No accounts found for the selected location");
        }
        else{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'address_data.csv');
        document.body.appendChild(link);
        toast.success("Export Successful")
        link.click();}
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log('Toast message:', error.response.data.message);
            // Here you can display the toast message using your preferred toast library or method
            // For example, if you're using a library like react-toastify:
            toast.error(error.response.data.message);
        } else {
            toast.error('Error exporting address data');
        }
    }
}}

//-----!


  return (
  <div>
      <h1 className="text-5xl font-medium text-customColor1  text-left">Reports</h1>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div>
      <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400 mt-4">
        <li className={`w-full ${activeTab === 'Checkin' ? 'bg-customColor rounded-s-lg text-white' : 'hover:text-gray-700 hover:bg-gray-50 text-customColor'}`}>
          <span onClick={() => setActiveTab('Checkin')} className="inline-block w-full p-4 border-r border-gray-200 dark:border-gray-700 rounded-s-lg focus:outline-none cursor-pointer " >Check-in</span>
        </li>
        <li className={`w-full ${activeTab === 'Accounts' ? 'bg-customColor rounded-e-lg text-white' : 'hover:text-gray-700 hover:bg-gray-50 text-customColor'}`}>
          <span onClick={() => setActiveTab('Accounts')} className="inline-block w-full p-4 border-r border-gray-200  rounded-e-lg   focus:outline-none cursor-pointer ">Accounts</span>
        </li>
      </ul>
      </div>

      {activeTab=="Checkin" &&(
        <div>
        <div className="mt-6 bg-[#f9f9f9] p-3 w-full rounded border-solid border border-[#ccc]">

  
        <p className='text-gray-400 font-medium'>Check In Report</p>

        <div className="mt-2 flex bg-[#fff] w-full cursor-pointer text-gray-700   py-1 px-2  rounded border-solid border-2 border-gray-100">

          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="MMM dd, yyyy"
            className=" whitespace-nowrap w-full p-1 cursor-pointer hover:text-blue-600  "
          />
          <span className='text-center mt-1 mx-1 bg-[#fff] text-lg relative'>-</span>

          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            maxDate={new Date()}
            dateFormat="MMM dd, yyyy" 
            className="ml-1 whitespace-nowrap w-full p-1 cursor-pointer text-gray-700 hover:text-blue-600 hover:ring-none"
          />
        </div>
        <div className='block m-1'>
        <input id="showAllCheckbox" type="checkbox" onChange={() => {AllLocation();}} />
  <span htmlFor="showAllCheckbox" className="ml-1 text-sm font-medium">All Locations</span>
        <button
        onClick={exportCheckin} 
        className="mt-1 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          Export Checkin
          </button>
  </div>
      </div>
  <p className='text-sm text-gray-400 p-1 mt-3'>ⓘ 
The Check-in Reports enables users to export comprehensive check-in reports for further streamlining data analysis and user activity tracking.</p>
      </div>
      )}

      {activeTab=="Accounts" &&(
                <div className="mt-6">
  <p onClick={exportAccounts} className='cursor-pointer bg-blue-700 hover:bg-blue-900 rounded-lg w-full text-center py-1.5 text-white font-normal  text-xl '>Export Accounts</p>
  <div>
  <p className='text-sm text-gray-400 p-1 mt-3'>ⓘ You can export account data for the selected location for backup and sharing purposes.</p>
  </div>
              </div>  
      )}
    
    </div>
  );
}

export default Reports;
