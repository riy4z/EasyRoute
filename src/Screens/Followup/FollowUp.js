// FollowUp.js
import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import getCompanyID from '../../components/fetch/getCompany';
import AccountDetails from '../Accounts/AccountDetails';

const FollowUp = (props) => {
  const [followUpData, setFollowUpData] = useState([]);
  const [addressInfoList, setAddressInfoList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAccountDetailsExpanded, setIsAccountDetailsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listItemClick, setListItemClick] = useState(false);
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/getFollowUpDataByLocation?locationId=${props.selectedLocation}`);
        const sortedFollowUpData = response.data.followUps.sort((a, b) => new Date(a.followUp) - new Date(b.followUp));
        setFollowUpData(sortedFollowUpData);
      } catch (error) {
        console.error('Error fetching follow-up data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refresh, props.selectedLocation]);


  useEffect(() => {
    if (followUpData.length > 0) {
      const fetchAddressInfo = async () => {
        const infoList = await Promise.all(
          followUpData.map(async (item) => {
            const response = await api.get(`/get-address-data-marker?markerId=${item.addressId}`);
            return response.data;
          })
        );
        setAddressInfoList(infoList);
      };

      fetchAddressInfo();
    }
  }, [followUpData]);

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
console.log(addressInfoList)
  return (
    <div>
      <h1 className="text-5xl font-medium text-customColor1 text-left mb-2">Follow Up</h1>
    <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-md max-h-screen overflow-y-auto"> 
      <ul className="space-y-4">
        {followUpData.map((item, index) => (
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
    </div>
  );
};

export default FollowUp;
