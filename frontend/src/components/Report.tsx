import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { ReportInterface } from "../interfaces/IReport";

import { 
  GetStudentByUID, 
  GetReportBySID 
} from "../services/HttpClientServiceUser";

function Report() {
  const [reports, setReports] = useState<ReportInterface[]>([]);


  const getStudentByUid = async () => {
    let res = await GetStudentByUID();   
    if (res) {
      localStorage.setItem("sid", res.ID)
    }
  };

  const getReportBySiD = async () => {
    let res = await GetReportBySID();   
    if (res) {
      setReports(res);
    }
  };

  useEffect(() => {

    getStudentByUid();
    getReportBySiD();

  }, []);

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 60 },

    {
      field: "Student",
      headerName: "ชื่อนักศึกษา",
      width: 150,
      valueFormatter: (params) => params.value.Name,
    },
    
    {
      field: "Scholarship",
      headerName: "ทุนการศึกษา",
      width: 150,
      valueFormatter: (params) => params.value.ScholarName,
    },
    {
      field: "Reason",
      headerName: "เหตุผลที่ใช้ขอทุนกสชาศึกษา",
      width: 150,
      valueFormatter: (params) => params.value.Name,
    },
    {
      field: "ReasonInfo",
      headerName: "รายละเอียดประกอบการขอทุน",
      width: 150,
      valueFormatter: (params) => params.value.ReasonInfo,
    },
  ];

  return (
    <div>
      <Container maxWidth="md">
        <Box
          display="flex"
          sx={{
            marginTop: 2,
          }}
        >
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="secondary"
              gutterBottom
            >
              ข้อมูลการขอทุนการศึกษา
            </Typography>
          </Box>
          <Box>
          </Box>
        </Box>
        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={reports}
            getRowId={(row) => row.ID}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
          <Box style={{display:"flex",justifyContent: "center"}}>
            <Button
              component={RouterLink}
              to="/ReportCreate"
              variant="contained"
              color="secondary"
            >
              ขอทุนการศึกษา
            </Button>
          </Box>
      </Container>
    </div>
  );
}

export default Report;