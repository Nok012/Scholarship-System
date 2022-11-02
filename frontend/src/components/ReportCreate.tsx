import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { ReportInterface } from "../interfaces/IReport";
import { ReasonInterface } from "../interfaces/IReason";
import { ScholarshipInterface } from "../interfaces/IScholarship";
import { StudentInterface } from "../interfaces/IStudent";

import {
  GetReason,
  GetScholarships,
  GetStudentByUID,
  CreateReport,
} from "../services/HttpClientServiceUser";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ReportCreate() {

  const [reasons, setReasons] = useState<ReasonInterface[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipInterface[]>([]);
  const [student, setStudent] = useState<StudentInterface>();
  const [report, setReport] = useState<ReportInterface>({
    ReasonInfo: "",
  });

 

  const getStudent = async () => {
    let res = await GetStudentByUID();
    
    if (res) {
      setStudent(res);
      localStorage.setItem("sid", res.ID)
    }
  };

  const getScholarships = async () => {
    let res = await GetScholarships();
    if (res) {
      setScholarships(res);
    }
  };

  const getReasons = async () => {
    let res = await GetReason();
    if (res) {
      setReasons(res);
    }
  };


  useEffect(() => {
    getStudent();
    getScholarships();
    getReasons();
  }, [])

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);

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
    const name = event.target.name as keyof typeof report;
    setReport({
      ...report,
      [name]: event.target.value,
    });
  };

  const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof typeof report;
    setReport({
      ...report,
      [name]: event.target.value,
    });
  };

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  async function submit() {
    let data = {
      ScholarshipID: convertType(report.ScholarshipID),
      ReasonID: convertType(report.ReasonID),
      StudentID: student?.ID,
      ReasonInfo: report.ReasonInfo,
    }
    console.log(data)

    let res = await CreateReport(data);
    if (res) {
      setSuccess(true);
    } else {
      setError(true);
    }
  }


  return (
    <Container maxWidth="md">
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success">
          บันทึกข้อมูลสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          บันทึกข้อมูลไม่สำเร็จ
        </Alert>
      </Snackbar>
      <Paper>
        <Box
          display="flex"
          sx={{
            marginTop: 2,
          }}
        >
          <Box sx={{ paddingX: 2, paddingY: 1 }}>
            <Typography
              component="h2"
              variant="h6"
              color="secondary"
              gutterBottom
            >
              ขอทุนการศึกษา
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} sx={{ padding: 2 }}>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <p>ทุนการศึกษา</p>
              <Select
                id="scholarship"
                native
                value={report.ScholarshipID + ""}
                onChange={handleChange}
                inputProps={{
                  name: "ScholarshipID",
                }}
              >
                {<option aria-label="None" >---เลือกทุนการศึกษา---</option>}
                {scholarships.map((item: ScholarshipInterface) => (
                  <option key={item.ID} value={`${item.ID}`}>{item.ScholarName}</option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <p>เหตุผลที่ใช้ขอทุน</p>
              <Select
                id="reason"
                native
                value={report.ReasonID + ""}
                onChange={handleChange}
                inputProps={{
                  name: "ReasonID",
                }}
              >
                <option aria-label="None">---เลือกเหตุในการขอทุน---</option>
                {reasons.map((item: ReasonInterface) => (
                  <option key={item.ID} value={`${item.ID}`}>{item.Name}</option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <p>รายละเอียดประกอบการขอทุน</p>
              <TextField
                id="ReasonInfo"
                multiline
                rows={4}
                onChange={handleChangeTextField}
                inputProps={{
                  name: "ReasonInfo",
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <p>Name</p>
            <FormControl fullWidth variant="filled" disabled>
              <TextField
                id="Name"
                variant="filled"
                size="medium"
                color="primary"
                value={student?.Name}
                disabled
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="filled" disabled>
              <p>Personal ID</p>
              <TextField
                id="PersonalID"
                variant="filled"
                type="string"
                size="medium"
                value={student?.Personalid}
                disabled
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="filled" disabled>
              <p>Email</p>
              <TextField
                id="Email"
                variant="filled"
                type="string"
                size="medium"
                value={student?.User?.Email}
                disabled
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="filled" disabled>
              <p>GPAX</p>
              <TextField
                id="Gpa"
                variant="filled"
                type="string"
                size="medium"
                value={student?.Gpax}
                disabled
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="filled" disabled>
              <p>Faculty</p>
              <TextField
                id="Faculty"
                variant="filled"
                type="string"
                size="medium"
                value={student?.Faculty?.ThaiName}
                disabled
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/ScholarHistory"
              variant="contained"
              color="secondary"
            >
              Back
            </Button>
            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="secondary"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default ReportCreate;