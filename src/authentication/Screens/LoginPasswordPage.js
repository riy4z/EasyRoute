import React, { useState, } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast, {Toaster} from 'react-hot-toast';
import { verifyPassword } from '../helper/helper';
import avatar from '../assets/avatar.png';
import styles from '../../styles/ProfileStyle.module.css';
import { useAuthStore } from '../store/store';


const LoginPasswordPage = () => {
  const [username, setUsernameLocal] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await verifyPassword({ username, password });

      if (response.data) {
        let {token} = response.data
        localStorage.setItem('token', token)
        setUsername(username);
        navigate('/app'); 
      } else {
        toast.error('Login failed. Username or password is incorrect');
      }
    } catch (error) {
      console.error('Error during login:', error);

      toast.error('Login failed');
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mx-auto">
       <Toaster position='top-center' reverseOrder={false}></Toaster>
      
       <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

        <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Hello</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>

          <div className='profile flex justify-center py-4'>
                  <img src={avatar} className={styles.profile_img} alt="avatar" />
              </div>
              <div className="textbox flex flex-col items-center gap-6">
      <input
        className={styles.textbox} type="text" placeholder='Username'
        value={username}
        onChange={(e) => setUsernameLocal(e.target.value)}
      />

      <input
        className={`${styles.textboxpwd}`}
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <i
                onClick={handleTogglePassword}
                className={`fixed mt-28 right-[19%] text-gray-300 cursor-pointer ${
                  showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                }`}
              ></i>


      <button className={styles.btn} onClick={handleLogin}>Login</button>

      </div>
      <div className="text-center py-4">
           <span className='text-gray-500'>Forgot Password? <Link className='text-red-500' to="/recoverypage">Recover Now</Link></span> 
   
      </div>
    </div>
    </div>
    </div>
  );
};

export default LoginPasswordPage;
