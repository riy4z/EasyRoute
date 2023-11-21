import React from "react";
import handleFileUpload from "../components/handleFileUpload";
import Popup from "./Popup";
import AccountDetails from "./AccountDetails";


class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopupOpen: false,
      savedaddress: [],
      searchInput: "", // State variable to store the search input
      selectedAddress: null, 
      isAccountDetailsExpanded: false,
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
    this.fetchAddressData();
  }

  handleFileSelect = () => {
    this.fileInput.click();
  };

  handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file, (data) => {
      this.props.setAddresses(data); // Pass the parsed data to the parent component
    });
  };

  openPopup = () => {
    this.setState({ isPopupOpen: true });
  };

  closePopup = () => {
    this.setState({ isPopupOpen: false });
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

  render() {
    const { savedaddress, searchInput, selectedAddress, isAccountDetailsExpanded } = this.state;
   
      // Sort the addresses based on the 'First Name' in ascending order
    const sortedAddresses = [...savedaddress].sort((a, b) => {
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
    const buttonStyle = "cursor-pointer bg-blue-600 rounded-lg px-14 py-1.5 text-white font-medium absolute top-32 text-xl"
    // {
    //   backgroundColor: '#0066ff',
    //   border: "none",
    //   borderRadius: 10,
    //   color: "white",
    //   padding: "10px 80px",
    //   textAlign: "center",
    //   textDecoration: "none",
    //   display: "inline-block",
    //   fontWeight: 600,
    //   position: "absolute",
    //   fontSize: "16px",
    //   cursor: "pointer",
    //   top:"160px"
    // };

    const buttonStyle1 = "cursor-pointer bg-customColor1 rounded-lg p-2 text-white font-medium absolute bottom-4 left-16 text-xl"
    // {
    //   bottom:70,
    //   backgroundColor: '#394359',
    //   border: "none",
    //   borderRadius: 10,
    //   color: "white",
    //   padding: "10px 10px",
    //   textAlign: "center",
    //   textDecoration: "none",
    //   display: "inline-block",
    //   fontWeight: 600,
    //   position: "absolute",
    //   fontSize: "16px",
    //   cursor: "pointer",
    //   justifyContent:"center",
    //   left:"85px",
    // };

    // const style="text-5xl font-medium text-customColor1 text-left"
    // // {
    // //   fontSize: 50,
    // //   fontWeight:600,
    // //   color: "#282c34",
    // //   textAlign:"left",
    // // }
    
    const listContainerStyle =  `absolute ${
      savedaddress && savedaddress.length > 0 ? 'overflow-y-scroll h-3/5 mt-48' : 'overflow-hidden'
    }`;
    // {
    //   position:"absolute",
    //   height: "600px", // Set a fixed height for the container
    //   overflow: "auto", // Enable vertical scrolling
    //   marginTop:"110px",
    //   marginRight:"10px"
    // };

    //List Content
    let listContent;
    if (savedaddress && savedaddress.length > 0) {
      const visibleAddresses = sortedAddresses.filter(address => !address.isHidden);
    
      listContent = visibleAddresses.map((address, index) => (
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
      listContent = <h5 class='mt-48'>No accounts found</h5>
      
    }

    return (
      <div >
        <h1 class="text-5xl font-medium text-customColor1 text-left ">Accounts</h1>

        <button class={buttonStyle} onClick={this.handleFileSelect}>
          Import Accounts
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={this.handleFileChange}
          ref={(fileInput) => (this.fileInput = fileInput)}
          style={{ display: "none" }}
        />
        <div>
          <input
          type="text"
          placeholder="Search Accounts"
          value={searchInput}
          onChange={this.handleSearchInputChange}
          class="absolute p-1 px-3 w-11/12 border-solid border-2 rounded-full mt-28 text-xl"
          // {{
          
          //   padding: "10px",
          //   width: "85%",
          //   border: "1px solid #ccc",
          //   borderRadius: "15px",
          //   marginTop:"50px",
          //   position:"absolute"
          // }}
        />
        <i className="absolute top-[226px] right-7 text-gray-300 fas fa-solid fa-magnifying-glass"/>   
        </div>
        <button class={buttonStyle1} onClick={this.openPopup}>
        <i className="fas fa-plus-circle" style={{ marginRight: 10}}></i>
          Add Account
        </button>
        <div class={listContainerStyle}> 
      
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

{this.state.isPopupOpen && <Popup onClose={this.closePopup} />
  }
    
      </div>
    );
  }
}

export default Account;