import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
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

import { StudentListInterface } from "../interfaces/IStudentlist";
import { PaymentstatusInterface } from "../interfaces/IPaymentstatus";
import { BankingInterface } from "../interfaces/IBanking";
import { SliplistInterface } from "../interfaces/ISliplist";
import { AdminsInterface } from "../interfaces/IAdmin";
import { GetReports } from "../services/HttpClientServerAmin";
import { ReportInterface } from "../interfaces/IReport";

import {
  GetAdminsByAID,
  GetBanking,
  GetStudentList,
  GetPaymentStatus,
  Sliplist,
} from "../services/HttpClientServerAmin";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SliplistCreate() {

  const [admin, setAdmin] = useState<AdminsInterface>();
  const [bankings, setBankings] = useState<BankingInterface[]>([]);
  const [studentlists, setStudentlists] = useState<StudentListInterface[]>([]);
  const [reports, setReports] = useState<ReportInterface[]>([]);
  const [paymentstatuses, setPaymentstatus] = useState<PaymentstatusInterface[]>([]);

  const [slipList, setSliplist] = useState<SliplistInterface>({
    Slipdate: new Date(), Total: 0.0,

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
    const name = event.target.name as keyof typeof slipList;
    setSliplist({
      ...slipList,
      [name]: event.target.value,
    });
    console.log(slipList)
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof SliplistCreate;
    const { value } = event.target;
    setSliplist({ ...slipList, [id]: value });

  }

  const getAmin = async () => {
    let res = await GetAdminsByAID();
    console.log(res);
    if (res) {
      setAdmin(res);
    }
  };

  const getBanking = async () => {
    let res = await GetBanking();
    if (res) {
      setBankings(res);
    }
  };

  const getStudentList = async () => {
    let res = await GetStudentList();
    if (res) {
      setStudentlists(res);
    }
  };


  const getReport = async () => {
    let res = await GetReports();
    if (res) {
      setReports(res);
    }
  };

  const getPaymentStatus = async () => {
    let res = await GetPaymentStatus();
    slipList.PayID = res.ID;
    if (res) {
      setPaymentstatus(res);
    }
  };

  useEffect(() => {
    getAmin();
    getBanking();
    getStudentList();
    getPaymentStatus();

    getReport();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  async function submit() {
    console.log(admin?.ID);
    let data = {
      StudentListID: convertType(slipList.StudentListID),
      PayID: convertType(slipList.PayID),
      BankingID: convertType(slipList.BankingID),
      AdminID: admin?.ID,
      Slipdate: slipList.Slipdate,
      Total: typeof slipList.Total == "string" ? parseFloat(slipList.Total) : 0.0
    };
    console.log(typeof (data.Total));

    let res = await Sliplist(data);
    if (res) {
      setSuccess(true);
    } else {
      setError(true);
    }
  }

  return (
    <Container maxWidth="md" >
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success">
          บันทึกสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="error">
          บันทึกผิดพลาด
        </Alert>
      </Snackbar>
      <Paper>
        <Box
          display="flex"
          sx={{
            marginTop: 2,
          }}
        >
          <Box sx={{ paddingX: 4, paddingY: 1 }}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              บันทึกข้อมูลธุรกรรมการเงินทุนการศึกษา
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={8}>
            <FormControl fullWidth variant="outlined">
              <p>บัญชีธนาคาร</p>
              <Select
                native
                value={slipList.BankingID + ""}
                onChange={handleChange}
                inputProps={{
                  name: "BankingID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกบัญชีธนาคาร
                </option>
                {bankings.map((item: BankingInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8}>
            <FormControl fullWidth variant="outlined">
              <p>นักศึกษาที่ถูกคัดเลือก</p>
              <Select
                native
                value={slipList.StudentListID + ""}
                onChange={handleChange}
                inputProps={{
                  name: "StudentListID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกนักศึกษาที่ถูกคัดเลือก
                </option>
                {studentlists.map((item: StudentListInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.ID}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8}>
            <FormControl fullWidth variant="outlined">
              <p>สถานะการโอนเงินทุนการศึกษา</p>
              <Select
                native
                value={slipList.PayID + ""}
                onChange={handleChange}
                inputProps={{
                  name: "PayID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกสถานะการโอนเงินทุนการศึกษา
                </option>
                {paymentstatuses.map((item: PaymentstatusInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <p>จำนวนเงิน</p>
            <TextField
              fullWidth
              id="Total"
              type="string"
              variant="outlined"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>วันที่และเวลา</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={slipList.Slipdate}
                  onChange={(newValue) => {
                    setSliplist({
                      ...slipList,
                      Slipdate: newValue,
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/sliplist"
              variant="outlined"
              color="primary"
            >
              Back
            </Button>
            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default SliplistCreate;