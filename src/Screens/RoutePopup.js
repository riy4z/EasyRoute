import React, { useState, useEffect } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import { Toaster } from 'react-hot-toast';
import { FaSearch } from 'react-icons/fa';

function RoutePopup(props) {
  const { selectedLocation } = props;
  const [listAddress, setListAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [hasAccounts, setHasAccounts] = useState(true);

  useEffect(() => {
    if (props.addresses) {
      setListAddress(props.addresses);
      setHasAccounts(props.addresses.some((address) => address.LocationID === selectedLocation));
    }
  }, [props.addresses, selectedLocation]);

  const filteredAddresses = listAddress.filter((address) =>
    `${address["First Name"]} ${address["Last Name"]}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (props.selectedAddresses && props.selectedAddresses.length > 0) {
      setSelectedAddress((prevSelected) => {
        const updatedSelectedAddresses = { ...prevSelected };

        props.selectedAddresses.forEach((selectedAddress) => {
          updatedSelectedAddresses[selectedAddress._id] = true;
        });

        return updatedSelectedAddresses;
      });
    }
  }, [props.selectedAddresses]);

  const handleCheckboxChange = (_id) => {
    setSelectedAddress((prevSelected) => {
      const updatedSelected = { ...prevSelected };
      updatedSelected[_id] = !prevSelected[_id] || false;
      return updatedSelected;
    });
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setSelectedAddress(() => {
      const updatedSelected = {};
      listAddress.forEach((address) => {
        updatedSelected[address._id] = !selectAll;
      });
      return updatedSelected;
    });
  };

  const handleDoneClick = () => {
    const selectedAddresses = listAddress.filter(
      (address) =>
        selectedAddress[address._id] && address.LocationID === selectedLocation
    );
    props.onDone(selectedAddresses);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="bg-white p-8 rounded-lg shadow-lg z-50 max-w-md mx-auto">
       {hasAccounts ? ( 
        <div>
          <RxCrossCircled
            onClick={props.onClose}
            className="relative left-[300px] bottom-4 text-3xl text-gray-500 hover:text-gray-700 cursor-pointer"
          />

        </div>
        ) : (
        <div>
          <RxCrossCircled className="relative left-[370px] bottom-4 text-3xl cursor-pointer text-gray-500 hover:text-gray-700" onClick={props.onClose}/>
          </div>
          )}
        <h2 className="text-3xl font-bold text-center mb-4">Add Account to Route</h2>

        <div className="mb-4">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="flex items-center">
              <input
                type="text"
                id="table-search"
                className="block p-2 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for accounts"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FaSearch className="relative text-gray-400 right-8" />
            </div>
          </div>
        </div>
        <hr className="my-4" />

        {hasAccounts ? (
          <div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                <span className="ml-2 text-xl font-small text-gray-900">
                  Select All
                </span>
              </label>
            </div>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
              <div className="overflow-y-scroll max-h-80">
                {filteredAddresses.map((address) => (
                  <div
                    key={address._id}
                    className={`bg-white border-b hover:bg-gray-50 ${
                      address._id % 2 === 0 ? "" : "bg-gray-50"
                    }`}
                  >
                    <div className="w-1 p-1">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-table-search-${address._id}`}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                          checked={selectedAddress[address._id] || false}
                          onChange={() => handleCheckboxChange(address._id)}
                        />
                        <label
                          htmlFor={`checkbox-table-search-${address._id}`}
                          className="sr-only"
                        >
                          checkbox
                        </label>
                        <div className="px-3 py-1 text-lg font-small text-gray-900 whitespace-nowrap">
                          {address["First Name"]} {address["Last Name"]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleDoneClick}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none mt-4"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="text-center mt-4 text-gray-500">
            Import accounts for the selected location.
          </div>
        )}
      </div>
    </div>
  );
}

export default RoutePopup;