import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SigninInterface } from "../interfaces/ISignin";
import { LoginUser } from "../services/HttpClientServiceUser";
import { LoginAdmin } from "../services/HttpClientServerAmin";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import './SignIn.css';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme();

function SignIn() {
  const [signin, setSignin] = useState<Partial<SigninInterface>>({});
  const [role, setRole] = React.useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorRole, setErrorRole] = useState(true);

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof signin;
    const { value } = event.target;
    setSignin({ ...signin, [id]: value });
  };

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
    setErrorRole(false);
    setRole(event.target.value);
    console.log(typeof(role));

  };

  const submit = async () => {
    localStorage.setItem("role",role);
    let res;

    if (role == "นักศึกษา") {

       res = await LoginUser(signin);

    } else{
       res = await LoginAdmin(signin);
    }

    
    if (res ) {
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setError(true);
    }
  };

  return (
    <ThemeProvider theme={theme} >

      <Grid container component="main" sx={{ height: "100vh" }} style={{ display: "flex", justifyContent: "center" }}>

        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="success">
            เข้าสู่ระบบสำเร็จ
          </Alert>
        </Snackbar>

        <Snackbar
          open={error}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="error">
            อีเมลหรือรหัสผ่านไม่ถูกต้อง
          </Alert>
        </Snackbar>

        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box sx={{ mt: 1 }}>

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Role *</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={role}
                  label="Role *"
                  onChange={handleChange}
                >
                  <MenuItem value={"เจ้าน้าที่"}>เจ้าน้าที่</MenuItem>
                  <MenuItem value={"นักศึกษา"}>นักศึกษา</MenuItem>
                </Select>
              </FormControl>

              <TextField
                margin="normal"
                required
                fullWidth
                id="Email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={signin.Email || ""}
                onChange={handleInputChange}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="Password"
                autoComplete="current-password"
                value={signin.Password || ""}
                onChange={handleInputChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={submit}
                color="secondary"
                disabled={errorRole}
              >
                Sign In
              </Button>

            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SignIn;