import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import AccountDetails from '../Accounts/AccountDetails';

const FollowUp = (props) => {

  const [addressInfoList, setAddressInfoList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAccountDetailsExpanded, setIsAccountDetailsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listItemClick, setListItemClick] = useState(false);
  const [refresh, setRefresh] = useState(false);

  

  useEffect(() => {
    if (props.followUpData.length > 0) {
      const fetchAddressInfo = async () => {
        const infoList = await Promise.all(
          props.followUpData.map(async (item) => {
            const response = await api.get(`/get-address-data-marker?markerId=${item.addressId}`);
            setIsLoading(false)
            return response.data;
          })
        );
        setAddressInfoList(infoList);
      };

      fetchAddressInfo();
    }

    if (props.followUpData.length === 0){
      setIsLoading(false)
    }
  }, [props.followUpData]);



  const handleListItemClick = (address) => {
    setSelectedAddress(address);
    setIsAccountDetailsExpanded(true);
    setListItemClick(true);
  };

  const handleToggleExpand = () => {
    setIsAccountDetailsExpanded(!isAccountDetailsExpanded);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-5xl font-medium text-customColor1 text-left mb-2">Follow Up</h1>
        {props.followUpData.length === 0 && (
          <div className="flex text-gray-400 text-sm p-1 h-full justify-center items-center mx-4 my-8">
          <p>ⓘ No Followup Found for the selected Location, create followups using the Account Details</p>
          </div>
        )}
      {props.followUpData.length>0 && (
      <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-md max-h-screen overflow-y-auto">
        <ul className="space-y-4">
        {props.followUpData.map((item, index) => (
          <li
            key={item.markerId}
            className="p-4 border border-gray-300 rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:shadow-md hover:-translate-y-1"
            onClick={() => handleListItemClick(addressInfoList[index]?.[0])}
          >
            <span className="text-lg font-semibold">
              {new Date(item.followUp).toLocaleDateString()}
            </span>
            <div className="flex items-center mt-2">
              <span className="text-gray-600 text-base">
                {`${addressInfoList[index]?.[0]?.['First Name'] || ''} ${addressInfoList[index]?.[0]?.['Last Name'] || ''}`}
              </span>
            </div>
          </li>
        ))}
      </ul>
        {isAccountDetailsExpanded && (
          <AccountDetails
            addressData={selectedAddress}
            isExpanded={isAccountDetailsExpanded}
            onToggleExpand={handleToggleExpand}
            listItemClick={listItemClick}
            setRefresh={setRefresh}
            refresh={refresh}
            selectedLocation={props.selectedLocation}
          />
        )}
      </div>
      )}
        
    </div>
  );
};

export default FollowUp;
