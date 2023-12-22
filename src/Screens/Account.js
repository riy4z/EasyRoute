import React from "react";
import handleFileUpload from "../components/handleFileUpload";
import Popup from "./Popup";
import AccountDetails from "./AccountDetails";
import fetchLocations from '../components/fetchLocations';
import fetchUserLocations from '../components/fetchUserLocations';
import getCompanyID from "../components/getCompany";
import getUserID from "../components/getUser";
import toast, { Toaster } from 'react-hot-toast';

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopupOpen: false,
      isOverlayVisible: false,
      selectedAddress: null, 
      locations: [],
      userLocations: [],
      savedaddress: [],
      companyId:'',
      userId:'',
      searchInput: "", // State variable to store the search input
      isAccountDetailsExpanded: false,
      selectedLocation: '',
    };
  }

  fetchAddressData = () => {
    // Fetch address data and update state every 1 second
    this.fetchAndUpdateAddressData(); // Fetch immediately when the component mounts
    this.fetchInterval = setInterval(() => {
      if (!this.state.searchInput) { // Only fetch if search input is empty
        this.fetchAndUpdateAddressData(); 
      }
    }, 20000); // Fetch every 10 seconds
  };

  
  fetchAndUpdateAddressData = () => {
    fetch('http://localhost:4000/api/get-address-data')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        if (typeof data !== 'object') {
          console.error('Client: Error - Response is not an object:', data);
          throw new Error('Response is not a valid JSON object');
        }
        this.setSavedAddresses(data); // Update the address data in the component state
      })
      .catch((error) => {
        console.error('Client: Error fetching address data:', error);
        // Handle errors if needed
      });
  };

  
  
  componentWillUnmount() {
    clearInterval(this.fetchInterval); // Clear the interval when the component unmounts
  }
  
  setSavedAddresses = (savedaddress) => {
    this.setState({ savedaddress });
  };

  // Automatically fetch address data when the component mounts
  componentDidMount() {
    this.fetchLocationData();
    this.fetchCompanyID();
    this.fetchAddressData();
    this.fetchUserID();
  }

  fetchCompanyID = async () => {
    try {
      const companyIDData = await getCompanyID();
      this.setState({
        companyId : companyIDData
      })
    } catch (error) {
      console.error("Error fetching companyID:", error)
      
    }
  };

  fetchUserID = async () => {
    try {
      const userIDData = await getUserID();
      this.setState({
        userId : userIDData
      })
    } catch (error) {
      console.error("Error fetching userID:", error)
    }
  }

  fetchLocationData = async () => {
    try {
      const locationsData = await fetchLocations();
      const userLocationsData = await fetchUserLocations();
      this.setState({
        locations: locationsData,
        userLocations: userLocationsData,

      });
    } catch (error) {
      console.error('Error fetching location data:', error);
      // Handle error as needed
    }
  };

  handleFileSelect = () => {
    if (this.state.selectedLocation) {
      this.fileInput.click();
    } else {
      // Show a message or take any action to prompt the user to select a location
      alert("Please select a location before importing accounts.");
    }
  };

  handleFileChange = (e) => {
    const file = e.target.files[0];
  // Check if a location is selected before processing the file
  if (!this.state.selectedLocation) {
    alert("Please select a location before importing accounts.");
    return;
  }
  
    handleFileUpload(file, (data) => {
      // Get the userId from session storage
      const userID = this.state.userId;
      const username = userID;
      for (let i = 0; i < data.length; i++) {
        data[i].CompanyID = this.state.companyId;
        data[i].LocationID = this.state.selectedLocation;
      }
      this.props.setAddresses(data); // Pass the parsed data to the parent component
  
      fetch('http://localhost:4000/api/processCSV', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csvData: data, fileName: file.name, userId: username }), // Include the username in the request
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.success) {
            console.log('CSV file processed successfully');
            toast.success('Accounts imported successfully');
          } else {
            console.error('Error processing CSV file:', response.error);
            toast.error('Error processing CSV file');
          }
        })
        .catch((error) => {
          console.error('Error sending CSV data to the server:', error);
          toast.error('Error sending CSV data to the server');
        });
    });
  };


  openPopup = () => {
    const { selectedLocation } = this.state;

    if (!selectedLocation) {
      // Show a message or take any action to prompt the user to select a location
      alert("Please select a location before adding an account.");
      return;
    }

    this.setState({ isPopupOpen: true, isOverlayVisible: true });
  };

  closePopup = () => {
    this.setState({ isPopupOpen: false, isOverlayVisible: false });
  };

handleListItemHover = (index) => {
  const updatedSavedAddresses = [...this.state.savedaddress];
  updatedSavedAddresses[index].backgroundColor = '#f0f0f0'; // Change the background color on hover
  this.setState({ savedaddress: updatedSavedAddresses });
};

handleListItemLeave = (index) => {
  const updatedSavedAddresses = [...this.state.savedaddress];
  delete updatedSavedAddresses[index].backgroundColor; // Remove the background color on hover leave
  this.setState({ savedaddress: updatedSavedAddresses });
};

searchTimeout;


handleSearchInputChange = (e) => {
  const value = e.target.value;

  this.setState({ searchInput: value }, () => {
    clearTimeout(this.searchTimeout);

    if (value === '') {
      // If search is cleared, resume fetching data
      this.fetchAddressData();
    } else {
      // If search is active, stop the interval
      clearInterval(this.fetchInterval);
    }

    this.searchTimeout = setTimeout(this.searchAddresses, 300);
  });
};

searchAddresses = () => {
  const { savedaddress, searchInput } = this.state;
  const filteredAddresses = savedaddress.filter((address) => {
    const fullName = `${address['First Name']} ${address['Last Name']}`;
    const addressFields = [
      address['Street Address'],
      address['City'],
      address['State'],
      address['ZIP Code']
    ];

    const isValidAddress =
    address &&
    Object.keys(address).every((key) => address[key] !== undefined && address[key] !== null);

  if (!isValidAddress) {
    return false;
  }
    // Check if any field contains the search input
    const matchesSearch = addressFields.some(
      (field) => field && field.toLowerCase().includes(searchInput.toLowerCase())
    );

    // Check if the full name contains the search input
    const fullNameMatches = fullName.toLowerCase().includes(searchInput.toLowerCase());

    return matchesSearch || fullNameMatches;
  });
  this.setSavedAddresses(filteredAddresses);
};


handleListItemClick = (selectedAddress) => {
  this.setState({
    selectedAddress,
    isAccountDetailsExpanded: true,
  });
};


renderLocationDropdown() {
  const { locations, userLocations, selectedLocation } = this.state;
  const locationdropdownstyle = "mt-20"
  return (
    <select
      id="locationDropdown"
      value={selectedLocation}
      onChange={(e) => this.setState({ selectedLocation: e.target.value })}
      className = {locationdropdownstyle}
    >
      <option value="">Select a location</option>
      {Array.isArray(userLocations) && userLocations.length > 0 ? (
        userLocations.map((userLocation) => {
          const location = locations.find(loc => loc._id === userLocation.LocationID);
          return (
            <option key={userLocation._id} value={userLocation.LocationID}>
              {location ? location.Location : 'Unknown Location'}
            </option>
          );
        })
      ) : (
        <option value="" disabled>
          No locations available
        </option>
      )}
    </select>
  );
}


  render() {
    const { savedaddress, searchInput, selectedAddress, isAccountDetailsExpanded, selectedLocation } = this.state;
   
      // Sort the addresses based on the 'First Name' in ascending order
      const filteredAddresses = savedaddress.filter(
        (address) => address.LocationID === selectedLocation
      );
    
      // Sort the filtered addresses based on the 'First Name' in ascending order
      const sortedAddresses = filteredAddresses.sort((a, b) => {
        const nameA = a['First Name'] ? a['First Name'].toLowerCase() : '';
        const nameB = b['First Name'] ? b['First Name'].toLowerCase() : '';
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

   

    // console.log(savedaddress)
    const buttonStyle = "cursor-pointer bg-blue-600 rounded-lg px-14 py-1.5 text-white font-medium absolute text-xl top-32"


    const buttonStyle1 = "cursor-pointer bg-customColor1 rounded-lg p-2 text-white font-medium absolute bottom-4 left-16 text-xl"

    
    const listContainerStyle =  `absolute ${
      savedaddress && savedaddress.length > 0 ? 'overflow-y-scroll h-3/5 mt-20' : 'overflow-hidden'
    }`;

    let listContent;
    if (sortedAddresses && sortedAddresses.length > 0) {
      // const visibleAddresses = sortedAddresses.filter(address => !address.isHidden);
    
      listContent = sortedAddresses.map((address, index) => (
        <li 
          key={address._id}
          onClick={() => this.handleListItemClick(address)}
          onMouseEnter={() => this.handleListItemHover(index)}
          onMouseLeave={() => this.handleListItemLeave(index)}
          style={{
            backgroundColor: address.backgroundColor,
            cursor: 'pointer',
            borderBottom: '1px solid #ccc',
            display: address.isHidden ? 'none' : 'block' // Hiding elements with isHidden set to true
          }}
        >
          <p style={{ fontSize: "14px" }}>
            <strong>{address['First Name']} {address['Last Name']}</strong><br></br>         
            {address['Street Address']}, {address['City']}, {address['State']}, {address['ZIP Code']}
          </p> 
        </li>
      ));
    } else {
      listContent = <h5 className='mt-40 text-center'>No accounts found for the selected location</h5>
      
    }

    return (
      
      <div >
        <Toaster position="top-center" reverseOrder={false}></Toaster>
        <h1 className="text-5xl font-medium text-customColor1 text-left ">Accounts</h1>
        <div>
        {this.renderLocationDropdown()}
        </div>
        <div>
        <button className={buttonStyle} onClick={this.handleFileSelect}>
          Import Accounts
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={this.handleFileChange}
          ref={(fileInput) => (this.fileInput = fileInput)}
          style={{ display: "none" }}
        />
       
       </div>
        
        
        
        <div>
        <div>
          <input
          type="text"
          placeholder="Search Accounts"
          value={searchInput}
          onChange={this.handleSearchInputChange}
          className="absolute p-1 px-3 w-11/12 border-solid border-2 rounded-full mt-6 text-xl"

        />
        </div>
        <i className="absolute mt-8 right-7 text-gray-300 fas fa-solid fa-magnifying-glass"/>   
        </div>
        <button className={buttonStyle1} onClick={this.openPopup}>
        <i className="fas fa-plus-circle" style={{ marginRight: 10}}></i>
          Add Account
        </button>
        <div className={listContainerStyle}>
         
      <ul  style={{ listStyleType: "none", padding: 0 }}>
      {listContent}

      </ul>
    </div>
     
    {isAccountDetailsExpanded && (
          <AccountDetails
  
            addressData={selectedAddress}
            isExpanded={isAccountDetailsExpanded}
            onToggleExpand={() => this.setState({ isAccountDetailsExpanded: !isAccountDetailsExpanded })
            }
            />
            )}

{this.state.isPopupOpen && <Popup onClose={this.closePopup} selectedLocation={this.state.selectedLocation} companyId={this.state.companyId} />
  }
    
      </div>
    );
  }
}

export default Account;