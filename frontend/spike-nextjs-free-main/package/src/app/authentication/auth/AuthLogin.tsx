"use client"
import React from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import Link from "next/link";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { logIn } from "@/redux/features/auth-slice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store";
import { useCookies } from "react-cookie";
import {api} from "@/utils/js/fetch"
import { redirect, useRouter } from "next/navigation";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [values, setValues] = React.useState({
    username: "",
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

  const onLogIn = async() => {
    try {
      const response = await fetch(`${api}/login`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: values.username,
          password: values.password,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to log in: ${response.status}`);
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

      <Stack>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="username"
            mb="5px"
          >
            Username or email
          </Typography>
          <CustomTextField variant="outlined" fullWidth name="username" value={values.username}
          onChange={changeValues} />
        </Box>
        <Box mt="25px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
          >
            Password
          </Typography>
          <CustomTextField type="password" variant="outlined" fullWidth name="password" value={values.password}
          onChange={changeValues}/>
        </Box>
        
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          
          type="button"
          onClick={onLogIn}
          className="mt-2"
        >
          Sign In
        </Button>
      </Box>
      {subtitle}
    </>
  )
};

export default AuthLogin;
