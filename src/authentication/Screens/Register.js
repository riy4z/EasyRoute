import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import styles from '../../styles/ProfileStyle.module.css';
import toast, { Toaster } from 'react-hot-toast';
import avatar from '../assets/avatar.png';
import { Link, useNavigate } from 'react-router-dom';
import convertToBase64 from '../helper/convert';
import { registerValidation } from '../helper/validate';
import { registerUser, generateOTPbyEmail, verifyOTPbyEmail} from '../helper/helper';
import { getCompanyById } from '../../components/getCompanyById';
import { getRolesFromHierarchy } from '../../components/getRolesFromHierarchy';


export default function Register() {
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationVisible, setVerificationVisible] = useState(false);
  const [isRegisterVisible, setRegisterVisible] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [roles, setRoles] = useState([]);

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
      role: '',
      companyId: '',
      location: '',
      companyName: '',
      roleName:'',
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || '',});    
      console.log(values)
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
}
  
  })

  const checkEmailExistence = async () => {
    const { error: emailError } = await registerUser({
      email: formik.values.email,
      password: '',
    });
  
    if (emailError && emailError.includes('email')) {
      toast.error('Email already exists. Please use a different email.');
      return false;
    }
  
    return true;
  };
  
  const handleVerifyEmail = async () => {
    if (!formik.values.email) {
      toast.error('Please enter a valid email address.');
      return;
    }
    const isEmailValid = await checkEmailExistence();

    if (isEmailValid) {
      setVerificationVisible(true); 
    }
  };


  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isVerificationVisible) {
      generateOTPbyEmail(formik.values.email).then((OTP) => {
        if (OTP) {
          toast.success('OTP has been sent to your email');
        } else {
          toast.error('Problem while generating OTP');
        }
      });
    }
  }, [formik.values.email, isVerificationVisible]);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    const locationFromUrl = urlParams.get('location');
    const roleFromUrl = urlParams.get('role');
    const companyIdFromUrl = urlParams.get('companyid');
    
  
    console.log('Email from URL:', emailFromUrl);
    console.log('Location from URL:', locationFromUrl);
    console.log('Role from URL:', roleFromUrl);
    console.log('Company ID from URL:', companyIdFromUrl);
    getCompanyById(companyIdFromUrl)
      .then((company) => {
        if (company) {

    formik.setValues({
      email: emailFromUrl || '',
      username: '',
      password: '',
      role: roleFromUrl || '', 
      companyId: companyIdFromUrl || '',
      location: locationFromUrl || '' ,
      companyId: company._id, 
      companyName: company.CompanyName,
    });
  } else {
    console.error('Company not found for companyId:', companyIdFromUrl);
  }
})
.catch((error) => {
  console.error('Error fetching company details:', error);
});
getRolesFromHierarchy(roleFromUrl)
.then((fetchedRoles) => {
  if (fetchedRoles && fetchedRoles.length > 0) {
    setRoles(fetchedRoles);
    const firstRole = fetchedRoles[0];
    formik.setFieldValue('roleName', firstRole.Role);
  }
})
.catch((error) => {
  console.error('Error fetching roles:', error);
});
   
    formik.setFieldTouched('email');
    formik.setFieldError('email', 'Email locked from URL parameter.');
  
  }, []);

  function resendOTP(){
    let sendPromise = generateOTPbyEmail(formik.values.email);

    toast.promise(sendPromise, {
    loading: 'Sending...',
    success : <b>OTP has been sent to your email!</b>,
    error : <b>Could not send OTP!</b>
  });

  sendPromise.then(OTP =>{
    // console.log(OTP)
  })
  }

 const verifyemailbutton = "border border-indigo-500  w-full py-2 rounded-lg text-black text-xl shadow-sm text-center hover:bg-indigo-500 hover:text-white"

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
      
        <div className={styles.glass} style={{ width: '45%', paddingTop: '3em' }}>
        <div className="title flex flex-col items-center">
                <h4 className='text-5xl font-bold'>Register</h4>
                <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                    Happy to join you as <b>{formik.values.roleName}</b> at <b>{formik.values.companyName}</b>!
                </span>

              </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src={file || avatar} className={styles.profile_img} alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" id="profile" name="profile" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder="Username*" />
              <input {...formik.getFieldProps('password')} className={styles.textbox} type={showPassword? 'text' : 'password'} placeholder="Password*" />
              <input {...formik.getFieldProps('email')} className={`${styles.textbox}`} type="email" placeholder="Email*" disabled={isEmailVerified || formik.values.email !== ''}  />
              <i
                onClick={handleTogglePassword}
                className={`fixed mt-[105px] right-7 text-gray-300 cursor-pointer text-2xl ${
                  showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'
                }`}
              ></i>
              <i
                className={`fixed mt-[195px] right-8 text-green-500 text-2xl ${
                  isEmailVerified ? 'fas fa-regular fa-circle-check' : ''
                }`}
              ></i>
             {/*REGISTER BUTTON*/}
             {isRegisterVisible &&
                <button className={styles.btn} type="submit">
                  Register
                </button>
              }
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Registered? <Link className="text-red-500" to="/">
                  Login Now
                </Link>
              </span>
            </div>
          </form>

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
                  const response = await verifyOTPbyEmail({ email: formik.values.email, code: enteredOTP });
            
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