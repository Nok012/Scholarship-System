import React, { useEffect, useState } from 'react'
import { StudentInterface } from "../interfaces/IStudent";
import Typography from '@mui/material/Typography';
import {  Box, Container, CssBaseline, Snackbar, Stack } from '@mui/material';
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import {
    GetStudentByUID,
} from "../services/HttpClientServiceUser";
import { useNavigate } from 'react-router-dom';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Student() {

    const [student, setStudent] = useState<StudentInterface>();

    useEffect(() => {
        getStydentByUid();
    }, []);

    const getStydentByUid = async () => {
        let res = await GetStudentByUID();
        if (res) {
            setStudent(res);
        }
    };

    const navigator = useNavigate()
    if ((student?.Money == 0)) {
        setTimeout(() => {
            navigator("/StudentCreate")
        }, 2000);
    }


    const alertFunction = () => {
        return (
            <Snackbar
                open={true}
                autoHideDuration={3000}

                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="error">
                    ไม่พบประวัติของคุณ
                </Alert>
            </Snackbar>

        )
    }


    const UI = () => {
        return (
            <div>
                <Stack spacing={2}>
                    <Typography>ชื่อ-สกุล:  {student?.Name}</Typography>
                    <Typography>รหัสประจำตัวประชาชน:  {student?.Personalid}</Typography>
                    <Typography>Email:  {student?.User?.Email}</Typography>
                    <Typography>รายได้ผู้ปกครองต่อ/ปี:  {student?.Money}</Typography>
                    <Typography>เบอร์โทร:  {student?.Phon}</Typography>
                    <Typography>GPAX:  {student?.Gpax}</Typography>
                    <Typography>สำนักวิชา(สาขา):  {student?.Faculty?.ThaiName}</Typography>
                    <Typography>ปีการศึกษา:  {student?.Year?.Number}</Typography>
                    <Typography>อาจารย์ที่ปรึกษา:  {student?.Advisor?.ThaiName}</Typography>
                </Stack>
            </div>
        )
    }


    const test = () => {
        console.log(student?.User?.Email)
    }

    return (
        <div>
            <Container     component="main"
                   maxWidth="md"
                   sx={{ mt:5, 
                         mb:2,
                         p:2, 
                         boxShadow: 3,
                         bgcolor: '#E3E3E3'
                        }}>
            <CssBaseline />
                <Box  sx={{p:0, m:0, mb:5 }}>
                    
                    <Typography variant="h5" color="secondary" sx={{fontWeight: 'bold'}}> ประวัตินักศึกษา </Typography>            
                
                </Box>     
                {(student?.Money == 0) ? alertFunction() : UI()}
            </Container>

        </div>
    )
}

export default Student