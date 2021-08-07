import axios, { AxiosResponse } from "axios";
import React from "react";

const register = async (_ev: any) => {
    const email = document.getElementById('email');
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    if (!username || !password || !email)
        return console.error('Username or Password or Email not found');

    const {data} = await axios.get(`/api/user/register?email=${email.value}&username=${username.value}&password=${password.value}`, {validateStatus: null}) as AxiosResponse;
    console.log(data)
}

const RegisterForm: React.FC = (props) => {
    return (
        <div>
            <h1>Register</h1>
            <label htmlFor="email">Email:</label>
            <input id="email" name="email"></input>
            <br></br>
            <label htmlFor="username">Username:</label>
            <input id="username" name="username"></input>
            <br></br>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password"></input>
            <br></br>
            <button onClick={register}>Submit</button>
        </div>
    );
}

export default RegisterForm;