import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { DataGrid, GridColDef} from '@mui/x-data-grid';
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';


import { ScholarStatusesInterface } from "../interfaces/IScholarStatus";
import { ScholarTypesInterface } from "../interfaces/IScholarType";
import { ScholarshipInterface } from "../interfaces/IScholarship";
import { AdminsInterface } from "../interfaces/IAdmin";

import {
    GetScholarships,
    GetScholarStatuses,
    GetScholarTypes,
    Scholarships,
    GetAdminsByAID,
} from "../services/HttpClientServerAmin";


function ScholarshipCreate() {

    const [scholarships, setScholarships] = useState<ScholarshipInterface[]>([]);


    const getScholarships = async () => {
        let res = await GetScholarships();
        if (res) {
            setScholarships(res);
            console.log(res);
        }
    };



    const columns: GridColDef[] = [
        { field: "ID", headerName: "ID", width: 50 },

        { field: "ScholarName", headerName: "Scholar Name", width: 150 },
        { field: "Admin", headerName: "AminID", width: 150 },

        { field: "ScholarStatusID", headerName: "Scholar StatusID", width: 150 },
        { field: "ScholarTypeID", headerName: "Scholar TypeID", width: 150 },
        { field: "ScholarDetail", headerName: "Scholar Detail", width: 300 },
    ];


    const [admin, setAdmin] = useState<AdminsInterface>();
    const [scholar_statuses, setScholar_statuses] = useState<ScholarStatusesInterface[]>([]);
    const [scholar_types, setScholar_types] = useState<ScholarTypesInterface[]>([]);
    const [scholarship, setScholarship] = useState<ScholarshipInterface>({
        ScholarName: "",
        ScholarDetail: "",
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
        const name = event.target.name as keyof typeof scholarship;
        setScholarship({
            ...scholarship,
            [name]: event.target.value,
        });
    };

    const getScholarStatuses = async () => {
        let res = await GetScholarStatuses();
        scholarship.ScholarStatusID = res.ID;
        if (res) {
            setScholar_statuses(res);
            
        }
    };

    const getScholarTypes = async () => {
        let res = await GetScholarTypes();
        scholarship.ScholarTypeID = res.ID;
        if (res) {
            setScholar_types(res);
        }
    };

    const getAminByAID = async () => {
        let res = await GetAdminsByAID();
        if (res) {
          setAdmin(res);
          console.log(admin);
        }
      };
    useEffect(() => {
        getAminByAID();
        getScholarStatuses();
        getScholarTypes();
        getScholarships();
    }, []);

    const convertType = (data: string | number | undefined) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
    };
    async function submit() {
        let data = {
            ScholarName: scholarship.ScholarName,
            AdminID: admin?.ID,
            ScholarStatusID: convertType(scholarship.ScholarStatusID),
            ScholarTypeID: convertType(scholarship.ScholarTypeID),
            ScholarDetail: scholarship.ScholarDetail,
        };
        console.log(data);
        let res = await Scholarships(data);
        if (res) {
            setSuccess(true);
        } else {
            setError(true);
        }
    }

    const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name as keyof typeof scholarship;
        setScholarship({
            ...scholarship,
            [name]: event.target.value,
        });

    };

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>



            </Box>
            <Container maxWidth="lg">
                {/* <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', width: '190vh' }} /> */}
                <Paper >
                    <Box
                        display={"flex"}
                        sx={{
                            marginTop: 2,
                            paddingX: 2,
                            paddingY: 4,
                        }}
                    >
                        <h2>Manage Scholarship</h2>
                    </Box>
                    <hr />
                    <Grid container spacing={0}>
                        <Grid xs={3}>
                            <TextField fullWidth id="scholar_name" type="string" label="Scholarship Name" variant="outlined"
                                onChange={handleChangeTextField} inputProps={{
                                    name: "ScholarName",
                                }}
                            />
                            {/* <Item>xs=3</Item> */}
                        </Grid>
                        <Grid xs={3}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="demo-simple-select-label">Scholarship Status</InputLabel>
                                <Select
                                    native

                                    value={scholarship.ScholarStatusID + ""}
                                    onChange={handleChange}
                                    inputProps={{
                                        name: "ScholarStatusID",
                                    }}
                                >
                                    <option aria-label="None" value="">

                                    </option>
                                    {scholar_statuses.map((item: ScholarStatusesInterface) => (
                                        <option value={item.ID} key={item.ID}>
                                            {item.StatusName}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* <Item>xs=3</Item> */}
                        </Grid>
                        <Grid xs={3}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="demo-simple-select-label">Scholarship Type</InputLabel>
                                <Select
                                    native
                                    value={scholarship.ScholarTypeID + ""}
                                    onChange={handleChange}
                                    inputProps={{
                                        name: "ScholarTypeID",
                                    }}
                                >
                                    <option aria-label="None" value="">

                                    </option>
                                    {scholar_types.map((item: ScholarTypesInterface) => (
                                        <option value={item.ID} key={item.ID}>
                                            {item.TypeName}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                        </Grid>
                        <Grid xs={3}>
                            <Button sx={{ paddingY: 1.7, }} fullWidth variant="outlined" size="large"
                                onClick={submit}
                            >
                                Update
                            </Button>
                            {/* <Item>xs=3</Item> */}
                        </Grid>
                        <Grid xs={12} sx={{ height: 200, }}>
                            <TextField
                                fullWidth

                                id="scholar_detail"
                                type="string"
                                label="Details"
                                onChange={handleChangeTextField}
                                inputProps={{
                                    name: "ScholarDetail",
                                  }}
                                multiline
                                rows={7}
                                variant="outlined"

                            />
                            {/* <TextField  fullWidth  id="details" label="Details" multiline maxRows={7} variant="outlined" /> */}
                            {/* <Item>xs=12</Item> */}
                        </Grid>
                        <Grid xs={12}>

                            {/* <Item>xs=12</Item> */}
                        </Grid>

                        <Grid xs={4}>
                            
                        </Grid>
                        <Grid xs={5}>

                        </Grid>
                        <Grid xs={3}>
                            <Button sx={{ paddingY: 1.7, }} fullWidth variant="outlined" size="large" onClick={submit}>
                                บันทึกข้อมูล
                            </Button>
                        </Grid>
                    </Grid>

                </Paper >

                <Grid xs={12}>

                </Grid>
                <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
                    <DataGrid
                        rows={scholarships}
                        getRowId={(row) => row.ID}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                    />
                </div>

            </Container>

        </div>

    );
}





export default ScholarshipCreate;