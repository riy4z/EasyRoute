import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import getCompanyID from '../../components/fetch/getCompany';

const FollowUp = () => {
  const [followUpData, setFollowUpData] = useState([]);
  const [addressInfoList, setAddressInfoList] = useState([]);
  const  companyID  = getCompanyID();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/getFollowUpDataByCompany?companyId=${companyID}`);
        setFollowUpData(response.data.followUps);
      } catch (error) {
        console.error('Error fetching follow-up data:', error);
      }
    };

    fetchData();
  }, [companyID]);

  useEffect(() => {
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
  }, [followUpData]);

  
return (
  <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-md max-h-screen overflow-y-auto">
    <h2 className="text-3xl font-semibold mb-4 ">FollowUp Screen</h2>
    <ul>
      {followUpData.map((item, index) => (
        <li key={item.markerId} className="mb-4 p-4 border border-gray-300 rounded-lg">
          <span className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
          </span> {`${addressInfoList[index]?.[0]?.['First Name'] || ''} ${addressInfoList[index]?.[0]?.['Last Name'] || ''}`}
          <span className="ml-2 font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
          </span> {new Date(item.followUp).toLocaleString()}
        </li>
      ))}
    </ul>
  </div>
);
};

export default FollowUp;