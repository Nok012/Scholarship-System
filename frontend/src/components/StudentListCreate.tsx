import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { ReportInterface } from "../interfaces/IReport";
import { StatusInterface } from "../interfaces/IStatus";
import { StudentListInterface } from "../interfaces/IStudentlist";

import {
  GetReports,
  GetStatus,
  StudentLists,
} from "../services/HttpClientServerAmin";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function StudentListCreate() {
  const [reports, setReports] = useState<ReportInterface[]>([]);
  const [statuses, setStatuses] = useState<StatusInterface[]>([]);
  const [studentList, setStudentList] = useState<StudentListInterface>({
    SaveTime: new Date(), Reason: "", Amount: 0,
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

  const handleChange = (event: SelectChangeEvent) => {
    const name = event.target.name as keyof typeof studentList;
    setStudentList({
      ...studentList,
    
      [name]: event.target.value,
    });
  };

  const getReports = async () => {
    let res = await GetReports();
    if (res) {
      setReports(res);
    }
  };

  const getStatuses = async () => {
    let res = await GetStatus();
    if (res) {
      setStatuses(res);
    }
  };

  const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof typeof studentList;
    setStudentList({
      ...studentList,
      [name]: event.target.value,
    });
  }
  useEffect(() => {
    getReports();
    getStatuses();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  async function submit() {
    let aid = localStorage.getItem("aid");
    let data = {      
      ReportID: convertType(studentList.ReportID),
      StatusID: convertType(studentList.StatusID),
      SaveTime: studentList.SaveTime,
      AdminID: typeof aid == "string" ? parseInt(aid) : 0,
      Reason : studentList.Reason,
      Amount : typeof studentList.Amount == "string" ? parseInt(studentList.Amount) : 0 
    };

    console.log(data)
    let res = await StudentLists(data);
    if (res) {
      console.log(res);
      setSuccess(true);
    } else {
      setError(true);
    }
  }
  return (
    <Container maxWidth="md">
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
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="error">
          บันทึกข้อมูลไม่สำเร็จ
        </Alert>
      </Snackbar>
      
      <Paper>
        <Box
          display="flex"
          sx={{
            mt: 2,
          }}
        >
          <Box sx={{ paddingX: 2, paddingY: 1 }}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              คัดเลือกนักศึกษาทุน
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={1} sx={{ padding: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <p>รายชื่อนักศึกษาขอทุน</p>
              <Select
                native
                value={studentList.ReportID + ""}
                onChange={handleChange}
                inputProps={{
                  name: "ReportID",
                }}
              >
                <option aria-label="None" value="">
                  นักศึกษาที่ขอทุน
                </option>
                {reports.map((item: ReportInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Student?.Name} ( {item.Scholarship?.ScholarName} )
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>          
          <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
              <p>สถานะ</p>
              <Select
                native
                value={studentList.StatusID + ""}
                onChange={handleChange}
                inputProps={{
                  name: "StatusID",
                }}
              >
                <option aria-label="None" value="">
                  การพิจารณา
                </option>
                {statuses.map((item: StatusInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Status}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}></Grid>
          </Grid>

          <Grid item xs={6} sx= {{p:2}}>
            <FormControl fullWidth variant="outlined">
              <p>วันที่และเวลา</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={studentList.SaveTime}
                  onChange={(newValue) => {
                    setStudentList({
                      ...studentList,
                      SaveTime: newValue,
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item xs={10} >
          </Grid>
          <Grid item xs={12} sx= {{p:2}}>
          <Typography className='StyledTypography'> เหตุผล </Typography>
                    <TextField  className='StyledTextField' 
                                id="Name" 
                                variant="outlined" 
                                size="small" 
                                color="primary"  
                                fullWidth
                                onChange={handleChangeTextField}
                                inputProps={{
                                   name: "Reason",
                                }}
                    />
                    </Grid>

                    <Grid item xs={6} sx= {{p:2}}>
                    <Typography className='StyledTypography'> เงินทุน </Typography>
                    <TextField  className='StyledTextField' 
                                id="Amount" 
                                variant="outlined" 
                                size="small" 
                                color="primary"  
                                fullWidth
                                onChange={handleChangeTextField}
                                inputProps={{
                                   name: "Amount",
                                }}
                    />   
                    </Grid>                 
          <Grid item xs={4} >
            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="primary"
            >
              SAVE
            </Button>
          </Grid>
      </Paper>
    </Container>
  );

    }  

export default StudentListCreate