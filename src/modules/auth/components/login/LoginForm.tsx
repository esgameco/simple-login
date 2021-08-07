import axios, { AxiosResponse } from "axios";
import React from "react";

const login = async (_ev: any) => {
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    if (!username || !password)
        return console.error('Username or Password not found');

    const {data} = await axios.get(`/api/user/login?username=${username.value}&password=${password.value}`, {validateStatus: null}) as AxiosResponse;
    console.log(data)
}

const LoginForm: React.FC = (props) => {
    return (
        <div>
            <h1>Login</h1>
            <label htmlFor="username">Username:</label>
            <input id="username" name="username"></input>
            <br></br>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password"></input>
            <br></br>
            <button onClick={login}>Submit</button>
        </div>
    );
}

export default LoginForm;