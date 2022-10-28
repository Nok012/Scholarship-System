import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { TypeFundInterface } from "../interfaces/ITypeFund";
import { OrganizationInterface } from "../interfaces/IOrganization";
import { DonatorInterface } from "../interfaces/IDonator";


import{ 
    GetOrganization,
    GetTypeFunds,
    Donator,  
} from "../services/HttpClientServerAmin"

import { Snackbar } from "@mui/material";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DonatorCreate() {

    const [typefunds, setTypeFund] = useState<TypeFundInterface[]>([]);
    const [organizations, setOrganization] = useState<OrganizationInterface[]>([]);
    const [donator, setDonator] = useState<DonatorInterface>({
      UserName: "",
      DateTime: "",
      UserNotes: "",
      UserInfo: "",
      Amount:   0,
      NameFund: "",
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    )   => {
        if (reason === "clickaway") {
          return;
        }
        setSuccess(false);
        setError(false);
      };
    
      const handleChange = (event: SelectChangeEvent) => {
        const name = event.target.name as keyof typeof donator;
        setDonator({
          ...donator,
          [name]: event.target.value,
        });
      };

     


    const getTypeFund = async () => {
        let res = await GetTypeFunds();
        if (res) {
          setTypeFund(res);
        }
    };
    const getOrganization = async () => {
        let res = await GetOrganization();
        if (res) {
          setOrganization(res);
        }
    };

    useEffect(() => {
        getOrganization();
        getTypeFund();
    }, []);

    const convertType = (data: string | number | undefined) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
      };

    async function submit() {
        let data = {
          AdminID: convertType(1),
          TypeFundID: convertType(donator.TypeFundID),
          OrganizationID: convertType(donator.OrganizationID),
          UserName: donator.UserName,
          DateTime: donator.DateTime,
          UserInfo: donator.UserInfo,
          UserNote: donator.UserNotes,
          Amount: typeof donator.Amount == "string" ? parseInt(donator.Amount) : 0,
          NameFund: donator.NameFund,
        };

        console.log(data);
    
        let res = await Donator(data);
        if (res) {
          setSuccess(true);
        } else {
          setError(true);
        }
      }

    const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name as keyof typeof donator;
        setDonator({
          ...donator,
          [name]: event.target.value,
        });
    };
  
    return (


    <div><CssBaseline />
    <Container maxWidth="lg">

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
        display = 'flex'
          sx={{
            marginTop : '50px',
            paddingX : 2 ,
            paddingY : 2 ,
          }}
        >
        <h1>ตารางกรอกข้อมูลและบันทึกข้อมูล</h1> 
        </Box>
      </Paper>
      
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1} sx = {{pading:2}}>

          <Grid item xs={6}>
            <p>ชื่อ-นามสกุล</p>
            <TextField
              fullWidth 
              id="donator_name"
              type="string"
              variant="outlined" 
              onChange={handleChangeTextField}
              inputProps={{
                            name: "UserName",
              }}
            //   onChange = {(name) => setDonator_name(name.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <p>สังกัด</p>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <Select
                    native
                    value={donator.OrganizationID + ""}
                    onChange = {handleChange}
                    inputProps ={{
                        name:"OrganizationID"
                    }}
                    
                >
                    <option aria-label="None" value="">
                        โปรดเลือกประเภททุน
                    </option>
                        {organizations.map((item: OrganizationInterface) => (
                    <option value={item.ID} key={item.ID}>
                        {item.Organization}
                    </option>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={4}>
          <p>ประเภททุนที่บริจาค</p>
          <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <Select
                    native
                    value={donator.TypeFundID + ""}
                    onChange = {handleChange}
                    inputProps ={{
                        name:"TypeFundID"
                    }}
                    
                >
                    <option aria-label="None" value="">
                        โปรดเลือกประเภททุน
                    </option>
                        {typefunds.map((item: TypeFundInterface) => (
                    <option value={item.ID} key={item.ID}>
                        {item.TypeFund}
                    </option>
                    ))}
                </Select>
              </FormControl>
            </Box>

          </Grid>

          <Grid item xs={4}>
            <p>ชื่อทุน</p>
              <TextField
                fullWidth 
                id="type_name"
                type="string"
                variant="outlined" 
                onChange={handleChangeTextField}
                inputProps={{
                            name: "NameFund",
                }}
                // onChange= {(typeName) => setTypeName(typeName.target.value)}
                />
          </Grid>

          <Grid item xs={4}>
            <p>จำนวน</p>
              <TextField
                fullWidth 
                id="amount"
                type="string"
                variant="outlined"
                onChange={handleChangeTextField}
                inputProps={{
                            name: "Amount",
                }}
                // onChange={(am) => setAmount(am.target.value)} 
              />
          </Grid>

          <Grid item xs={4}>
            <p>ข้อมูลติดต่อกลับ</p>
              <TextField
                fullWidth 
                id="donator_info"
                type="string"
                variant="outlined"
                onChange={handleChangeTextField}
                inputProps={{
                            name: "UserInfo",
                }}
                // onChange={(info) => setDonator_info(info.target.value)}
                />
          </Grid>

          <Grid item xs={4}>
            <p>หมายเหตุ</p>
              <TextField
                fullWidth 
                id="donator_note"
                type="string"
                variant="outlined"
                onChange={handleChangeTextField}
                inputProps={{
                            name: "UserNotes",
                }}
                // onChange={(note) => setDonator_note(note.target.value)}
                />
          </Grid>

          <Grid item xs={4}>
            <p>วันที่และเวลา</p>
              <TextField
                fullWidth 
                id="datetime"
                type="string"
                label="ex2022-01-17-12:30am"
                variant="outlined"
                onChange={handleChangeTextField}
                inputProps={{
                            name: "DateTime",
                }} 
                // onChange={(dt) => setDatetime(dt.target.value)}
                />
          </Grid>
          
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color='info' 
              sx={{float: "right"}}  
              onClick={submit} 
            >
              บันทึกข้อมูล
            </Button>
          </Grid>

        </Grid>

      </Box>
    </Container>

    </div>
  )
}