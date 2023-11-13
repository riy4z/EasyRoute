import axios from "axios";
import {jwtDecode} from 'jwt-decode';


axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN || 'http://localhost:4000/'


export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find Token");
    let decode = jwtDecode(token)
    return decode;
}

export async function authenticate(username){
    try {
        return await axios.post('/api/authenticate', {username})
    } catch (error) {
        return { error : "Username doesn't exist...!"}
    }
}

export async function getUser({username}){
    try {
        const {data} = await axios.get(`api/user/${username}`)
        return {data};
    } catch (error) {
        return {error : "Password doesn't match..!"}
    }
}


export async function registerUser(credentials) {
    try {
        const { data: { msg, error }, status } = await axios.post(`/api/register`, credentials);
        
        let { username, email } = credentials;

        if (status === 201) {
            await axios.post('/api/registerMail', { username, userEmail: email, text: msg });
        }

        return { msg, error };
    } catch (error) {
        if (error.response) {
            const { data } = error.response;
            return { error: data.error };
        } else {
            console.error('Error occurred during registration:', error);
            return { error: 'Internal server error' };
        }
    }

}
export async function authenticate1(email) {
    try {
      const response = await axios.post('/api/authenticate', { email });
      return response.data;
    } catch (error) {
      return { error: 'Error checking email existence' };
    }
  }
// export async function verifyEmail(credentials) {
//     try {
//         const { data: { msg, error }, status } = await axios.get(`/api/verifyEmail`, credentials);
        
//         let email = credentials;

//         if (status === 201) {
//             return { msg: 'Verified', email };
//         }

//         return { msg, error };
//     } catch (error) {
//         if (error.response) {
//             const { data } = error.response;
//             return { error: data.error };
//         } else {
//             console.error('Error occurred during registration:', error);
//             return { error: 'Internal server error' };
//         }
//     }
// }


export async function verifyPassword({username, password}){
    try {
      if(username){
        const {data} = await axios.post('/api/login', {username, password})
        return Promise.resolve({data});
     }
    } catch (error) {
        return Promise.reject({error : "Password doesn't match...!"})
    }
}

export async function updateUser(response){
    try {
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, {headers : { "Authorization": `Bearer ${token}`}});

        return Promise.resolve({data})
    } catch (error) {
        return Promise.reject({ error : "Couldn't Update Profile"})
    }
}

export async function generateOTP(username){
    try {
        const {data : {code}, status} = await axios.get('/api/generateOTP', {params : {username}})
    
        if (status === 201){

          let {data : {email}} = await getUser({username});
          let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
          await axios.post('/api/registerMail', {username, userEmail: email, text, subject: "Password Recovery OTP"})  
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error})
    }
}

export async function generateOTPbyEmail(email) {
    try {
        const { data: { code }, status } = await axios.get('/api/generateOTPbyEmail', { params: { email } });

        if (status === 201) {
            let text = `Your EasyRoute Registration OTP is ${code}. Verify to continue registration.`;
            await axios.post('/api/registerMail', { userEmail: email, text, subject: "Registration OTP" });
        }

        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error });
    }
}


export async function verifyOTP({username, code}){
    try {
        const {data, status} = await axios.get('/api/verifyOTP', {params : {username, code}})
        return {data, status}
    } catch (error) {
        return Promise.reject(error);
    }

}
export async function verifyOTPbyEmail({email, code}){
    try {
        const {data, status} = await axios.get('/api/verifyOTPbyEmail', {params : {email, code}})
        return {data, status}
    } catch (error) {
        return Promise.reject(error);
    }

}



export async function resetPassword({username, password}){
    try {
        const {data, status} = await axios.put('/api/resetPassword', {username, password});
        return Promise.resolve({data, status})
    } catch (error) {
        return Promise.reject({error})
    }
}

