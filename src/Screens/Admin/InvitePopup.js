import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import getCompanyID from "../../components/fetch/getCompany"
import { RxCrossCircled } from 'react-icons/rx';
import fetchLocations from '../../components/fetch/fetchLocations';
import fetchRoles from '../../components/fetch/fetchRoles';
import getRoleHierarchy from '../../components/fetch/getRoleHierarchy';
import CryptoJS from 'crypto-js';
import config from '../../config/config';

function InvitePopup(props) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [locationsFromServer, setLocationsFromServer] = useState([]);
  const [rolesFromServer, setRolesFromServer] = useState([]);

  useEffect(() => {
    // Fetch locations from the server when the component mounts
    const fetchData = async () => {
      try {
        const locations = await fetchLocations();
        setLocationsFromServer(locations);
         // Update the state with locations
        const roles = await fetchRoles();
        setRolesFromServer(roles);
      } catch (error) {
        // Handle the error as needed
      }
    };

    fetchData();
  }, []);


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleInviteClick = async () => {
    if (!email || !role || !location) {
      alert('Please fill in all fields');
      return;
    }

    const companyId = getCompanyID();

    if (!companyId) {
      // Handle the case where companyId is null or undefined
      console.error('Company ID is not available');
      return;
    }
    

    const uniqueLink = generateUniqueLink(email, location, role, companyId);

    try {
      await axios.post('/api/registerMail', { userEmail: email, text: `<!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
      <title>
  
      </title>
      <!--[if !mso]><!-- -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
          #outlook a {
              padding: 0;
          }
  
          .ReadMsgBody {
              width: 100%;
          }
  
          .ExternalClass {
              width: 100%;
          }
  
          .ExternalClass * {
              line-height: 100%;
          }
  
          body {
              margin: 0;
              padding: 0;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
          }
  
          table,
          td {
              border-collapse: collapse;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
          }
  
          img {
              border: 0;
              height: auto;
              line-height: 100%;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
          }
  
          p {
              display: block;
              margin: 13px 0;
          }
      </style>
      <!--[if !mso]><!-->
      <style type="text/css">
          @media only screen and (max-width:480px) {
              @-ms-viewport {
                  width: 320px;
              }
              @viewport {
                  width: 320px;
              }
          }
      </style>
      <!--<![endif]-->
      <!--[if mso]>
          <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
      <!--[if lte mso 11]>
          <style type="text/css">
            .outlook-group-fix { width:100% !important; }
          </style>
          <![endif]-->
  
  
      <style type="text/css">
          @media only screen and (min-width:480px) {
              .mj-column-per-100 {
                  width: 100% !important;
              }
          }
      </style>
  
  
      <style type="text/css">
      </style>
  
  </head>
  
  <body style="background-color:#f9f9f9;">
  
  
      <div style="background-color:#f9f9f9;">
  
  
          <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
        >
          <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
  
  
          <div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">
  
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9f9f9;background-color:#f9f9f9;width:100%;">
                  <tbody>
                      <tr>
                          <td style="border-bottom:#333957 solid 5px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
          <tr>
        
          </tr>
        
                    </table>
                  <![endif]-->
                          </td>
                      </tr>
                  </tbody>
              </table>
  
          </div>
  
  
          <!--[if mso | IE]>
            </td>
          </tr>
        </table>
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
        >
          <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
  
  
          <div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">
  
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff;background-color:#fff;width:100%;">
                  <tbody>
                      <tr>
                          <td style="border:#dddddd solid 1px;border-top:0px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
          <tr>
        
              <td
                 style="vertical-align:bottom;width:600px;"
              >
            <![endif]-->
  
                              <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
  
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;" width="100%">
  
                                      <tr>
                                          <td align="center" style="font-size:0px;word-break:break-word;">
  
                                              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                  <tbody>
                                                      <tr>
                                                          <td style="width:150px;">
  
                                                              <img height="auto" src="https://i.postimg.cc/zDyzXGB0/EZ-Route-logos-transparent.png" style="border:0;display:block;outline:none;text-decoration:none;width:100%;" />
  
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
  
                                          </td>
                                      </tr>
  
                                      <tr>
                                          <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">
  
                                              <div style="font-family:'Calibri','Arial',sans-serif;font-size:32px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                  Invitation Link
                                              </div>
  
                                          </td>
                                      </tr>
  
                                      <tr>
                                          <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
  
                                              <div style="font-family:'Calibri',Arial,sans-serif;font-size:22px;line-height:22px;text-align:left;color:#555;">
                                                  Hi there,<b></b>
                                              </div>
  
                                          </td>
                                      </tr>
  
                                      <tr>
                                          <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:20px;word-break:break-word;">
  
                                              <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:left;color:#555;">
                                              Click the link below to register: <br></br> ${uniqueLink}. <hr></hr>
                                              </div>
  
                                          </td>
                                      </tr>
  
                                      <tr>
                                          <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
  
                                              <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:26px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                  Need Help?
                                              </div>
  
                                          </td>
                                      </tr>
  
                                      <tr>
                                          <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
  
                                              <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:center;color:#555;">
                                                  Please send feedback or bug info<br> to <a href="mailto:easyroutea2z@gmail.com" style="color:#2F67F6">easyroutea2z@gmail.com</a>
                                              </div>
  
                                          </td>
                                      </tr>
  
                                  </table>
  
                              </div>
  
                              <!--[if mso | IE]>
              </td>
            
          </tr>
        
                    </table>
                  <![endif]-->
                          </td>
                      </tr>
                  </tbody>
              </table>
  
          </div>
  
  
          <!--[if mso | IE]>
            </td>
          </tr>
        </table>
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
        >
          <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
  
  
          <div style="Margin:0px auto;max-width:600px;">
  
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                  <tbody>
                      <tr>
                          <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
          <tr>
        
              <td
                 style="vertical-align:bottom;width:600px;"
              >
            <![endif]-->
  
                              <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
  
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                      <tbody>
                                          <tr>
                                              <td style="vertical-align:bottom;padding:0;">
  
                                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
  
  
                                                      <tr>
                                                          <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
  
                                                              <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:0;text-align:center;color:#575757;">
                                                                  <a href="" style="color:#575757">Unsubscribe</a> from our emails
                                                              </div>
  
                                                          </td>
                                                      </tr>
  
                                                  </table>
  
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
  
                              </div>
  
                              <!--[if mso | IE]>
              </td>
            
          </tr>
        
                    </table>
                  <![endif]-->
                          </td>
                      </tr>
                  </tbody>
              </table>
  
          </div>
  
  
          <!--[if mso | IE]>
            </td>
          </tr>
        </table>
        <![endif]-->
  
  
      </div>`, subject: "Invite link for company" });
      console.log(`Invitation email sent to ${email}`);
    } catch (error) {
      console.error('Error sending invitation email:', error);
    }



    setEmail('');
    setRole('');
    setLocation('');


    props.closePopup();
  };
  const encrypt = (text) => {
    const key = config.secretkey; 
    const encrypted = CryptoJS.AES.encrypt(text, key);
    return encrypted.toString();
  };
  // Function to generate a unique link
  const generateUniqueLink = (email, location, role, companyId) => {
    const encryptedParams = encrypt(`${email}:${location}:${role}:${companyId}`);
    return `http://${window.location.hostname}:3000/register/${encodeURIComponent(encryptedParams)}`;
  }
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full backdrop-filter backdrop-blur-md">
      <div className="bg-white p-8 rounded-lg shadow-lg z-50 max-w-md mx-auto relative text-2xl">
        <div className="absolute top-4 right-4 cursor-pointer">
          <button onClick={props.closePopup} className="text-gray-500 hover:text-gray-700">
            <RxCrossCircled />
          </button>
        </div>
        <h2 className="text-3xl font-bold text-center mb-4">Invite Users</h2>
        <hr className="my-4" />

      <label className="block mb-2 text-gray-700 text-sm">Email:</label>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
        required
        className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
      />

<label className="block mb-2 text-gray-700 text-sm">Role:</label>
<select
  value={role}
  onChange={handleRoleChange}
  className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
  required
>
  <option>Select Role</option>
  {rolesFromServer.map((rol) => (
    (getRoleHierarchy() === 0) || 
    (getRoleHierarchy() === 1 && rol.RoleHierarchy === 2) ? ( 
      <option key={rol.id} value={rol.RoleHierarchy}>
        {rol.Role}
      </option>
    ) : null
  ))}
</select>




      <label className="block mb-2 text-gray-700 text-sm">Location:</label>
      <select
        value={location}
        onChange={handleLocationChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
        required
      >
        <option>Select Location</option>
          {locationsFromServer.map((loc) => (
            <option key={loc.id} value={loc._id}>
              {loc.Location}
            </option>
          ))}
      </select>

      <div className="flex justify-end">
          <button
            onClick={handleInviteClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm"
          >
            Invite
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvitePopup;