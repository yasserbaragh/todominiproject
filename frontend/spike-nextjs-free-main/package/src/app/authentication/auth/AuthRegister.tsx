import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import { useCookies } from 'react-cookie';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/js/fetch';
import { logIn } from '@/redux/features/auth-slice';

interface registerType {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
}

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
    const [values, setValues] = React.useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        password: ""
    })
    const [cookie, setCookie] = useCookies(['token'])
    const [token, setToken] = React.useState("")

    const changeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setValues((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const dispatch = useDispatch<AppDispatch>()

    const router = useRouter()

    const onLogIn = async () => {
        try {
            const response = await fetch(`${api}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    first_name: values.firstName,
                    last_name: values.lastName,
                    password: values.password,
                    role: "user"
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();  // Get the error response if any
                console.log('Error:', errorData);
                return
            }

            const data = await response.json();
            console.log(data)
            setCookie('token', data.token, { path: '/' })

            dispatch(
                logIn({
                    username: values.username,
                    token: data.token,
                    userId: data.id,
                    isAdmin: data.role === "admin"
                })
            );

            router.push("/")

        } catch (error) {
            console.error("Error during login:", error);
        }
    }
    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Box>
                <Stack mb={3}>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='name' mb="5px">
                        Username
                    </Typography>
                    <CustomTextField id="name" variant="outlined" fullWidth name="username" value={values.username}
                    onChange={changeValues}/>

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='email' mb="5px" mt="25px">Email Address</Typography>
                    <CustomTextField id="email" variant="outlined" fullWidth  name="email" value={values.email}
                    onChange={changeValues}/>

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='firstName' mb="5px">
                        Fist Name
                    </Typography>
                    <CustomTextField id="firstName" variant="outlined" fullWidth name="firstName" value={values.firstName}
                    onChange={changeValues} />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='lastName' mb="5px">
                        Last Name
                    </Typography>
                    <CustomTextField id="lastName" variant="outlined" fullWidth name="lastName" value={values.lastName}
                    onChange={changeValues} />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">Password</Typography>
                    <CustomTextField type="password" id="password" variant="outlined" fullWidth name="password" value={values.password}
                    onChange={changeValues}/>
                </Stack>
                <Button color="primary" variant="contained" size="large" fullWidth
                    onClick={onLogIn}>
                    Sign Up
                </Button>
            </Box>
            {subtitle}
        </>
    )
};

export default AuthRegister;
