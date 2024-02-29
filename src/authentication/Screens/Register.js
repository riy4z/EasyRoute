import React, { useState, useEffect } from 'react';
import styles from "../../styles/RegisterScreen.module.css";
import toast, { Toaster } from 'react-hot-toast';
import avatar from '../assets/avatar.png';
import { Link, useNavigate } from 'react-router-dom';
import { registerValidation } from '../helper/validate';
import { registerUser, generateOTPbyEmail, verifyOTPbyEmail} from '../helper/helper';
import { getCompanyById } from '../../components/fetch/getCompanyById';
import { getRolesFromHierarchy } from '../../components/fetch/getRolesFromHierarchy';
import { getRolesbyHierarchyandCompany } from '../../components/fetch/getRolesByHierarchyandCompany';
import CryptoJS from 'crypto-js';
import config from '../../config/config';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationVisible, setVerificationVisible] = useState(false);
  const [isRegisterVisible, setRegisterVisible] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [companyID, setCompanyID] = useState('')
  const [location, setLocation] = useState('')
  const [companyname, setCompanyName] = useState('')
  const [rolename, setRoleName] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate input fields
    const validationErrors = await registerValidation({
      username: username,
      password: password,
      email: email,
    });
  
    if (Object.keys(validationErrors).length > 0) {
      // Display validation errors
      toast.error('Please fix the following errors:');
      Object.values(validationErrors).forEach((error) => toast.error(error));
      return;
    }
  
    // Proceed with registration
    const values = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: password,
      role: role,
      companyId: companyID,
      location: location,
      companyName: companyname,
      roleName: rolename,
    };
  
    let registerPromise = registerUser(values);
    toast.promise(
      registerPromise.then((response) => {
        if (response.error) {
          return Promise.reject(response.error);
        } else {
          navigate('/', { state: { message: 'Registered Successfully...!' } });
          return response;
        }
      }),
      {
        loading: 'Creating....',
        success: <b>Registered Successfully...!</b>,
        error: (error) => <b>{error}</b>,
      }
    );
  };
  

  const checkEmailExistence = async () => {
    const { error: emailError } = await registerUser({
      email: email,
      password: '',
    });
  
    if (emailError && emailError.includes('email')) {
      toast.error('Email already exists. Please use a different email.');
      return false;
    }
  
    return true;
  };
  
  const handleVerifyEmail = async () => {
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }
    const isEmailValid = await checkEmailExistence();

    if (isEmailValid) {
      setVerificationVisible(true); 
    }
  };



const decrypt = (encryptedText) => {
  const key = config.secretkey; // Replace with your secret key
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
};
  

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isVerificationVisible) {
      generateOTPbyEmail(email).then((OTP) => {
        if (OTP) {
          toast.success('OTP has been sent to your email');
        } else {
          toast.error('Problem while generating OTP');
        }
      });
    }
  }, [email, isVerificationVisible]);


  useEffect(() => {
    const urlParams = window.location.pathname.split('/').filter(Boolean);
    const encryptedParams = urlParams[1];
  const decryptedParams = decrypt(decodeURIComponent(encryptedParams));
 

  const [emailFromUrl, locationFromUrl, roleFromUrl, companyIdFromUrl] = decryptedParams.split(':');

    getCompanyById(companyIdFromUrl)
      .then((company) => {
        if (company) {
    setEmail(emailFromUrl || '')
    setCompanyID(companyIdFromUrl || '')
    setLocation(locationFromUrl || '')
    setCompanyName(company.CompanyName)
  } else {
    console.error('Company not found for companyId:', companyIdFromUrl);
  }
})
.catch((error) => {
  console.error('Error fetching company details:', error);
});

getRolesbyHierarchyandCompany(roleFromUrl,companyIdFromUrl).then((role)=>{
  if (role) {
    setRoleName(role[0].Role)
    setRole(role[0].RoleHierarchy)
  } else {
    console.error('Role not found for rolehierarchy and companyID:', roleFromUrl);
  }
}).catch((error) => {
  console.error('Error fetching role details:', error);
});

  
  }, []);

  function resendOTP(){
    let sendPromise = generateOTPbyEmail(email);

    toast.promise(sendPromise, {
    loading: 'Sending...',
    success : <b>OTP has been sent to your email!</b>,
    error : <b>Could not send OTP!</b>
  });

  sendPromise.then(OTP =>{
    // console.log(OTP)
  })
  }

 const verifyemailbutton = "border border-indigo-500 mt-4 ml-[40%] px-2 py-2 rounded-lg text-black text-xl shadow-sm text-center hover:bg-indigo-500 hover:text-white"
 const registerbutton = "relative right-44 border border-indigo-500 mt-4 px-2 py-2 rounded-lg text-black text-xl shadow-sm text-center hover:bg-indigo-500 hover:text-white"

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
      
        <div className={`${styles.glass}`} style={{ width: '45%', paddingTop: '3em' }}>
        <div className="title flex flex-col items-center">
                <h4 className='text-5xl font-bold'>Register</h4>
                <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                    Happy to join you as <b>{rolename}</b> at <b>{companyname}</b>!
                </span>

              </div>
        

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-12">
            
            <div>
              <label htmlFor="firstName">First Name*</label>
              <input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={styles.textbox}
                type="text"
                placeholder="First Name*"
              />
            </div>
            <div>
              <label htmlFor="lastName">Last Name*</label>
              <input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={styles.textbox}
                type="text"
                placeholder="Last Name*"
              />
              </div>

              <div>
              <label htmlFor='username'>Username*</label>
              <input
                id='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.textbox}
                type="text"
                placeholder="Username*"
              />
              </div>
              <div>
                <label htmlFor='password'>Password*</label>
              <input
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.textboxpwd}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password*"
              />
              <i
                onClick={handleTogglePassword}
                className={`fixed right-[4.8%] mt-5 text-gray-300 cursor-pointer text-xl ${
                  showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'
                }`}
              ></i>
              </div>
             
              <label htmlFor='email'>Email*</label>
              <input
                id='email'
                value={email}
                className={`${styles.textbox} col-span-2`}
                type="email"
                placeholder="Email*"
                disabled={isEmailVerified || email !== ''}
              />
              <i
                className={`absolute right-9 mt-44 text-green-500 text-2xl ${
                  isEmailVerified ? 'fas fa-regular fa-circle-check' : ''
                }`}
              ></i>
              <div>
              
              </div>
              
             {/*REGISTER BUTTON*/}
             {isRegisterVisible &&
                <button className={registerbutton} onClick={handleSubmit}>
                  Register
                </button>
              }
            </div>

            {/* <div className="text-center py-4">
              <span className="text-gray-500">
                Already Registered? <Link className="text-red-500" to="/">
                  Login Now
                </Link>
              </span>
            </div> */}
        

          {/* Verification pop-up */}
          {isVerificationVisible && (
            <div className={styles.verificationPopup}>
              <h2 className="text-2xl font-bold">Verify OTP</h2>
              <text>Enter the OTP sent to your email address.</text>
              <input className="border px-4 py-3 rounded-xl shadow-sm text-md mt-2" type="text" placeholder="OTP*"  value={enteredOTP}
  onChange={(e) => setEnteredOTP(e.target.value)} />
              {/*VERIFY BUTTON 2*/}
              <button className="fas fa-solid fa-circle-xmark absolute top-4 right-6 text-xl" onClick={() => setVerificationVisible(false)}></button>
              <button onClick={resendOTP} className="border border-indigo-500 py-2 px-3  rounded-lg text-black text-xl shadow-sm relative text-center bottom-[55px] left-[40px] hover:bg-indigo-500 hover:text-white hover:border-none">Resend OTP</button>
              <button className="border border-indigo-500 py-2 px-3  rounded-lg text-black text-xl shadow-sm relative text-center mt-[70px] right-[61px] hover:bg-indigo-500 hover:text-white hover:border-none"
              onClick={async () => {
                try {
                  const response = await verifyOTPbyEmail({ email: email, code: enteredOTP });
            
                  if (response.status === 201) {
                    // OTP is correct, proceed with registration or any other action
                    setRegisterVisible(true);
                    setVerificationVisible(false);
                    setIsEmailVerified(true);
                  } else {
                    // OTP is incorrect, show an error message
                    toast.error('Invalid OTP. Please try again.');
                  }
                } catch (error) {
                  // Handle any error that occurred during OTP verification
                  toast.error('Error verifying OTP. Please try again.');
                }
              }}
            >Verify</button>
            </div>
          )}
       {/*VERIFY BUTTON*/}
       {!isVerificationVisible && !isRegisterVisible && (
            <button
              className={verifyemailbutton}
              onClick={handleVerifyEmail}
            >
              Verify Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
// HI THERE!!