import React, {useState} from "react";
import {message, Button, Form, Input, Card, Space, Divider} from 'antd';
import {useNavigate} from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from '@ant-design/icons';

import validator from "validator";
import './login.css';

import { loginUser } from "../../services/authService";
const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handlePasswordChange = (e) => {
        setPassword(e.target.value);

    };

    const showMessage = () => {
        message.success("Bienvenidos", 2);
      };

    const handleUsernameChange = (e) => {
        //setUsername(e.target.value.trim().toUpperCase() );
        setUsername(e.target.value.trim());
  

    };

    const onFinish =  async() => {
        console.debug('values on finish', password);


        try {

            await loginUser(username, password);
            showMessage();  // Show success message
            //message.info()
            navigate("/dashboard");
        } catch (error) {
            console.error('Error logging in:', error);
        }

    };

    return (
        <Space className="margin-top-80" align="center" direction="vertical" size="middle" style={{display: 'flex'}}>
        <Card title="Login" style={
            {width:350}
        }>
        <form onSubmit={onFinish}>
                    <Divider orientation="left">Username</Divider>

                     <Input
                        placeholder="input username"
                        value={username}
                        onChange={handleUsernameChange}
                        prefix={<UserOutlined />}
                    />

                    <br />
                    <br />
                    <Divider orientation="left">Password</Divider>
                    
                    <Input.Password
                        placeholder="input password"
                        value={password}
                        onChange={handlePasswordChange}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />

       
                    <br />
                    <Divider />
                    <Button type="primary"  onClick={onFinish}>
                        Login
                    </Button>
              </form>     
        </Card>
        
        </Space>
    );
        
};

export default LoginPage;