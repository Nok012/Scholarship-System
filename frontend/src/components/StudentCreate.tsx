import React, { useEffect, useState } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link as RouterLink } from "react-router-dom";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import FormControl from "@mui/material/FormControl";
import { AdviorsInterface } from "../interfaces/IAdvisor";
import { YearsInterface } from "../interfaces/IYear";
import { FacultiesInterface } from "../interfaces/IFaculty";
import { StudentInterface } from "../interfaces/IStudent";
import { UsersInterface } from "../interfaces/IUser";
import {
        GetYears,
        GetFaculty,
        GetAdvisor,
        CreatStudents,
        GetUserByUID,
} from "../services/HttpClientServiceUser";
import './StudentCreate.css';



const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref
) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function StudentCreate() {


        const [user, setUser] = useState<UsersInterface>();
        const [faculties, setFaculties] = useState<FacultiesInterface[]>([]);
        const [years, setYears] = useState<YearsInterface[]>([]);
        const [advisors, setAdvisors] = useState<AdviorsInterface[]>([]);
        const [student, setStudent] = useState<StudentInterface>({
                Personalid: "",
                Name: "",
                Phon: "",
                Gpax: 0,
                Money: 0,
        });



        const [success, setSuccess] = useState(false);
        const [error, setError] = useState(false);

        const handleClose = (
                event?: React.SyntheticEvent | Event,
                reason?: string
        ) => {
                if (reason === "clickaway") {
                        return;
                }

                setSuccess(false);
                setError(false);
        };

        const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
                const name = event.target.name as keyof typeof student;
                setStudent({
                        ...student,
                        [name]: event.target.value,
                });

        };

        const handleChange = (event: SelectChangeEvent) => {
                const name = event.target.name as keyof typeof student;
                setStudent({
                        ...student,
                        [name]: event.target.value,
                });
                console.log("Student", student.Money);
        };

        const getUserEmail = async () => {
                let res = await GetUserByUID();
                if (res) {
                        setUser(res);
                }
        };

        const getFaculties = async () => {
                let res = await GetFaculty();
                if (res) {
                        setFaculties(res);
                }
        };

        const getYears = async () => {
                let res = await GetYears();
                if (res) {
                        setYears(res);
                }
        };
        const getAdvisors = async () => {
                let res = await GetAdvisor();
                if (res) {
                        setAdvisors(res);
                }
        };

        useEffect(() => {
                getUserEmail();
                getFaculties();
                getYears();
                getAdvisors();
        }, []);

        const convertType = (data: string | number | undefined) => {
                let val = typeof data === "string" ? parseInt(data) : data;
                return val;
        };

        async function submit() {
                let data = {
                        YearID: convertType(student.YearID),
                        FacultyID: convertType(student.FacultyID),
                        AdvisorID: convertType(student.AdvisorID),
                        UserID: user?.ID,
                        Personalid: student.Personalid,
                        Name: student.Name,
                        Phon: student.Phon,
                        Gpax: typeof student.Gpax == "string" ? parseFloat(student.Gpax) : 0.0,
                        Money: typeof student.Money == "string" ? parseInt(student.Money) : 0,
                };
                let res = await CreatStudents(data);
                if (res) {
                        setSuccess(true);
                } else {
                        setError(true);
                }
        }


        return (
                <div>
                        <Container component="main"
                                maxWidth="xl"
                                sx={{
                                        mt: 5,
                                        mb: 2,
                                        p: 2,
                                        boxShadow: 3,
                                        bgcolor: '#E3E3E3'
                                }}>
                                <CssBaseline />
                                <Snackbar
                                        open={success}
                                        autoHideDuration={3000}
                                        onClose={handleClose}
                                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                                >
                                        <Alert onClose={handleClose} severity="success">
                                                บันทึกข้อมูลสำเร็จ
                                        </Alert>
                                </Snackbar>
                                <Snackbar
                                        open={error}
                                        autoHideDuration={3000}
                                        onClose={handleClose}
                                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                                >
                                        <Alert onClose={handleClose} severity="error">
                                                บันทึกข้อมูลไม่สำเร็จ หรือ มีข้อมูลอยู่แล้ว
                                        </Alert>
                                </Snackbar>

                        

                                <Stack 
                                        sx={{ p: 0, m: 0, mb: 5 }} 
                                >
                                        <Typography 
                                                variant="h5" 
                                                color="secondary" 
                                                sx={{ fontWeight: 'bold' }}
                                        > 
                                                ลงทะเบียนข้อมูลนักศึกษา 
                                        </Typography>                                      
                                </Stack>
                                  <Grid container spacing={2} >
                                        <Grid xs={6}>
                                                <Typography className='StyledTypography'> ชื่อ - นามสกุล </Typography>
                                                <TextField className='StyledTextField'
                                                        id="Name"
                                                        variant="outlined"
                                                        size="small"
                                                        color="primary"
                                                        fullWidth
                                                        onChange={handleChangeTextField}
                                                        inputProps={{
                                                                name: "Name",
                                                        }}
                                                />
                                        </Grid>
                                        <Grid xs={6}>
                                                <Typography className='StyledTypography'> Gmail </Typography>
                                                <TextField className='StyledTextField'                                    
                                                        id="Gpax"
                                                        variant="outlined"
                                                        size="small"
                                                        color="primary"
                                                        fullWidth
                                                        value={user?.Email + ""}
                                                        disabled
                                                />
                                        </Grid>
                                        <Grid xs={6}>
                                                <Typography className='StyledTypography'> รายได้ผู้ปกครองต่อ/ปี </Typography>
                                                <TextField className='StyledTextField'
                                                        id="Name"
                                                        variant="outlined"
                                                        size="small"
                                                        color="primary"
                                                        fullWidth
                                                        onChange={handleChangeTextField}
                                                        inputProps={{
                                                                name: "Money",
                                                        }}
                                                />

                                        </Grid>
                                        <Grid xs={6}>
                                                <Typography className='StyledTypography'> เบอร์โทร </Typography>
                                                <TextField className='StyledTextField'
                                                        id="Name"
                                                        variant="outlined"
                                                        size="small"
                                                        color="primary"
                                                        fullWidth
                                                        onChange={handleChangeTextField}
                                                        inputProps={{
                                                                name: "Phon",
                                                        }}
                                                />
                                        </Grid>
                                        <Grid xs={6}>

                                                <Typography className='StyledTypography'> GPAX </Typography>
                                                <TextField className='StyledTextField'
                                                        id="Name"
                                                        variant="outlined"
                                                        size="small"
                                                        color="primary"
                                                        fullWidth
                                                        onChange={handleChangeTextField}
                                                        inputProps={{
                                                                name: "Gpax",
                                                        }}
                                                />
                                        </Grid>
                                        <Grid xs={6}>
                                                <FormControl fullWidth variant="outlined">
                                                        <Typography className='StyledTypography'> สำนักวิชา </Typography>
                                                        <Select
                                                                className='StyledTextField'
                                                                size="small"
                                                                color="primary"
                                                                native
                                                                value={student.FacultyID + ""}
                                                                onChange={handleChange}
                                                                inputProps={{
                                                                        name: "FacultyID",
                                                                }}
                                                        >
                                                                <option aria-label="None" value="">
                                                                        กรุณาเลือกสำนักวิชา
                                                                </option>
                                                                {faculties.map((item: FacultiesInterface) => (
                                                                        <option value={item.ID} key={item.ID}>
                                                                                {item.ThaiName}
                                                                        </option>
                                                                ))}
                                                        </Select>
                                                </FormControl>

                                        </Grid>
                                        <Grid xs={6}>
                                                <FormControl fullWidth variant="outlined">
                                                        <Typography className='StyledTypography'> ปีการศึกษา </Typography>
                                                        <Select
                                                                className='StyledTextField'
                                                                size="small"
                                                                color="primary"
                                                                native
                                                                value={student.YearID + ""}
                                                                onChange={handleChange}
                                                                inputProps={{
                                                                        name: "YearID",
                                                                }}
                                                        >
                                                                <option aria-label="None" value="">
                                                                        กรุณาเลือกปีการศึกษา
                                                                </option>
                                                                {years.map((item: YearsInterface) => (
                                                                        <option value={item.ID} key={item.ID}>
                                                                                {item.Number}
                                                                        </option>
                                                                ))}
                                                        </Select>
                                                </FormControl>
                                        </Grid>
                                        <Grid xs={6}>
                                                <FormControl fullWidth variant="outlined">
                                                        <Typography className='StyledTypography'> อาจารย์ที่ปรึกษา </Typography>
                                                        <Select
                                                                className='StyledTextField'
                                                                size="small"
                                                                color="primary"
                                                                native
                                                                value={student.AdvisorID + ""}
                                                                onChange={handleChange}
                                                                inputProps={{
                                                                        name: "AdvisorID",
                                                                }}
                                                        >
                                                                <option aria-label="None" value="">
                                                                        กรุณาเลือกอาจารย์ที่ปรึกษา
                                                                </option>
                                                                {advisors.map((item: AdviorsInterface) => (
                                                                        <option value={item.ID} key={item.ID}>
                                                                                {item.ThaiName}
                                                                        </option>
                                                                ))}
                                                        </Select>
                                                </FormControl>
                                        </Grid>
                                        <Grid xs={6}>
                                                <Typography className='StyledTypography'> รหัสประจำตัวประชาชน </Typography>
                                                <TextField className='StyledTextField'
                                                        id="Name"
                                                        variant="outlined"
                                                        size="small"
                                                        color="primary"
                                                        fullWidth
                                                        onChange={handleChangeTextField}
                                                        inputProps={{
                                                                name: "Personalid",
                                                        }}
                                                />
                                        </Grid>
                                </Grid>
                                <Stack
                                        spacing={2}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="flex-start"
                                        sx={{ mt: 3 }}
                                >

                                        <Button 
                                                variant="contained" 
                                                color="secondary" 
                                                component={RouterLink} 
                                                to="/" 
                                        > 
                                                ถอยกลับ
                                        </Button>

                                        <Button variant="contained" color="secondary" onClick={submit}> บันทึกข้อมูล </Button>

                                </Stack>
                        </Container>
                </div>
        )
}
