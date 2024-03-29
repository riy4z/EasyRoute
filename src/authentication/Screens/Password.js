import React, {useState} from 'react';
import {useFormik} from 'formik';
import styles from '../../styles/ProfileStyle.module.css';
import toast, { Toaster } from 'react-hot-toast';
import avatar from '../assets/avatar.png';
import {Link, useNavigate} from 'react-router-dom';
import { passwordValidate } from '../helper/validate';
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store';
import { verifyPassword } from '../helper/helper';

export default function Password(){
  const navigate = useNavigate()
  const {username} = useAuthStore(state => state.auth)
  const [{isLoading, apiData, serverError}]= useFetch(`/user/${username}`)
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
        initialValues:{
          password:''
        },
        validate : passwordValidate,
        validateOnBlur:false,
        validateOnChange : false,
        onSubmit : async values => {
          let loginPromise = verifyPassword({username, password : values.password})
          toast.promise(loginPromise, {
            loading : 'Checking...',
            success : <b>Login Successful...!</b>,
            error : <b>Invalid Password!</b>
          });

          loginPromise.then(res=> {
            let {token} = res.data;
            localStorage.setItem('token', token);
            navigate('/app')
          }).catch((error) => {
            console.error("Error: ", error);
          });
        }
      })
      const handleTogglePassword = () => {
        setShowPassword(!showPassword);
      };

      if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
      if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>
      if (!apiData) {
        return <h1 className='text-xl text-red-500'>Data not available</h1>;
      }
      return(
        <div className="container mx-auto">
    
          <Toaster position='top-center' reverseOrder={false}></Toaster>
    
          <div className='flex justify-center items-center h-screen'>
            <div className={styles.glass}>
    
              <div className="title flex flex-col items-center">
                <h4 className='text-5xl font-bold'>Hello {apiData?.firstName || username}</h4>
                <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                  Explore More by connecting with us.
                </span>
              </div>
    
              <form className='py-1' onSubmit={formik.handleSubmit}>
                  <div className='profile flex justify-center py-4'>
                      <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar" />
                  </div>
    
                  <div className="textbox flex flex-col items-center gap-6">
                      <input {...formik.getFieldProps('password')} className={styles.textbox} type={showPassword ? 'text' : 'password'} placeholder='Password' />
                      <i
                onClick={handleTogglePassword}
                className={`fixed mt-8 right-8 text-gray-300 cursor-pointer ${
                  showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                }`}
              ></i>
                      <button className={styles.btn} type='submit'>Sign in</button>
                  </div>
    
                  <div className="text-center py-4">
                    <span className='text-gray-500'>Forgot Password? <Link className='text-red-500' to="/recovery">Recover Now</Link></span>
                  </div>
    
              </form>
    
            </div>
          </div>
        </div>
      )
    }