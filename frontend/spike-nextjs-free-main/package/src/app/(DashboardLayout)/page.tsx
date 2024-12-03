'use client'
import { Grid, Box, Typography, Button, Stack, Container, Checkbox, IconButton } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import ProfitExpenses from '@/app/(DashboardLayout)/components/dashboard/ProfitExpenses';
import TrafficDistribution from '@/app/(DashboardLayout)/components/dashboard/TrafficDistribution';
import ProductSales from '@/app/(DashboardLayout)/components/dashboard/ProductSales';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { api, getData } from '@/utils/js/fetch';
import DashboardCard from './components/shared/DashboardCard';
import CustomTextField from './components/forms/theme-elements/CustomTextField';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@/redux/store';
import taskSlice, { addTask, deleteTask, editTask, task } from "@/redux/features/taskSlice"
import { Check, Close, Delete, Edit } from '@mui/icons-material';
import { Righteous } from 'next/font/google';
import { addStat } from '@/redux/features/statsSlice';

const Dashboard = () => {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();
  const [loading, setLoading] = React.useState(true)
  const [isAdmin, setisAdmin] = React.useState(false)
  const [add, setAdd] = useState(false)
  const [userId, setUserId] = useState("")
  const [values, setValues] = useState({
    task: "",
    description: ""
  })
  const [loadTasks, setLoadTasks] = useState(false)
  const [checked, setIsChecked] = useState([{
    id: 0,
    isChecked: false
  }])
  const [edit, setEdit] = useState(null)
  const [editedTask, setEditedTask] = useState("")
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  const changeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setValues((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const dispatch = useDispatch<AppDispatch>()

  const tasks = useAppSelector((state) => state.taskReducer.value)

  const addTaskk = async () => {
    try {
      const response = await fetch(`${api}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cookies.token}`

        },
        body: JSON.stringify({
          userId: userId,
          task: values.task,
          description: values.description,
          isDone: false,
          isEdited: false
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to log in: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)

      dispatch(
        addTask({
          id: data.id,
          task: values.task,
          description: values.description,
          isDone: false,
          isEdited: false
        })
      );
      setAdd(false)
      setValues({
        task: "",
        description: ""
      })

    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData(`${api}/currentUser`, cookies.token)
      if (data.error) {
        return
      }
      console.log(data)
      setisAdmin(data.role === "admin")
      setUserId(data.id)
      setLoading(false)
      setLoadTasks(true)
    }
    if (!cookies.token || cookies.token === "") {
      router.push("/authentication/login");
    } else {
      fetchData()
    }
  }, [cookies.token, router]);



  useEffect(() => {
    if (loadTasks && !isAdmin) {
      const fetchData = async () => {
        const data = await getData(`${api}/allTasks?userId=${userId}`, cookies.token)
        if (data.error) {
          return
        }
        console.log(data)
        setLoadTasks(false)
        for (const ta of data) {
          const existingTask = tasks.find(task => task.id === ta.id)

          if (!existingTask) {
            setIsChecked(prev => ([...prev, { id: ta.id, isChecked: ta.isDone }]))
            dispatch(
              addTask({
                id: ta.id,
                task: ta.task,
                description: ta.description,
                isDone: ta.isDone,
                isEdited: ta.isEdited
              })
            );
          }
        }
      }
      fetchData()
    } else if (loadTasks && isAdmin) {
      const fetchDataAdmin = async () => {
        const data = await getData(`${api}/stats`, cookies.token)
        if (data.error) {
          return
        }
        console.log(data)
        setLoadTasks(false)

        dispatch(
          addStat({
            all: data.all,
            edited: data.edited,
            deleted: data.deleted
          })
        );

      }
      fetchDataAdmin()
    }
    //console.log(checked[1].isChecked)
  }, [loadTasks])


  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDelete = async (taskId: number) => {
    try {
      const response = await fetch(`${api}/task/${taskId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cookies.token}`

        },
      });

      if (!response.ok) {
        const error = await response.json()
        console.log(error)
        throw new Error(`Failed to log in: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)
      alert("deleted successfully")

      dispatch(
        deleteTask(taskId)
      );

    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleCheckboxChange = async (taskId: number, taskIsDone: boolean) => {
    try {
      const response = await fetch(`${api}/task/${taskId}/isDone`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cookies.token}`

        },
        body: JSON.stringify({
          isDone: !taskIsDone,
        }),
      });

      if (!response.ok) {
        const error = await response.json()
        console.log(error)
        throw new Error(`Failed to log in: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)
      setIsChecked(prev => (
        prev.map(task =>
          task.id === taskId
            ? { ...task, isChecked: !task.isChecked }
            : task
        )
      ));

      dispatch(
        editTask({
          id: taskId,
          task: data.task,
          description: data.description,
          isDone: taskIsDone,
          isEdited: data.isEdited
        })
      );

    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  const isTaskChecked = (taskId: number) => {
    const task = checked.find((c) => c.id === taskId);
    return task ? task.isChecked : false;
  };

  const handleEditClick = async (taskId: number) => {
    if (edit) {
      try {
        const response = await fetch(`${api}/task/${taskId}/edit`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cookies.token}`

          },
          body: JSON.stringify({
            task: editedTask,
          }),
        });

        if (!response.ok) {
          const error = await response.json()
          console.log(error)
          throw new Error(`Failed to log in: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)

        dispatch(
          editTask({
            id: taskId,
            task: editedTask,
            description: data.description,
            isDone: data.isDone,
            isEdited: data.isEdited
          })
        );

      } catch (error) {
        console.error("Error during login:", error);
      }
      setEdit(null)
      setEditedTask("")
    } else {
      setEdit(taskId)
    }
  }

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTasks((prevSelectedTasks) => prevSelectedTasks.includes(taskId) ?
      prevSelectedTasks.filter((id) => id !== taskId) : [...prevSelectedTasks, taskId]
    );
  };

  const deleteMany = async () => {
    try {
      for (const id of selectedTasks) {
        const response = await fetch(`${api}/task/${id}/delete`, {
          method: "Delete",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cookies.token}`

          },
        });

        if (!response.ok) {
          const error = await response.json()
          console.log(error)
          throw new Error(`Failed to log in: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)

        dispatch(
          deleteTask(id)
        )
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  return (
    isAdmin ? (
      <PageContainer title="Dashboard" description="this is Dashboard">
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <ProfitExpenses />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TrafficDistribution />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </PageContainer>
    ) : (
      <PageContainer title="Sample Page" description="This is Sample Page">
        <DashboardCard title="Sample Page">
          <Button onClick={() => setAdd(true)} color='primary'
            variant="contained"
            size="large">Add task</Button>
          {add && (
            <Container>
              <Stack>
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="username"
                    mb="5px"
                  >
                    Title
                  </Typography>
                  <CustomTextField variant="outlined" fullWidth name="task" value={values.task}
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
                    Description
                  </Typography>
                  <CustomTextField variant="outlined" fullWidth name="description" value={values.description}
                    onChange={changeValues} />
                </Box>
              </Stack>
              <Box mt="20px" display="flex" justifyContent="space-between">
                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ marginRight: "10px" }}
                  onClick={addTaskk}
                >
                  Add
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ marginLeft: "10px" }}
                  onClick={() => setAdd(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Container>
          )}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '20px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
          }}>
            <Typography variant="h6">Tasks List</Typography>
            {selectedTasks.length > 0 && (
              <Button sx={{
                backgroundColor: '#007bff',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#0056b3',
                },
                padding: '8px 16px',
              }} onClick={deleteMany}>Delete selected tasks</Button>
            )}
          </Box>
          <Container>
            {tasks && tasks.map(tas => (
              <Box
                key={tas.id}
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: isTaskChecked(tas.id) ? '#e0f7fa' : '#fff', // Color change based on tas state
                }}
              >
                {/* Left section with tas name and checkboxes */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={isTaskChecked(tas.id)}
                    onChange={() => handleCheckboxChange(tas.id, isTaskChecked(tas.id))}
                    color="primary"
                    sx={{ marginRight: '8px' }}
                  />
                  {edit === tas.id ? (
                    <CustomTextField name="editedTask" value={editedTask} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedTask(e.target.value)} />
                  ) : (
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                      {tas.task}
                    </Typography>
                  )}
                </Box>

                {/* Trash icon for deletion */}
                <Box>
                  {edit === tas.id && (
                    <IconButton
                      onClick={() => setEdit(null)}
                      color="primary"
                      aria-label="edit task"
                      sx={{ marginRight: '8px' }}
                    >
                      <Close />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() => handleEditClick(tas.id)}
                    color="primary"
                    aria-label="edit task"
                    sx={{ marginRight: '8px' }}
                  >
                    {edit === tas.id ? (<Check />) : (<Edit />)}
                  </IconButton>
                  <Checkbox
                    checked={selectedTasks.includes(tas.id)}
                    onChange={() => toggleTaskSelection(tas.id)}
                    color="secondary"
                    sx={{ marginRight: '16px' }}
                  />
                  <IconButton
                    onClick={() => handleDelete(tas.id)}
                    color="error"
                    aria-label="delete task"
                  >
                    <Delete />
                  </IconButton>
                </Box>

              </Box>
            ))}
          </Container>
        </DashboardCard>
      </PageContainer>

    )
  )
}

export default Dashboard;
