import React from "react";
import "../src/Sidebar.css";
import "./App";

const SidebarMenu = ({ handleImport }) => {
  return (
    <div className="sidebar">
        <h2 style={{fontSize:30, color:'white'}}>EasyRoute</h2>
      <ul>
        <li><button>Support</button></li>
        <li><button onPress={handleImport}>Import CSV</button></li>
        <li><button>Settings</button></li>
        
      </ul>
    </div>
  );
};

export default SidebarMenu;