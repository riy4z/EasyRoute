import React, {useState} from 'react';
import { useFormik } from 'formik';
import styles from '../../styles/ProfileStyle.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Navigate } from 'react-router-dom';
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store';
import { resetPasswordValidation } from '../helper/validate';
import { resetPassword } from '../helper/helper';

export default function Reset() {
  const { username } = useAuthStore((state) => state.auth);
  const navigate = useNavigate();
  const [{ isLoading, apiData, status, serverError }] = useFetch('createResetSession');
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_pwd: '',
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        let resetPromise = resetPassword({ username, password: values.password });
        toast.promise(resetPromise, {
          loading: 'Updating..!',
          success: <b>Reset Successful!</b>,
          error: <b>Could not reset</b>,
        });

        resetPromise
          .then(function () {
            console.log('Password reset successfully');
            navigate('/password');
          })
          .catch((error) => {
            console.error('An error occurred during password reset:', error);
            toast.error('An error occurred during password reset');
          });
      } catch (error) {
        console.error('An error occurred during password reset:', error);
        toast.error('An error occurred during password reset');
      }
    },
  });
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>;
  if (status && status !== 201) return <Navigate to={'/password'} replace={true} />;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{ width: '50%' }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">Enter new password.</span>
          </div>

          <form className="py-20" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps('password')}
                className={styles.textbox}
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
              />
              <input
                {...formik.getFieldProps('confirm_pwd')}
                className={styles.textbox}
                type="password"
                placeholder="Repeat Password"
              />
              <i
                onClick={handleTogglePassword}
                className={`fixed mt-8 right-8 text-gray-300 cursor-pointer ${
                  showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                }`}
              ></i>
              <button className={styles.btn} type="submit">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
