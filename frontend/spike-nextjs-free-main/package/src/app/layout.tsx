"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReduxProvider } from "@/redux/provider";
import { CookiesProvider, useCookies } from "react-cookie";
import { AppDispatch } from "@/redux/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { api, getData } from "@/utils/js/fetch";
import { logIn, logOut } from "@/redux/features/auth-slice";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={baselightTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <ReduxProvider>
              {children}
            </ReduxProvider>
          </CookiesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
