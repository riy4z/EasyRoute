import React, { useRef } from "react";
import {RxCrossCircled} from "react-icons/rx";
import instructions from "../../assets/images/instructions.png"

const ImportPopup = ({onClose, handleFileChange, handleFileSelect, fileInputRef}) =>{

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-opacity-50 backdrop-filter backdrop-blur-md flex items-center justify-center">
                  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg z-50 w-11/12 max-w-[700px] font-sans ">
        <h1 className="text-center font-medium text-2xl">Some import tips</h1>
        <div className="absolute top-4 right-4 cursor-pointer text-2xl" onClick={onClose}>
          <RxCrossCircled/>
          
        </div>
          <div>
            <p className="text-sm p-2 text-center"> 
            Having trouble? Read our guide or watch our video on making a good spreadsheet.
            </p>
            <div>
                <img className="w-[40rem]"src={instructions} alt="Instructions"/>
            </div>
            <button className="flex justify-center w-full h-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5" onClick={handleFileSelect}>Upload File (.csv)</button>
            <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
          </div>
          
        </div>
        </div>
    );
}

export default ImportPopup;