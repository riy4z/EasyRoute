import React, { useState, useEffect, useRef } from "react";
import handleFileUpload from "../../components/csv/handleFileUpload";
import Popup from "./Popup";
import AccountDetails from "./AccountDetails";
import getCompanyID from "../../components/fetch/getCompany";
import getUserID from "../../components/fetch/getUser";
import toast, { Toaster } from 'react-hot-toast';
import api from "../../config/api";
import { FaSearch } from 'react-icons/fa';
import { IoMdRefresh } from "react-icons/io";

function Account(props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [savedAddress, setSavedAddress] = useState([]);
  const [companyId, setCompanyId] = useState('');
  const [userId, setUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [refresh, setRefresh] = useState(true);
  const [isAccountDetailsExpanded, setIsAccountDetailsExpanded] = useState(false);



  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCompanyID();
    fetchUserID();
  }, []);

  useEffect(() => {
    console.log('fetching')
    fetchAddressData(props.selectedLocation);
  }, [props.selectedLocation, refresh]);



  const fetchAddressData = (selectedLocation) => {
    api.get(`/get-address-data-locationid/${selectedLocation}`)
      .then((response) => {
        const data = response.data;
        if (typeof data !== 'object') {
          console.error('Client: Error - Response is not an object:', data);
          throw new Error('Response is not a valid JSON object');
        }
        setSavedAddress(data);
      })
      .catch((error) => {
        console.error('Client: Error fetching address data:', error);
        setSavedAddress([])
      });
  };

  const fetchCompanyID = async () => {
    try {
      const companyIDData = await getCompanyID();
      setCompanyId(companyIDData);
    } catch (error) {
      console.error("Error fetching companyID:", error);
    }
  };

  const fetchUserID = async () => {
    try {
      const userIDData = await getUserID();
      setUserId(userIDData);
    } catch (error) {
      console.error("Error fetching userID:", error);
    }
  };

  const handleFileSelect = () => {
    if (props.selectedLocation) {
      fileInputRef.current.click();
    } else {
      alert("Please select a location before importing accounts.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!props.selectedLocation) {
      alert("Please select a location before importing accounts.");
      return;
    }
  
    handleFileUpload(file, (data) => {
      const userID = userId;
      const username = userID;
      const newData = []; // Array to accumulate all data
  
      for (let i = 0; i < data.length; i++) {
        data[i].CompanyID = companyId;
        data[i].LocationID = props.selectedLocation;
        newData.push(data[i]); // Append each data item to newData array
      }
  
      api.post('/processCSV', {
        csvData: newData, // Send the accumulated array
        fileName: file.name,
        userId: username,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.data.success) {
            console.log('CSV file processed successfully');
            toast.success('Accounts imported successfully');
          } else {
            console.error('Error processing CSV file:', response.data.error);
            toast.error('Error processing CSV file');
          }
        })
        .catch((error) => {
          console.error('Error sending CSV data to the server:', error);
          toast.error('Error sending CSV data to the server');
        });
  
      // Update the state with all data
      props.setAddresses(newData);
    });
  };
  


  



  const openPopup = () => {
    if (!props.selectedLocation) {
      alert("Please select a location before adding an account.");
      return;
    }

    setIsPopupOpen(true);
    setIsOverlayVisible(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setIsOverlayVisible(false);
  };

  const handleListItemHover = (index) => {
    const updatedSavedAddresses = [...savedAddress];
    updatedSavedAddresses[index].backgroundColor = '#f0f0f0';
    setSavedAddress(updatedSavedAddresses);
  };

  const handleListItemLeave = (index) => {
    const updatedSavedAddresses = [...savedAddress];
    delete updatedSavedAddresses[index].backgroundColor;
    setSavedAddress(updatedSavedAddresses);
  };



  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
  };
  
  // Rendering the address list based on the filtered addresses
  const filteredAddresses = savedAddress.filter(address => {
    const fullName = `${address['First Name']} ${address['Last Name']}`.toLowerCase();
    const fullAddress = `${address['Street Address']}, ${address['City']}, ${address['State']}, ${address['ZIP Code']}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || fullAddress.includes(searchTerm.toLowerCase());
  });


  const handleListItemClick = (selectedAddress) => {
    setSelectedAddress(selectedAddress);
    setIsAccountDetailsExpanded(true);
    props.navigateToCoordinates(selectedAddress.latitude, selectedAddress.longitude);
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <h1 className="text-5xl font-medium text-customColor1 text-left ">Accounts</h1>
      <div>
        <button className="cursor-pointer mt-4 bg-blue-700 hover:bg-blue-900 rounded-lg px-14 py-1.5 text-white font-medium text-xl" onClick={handleFileSelect}>Import Accounts</button>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
      </div>

      <div className="relative block mt-4 ">
            <div className="flex items-center h-max">
              <input
                type="text"
                id="table-search"
                className="block p-2 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for accounts"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <IoMdRefresh onClick={()=>setRefresh(!refresh)} size={25} className="inline-block cursor-pointer absolute text-gray-400 right-10" />
              <FaSearch className="inline-block absolute text-gray-400 right-4" />
            </div>
          </div>  
      <button className="cursor-pointer bg-blue-700 hover:bg-blue-900 rounded-lg p-2 text-white font-medium absolute bottom-4 left-16 text-xl" onClick={openPopup}>
        <i className="fas fa-plus-circle" style={{ marginRight: 10}}></i>
        Add Account
      </button>
      {filteredAddresses && filteredAddresses.length > 0 && (
      <div className={`absolute ${filteredAddresses && filteredAddresses.length > 0 ? 'overflow-y-scroll h-[65%] mt-8 pl' : 'overflow-hidden'}`}>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {filteredAddresses.map((address, index) => (
            <li 
              key={address._id}
              onClick={() => handleListItemClick(address)}
              onMouseEnter={() => handleListItemHover(index)}
              onMouseLeave={() => handleListItemLeave(index)}
              className="cursor-pointer border-b border-gray-200 hover:bg-gray-100 p-1"
              style={{
                display: address.isHidden ? 'none' : 'block'
              }}
            >
              <p className="text-sm font-bold">
                {address['First Name']} {address['Last Name']}</p>        
              <p className="text-sm font-normal leading-tight text-gray-700 my-1">   {address['Street Address']}, {address['City']}, {address['State']}, {address['ZIP Code']}
              </p> 
            </li>
          ))}
        </ul>
      </div>)}

            {savedAddress.length == 0 && (
              <div className="flex text-gray-400 text-sm p-1 h-full justify-center items-center mx-4 my-6">
              <p>ⓘ No Accounts Found for the selected Location, try importing accounts using the Import Accounts / Add Accounts option</p>
              </div>
            )}
      {isAccountDetailsExpanded && (
        <AccountDetails
          addressData={selectedAddress}
          isExpanded={isAccountDetailsExpanded}
          selectedLocation={props.selectedLocation}
          onToggleExpand={() => setIsAccountDetailsExpanded(!isAccountDetailsExpanded)}
          onUpdateAddress={(updatedAddress) => {
            const updatedAddresses = savedAddress.map(address => 
              address._id === updatedAddress._id ? updatedAddress : address
            );
            setSavedAddress(updatedAddresses);
            setSelectedAddress(updatedAddress);
          }}
        />
      )}
      {isPopupOpen && <Popup onClose={closePopup} selectedLocation={props.selectedLocation} companyId={companyId} />}
    </div>
  );
  

  }


export default Account;