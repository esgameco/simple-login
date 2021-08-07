import axios, { AxiosResponse } from "axios";
import React from "react";

const getUser = async (_ev: any) => {
    const usernameTag = document.getElementById('username');
    const accessTag = document.getElementById('access');
    const emailTag = document.getElementById('email');
    const queriesTag = document.getElementById('queries');

    if (!usernameTag || !accessTag || !emailTag || !queriesTag)
        return console.error('Username not found');

    const {data: res} = await axios.get(`/api/user/${usernameTag.value}`, {validateStatus: null}) as AxiosResponse;
    const {access, email, queries} = res.data;

    if (access === undefined || !email || !queries)
        return console.error('Information was not returned correctly');

    accessTag.innerHTML = access;
    emailTag.innerHTML = email;
    queriesTag.innerHTML = queries;
}

const UserForm: React.FC = (props) => {
    return (
        <div>
            <h1>User</h1>
            <label htmlFor="username">Username:</label>
            <input id="username" name="username"></input>
            <br></br>
            <button onClick={getUser}>Submit</button>

            <output>
                <p>Access: <span id="access"></span></p>
                <p>Email: <span id="email"></span></p>
                <p>Queries Left: <span id="queries"></span></p>
            </output>
        </div>
    );
}

export default UserForm;