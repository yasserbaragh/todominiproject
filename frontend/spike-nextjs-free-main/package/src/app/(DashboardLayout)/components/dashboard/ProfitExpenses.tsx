import React from "react";
import { MenuItem, Box, IconButton, Menu, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";

const options = [
  "Action",
  "Another Action",
  "Something else here",
];

const ProfitExpenses = () => {
  // menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.error.main;

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: true,
      },
      height: 370,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "42%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },

    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 4,
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart: any = [
    {
      name: "Pixel ",
      data: [9, 5, 3, 7, 5, 10, 3],
    },
    {
      name: "Ample ",
      data: [6, 3, 9, 5, 4, 6, 4],
    },
  ];

  const dispatch = useDispatch<AppDispatch>()

  const stats = useAppSelector((state) => state.statReducer.value)

  return (
    <DashboardCard
      title="Task Statistics"
    >
      <Box
        sx={{
          width: '100%',
          height: 150, 
          backgroundColor: '#f0f0f0', 
          borderRadius: 2, 
          padding: 1, 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            height: 35, 
            backgroundColor: 'red', 
            borderRadius: 1, 
          }}
        >
          <Typography sx={{margin: 1, textTransform: "uppercase",
        fontWeight: "bold"}}>Total tasks: <b>{stats.all}</b></Typography>
        </Box>
        <Box
          sx={{
            height: 35, 
            backgroundColor: 'blue', 
            borderRadius: 1, 
          }}
        >
          <Typography sx={{margin: 1, textTransform: "uppercase",
        fontWeight: "bold"}}>Edited tasks: <b>{stats.edited}</b></Typography>
        </Box>
        <Box
          sx={{
            height: 35, 
            backgroundColor: 'green', 
            borderRadius: 1, 
          }}
        >
          <Typography sx={{margin: 1, textTransform: "uppercase",
        fontWeight: "bold"}}>deleted tasks: <b>{stats.deleted}</b></Typography>
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default ProfitExpenses;
