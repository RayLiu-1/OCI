import './App.css';
import React, {useState} from 'react';
import { Container, Button, Link, Modal} from '@material-ui/core';
import TablePagination from '@material-ui/core/TablePagination';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import EmailTemplate from './EmailTemplate';
import EmailPreview from './EmailPreview';

const Title = styled.h1`
  text-align: center;
`
const JobCell = styled.div`
  width: 100px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`
const ButtonGroups = styled.div`
  display:  flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`

const useStyles = makeStyles((theme) => ({
  link: {
    cursor: "pointer"
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
})
);

// ["Talent", "Email","Location","Seniority","TechStack","IOM","Job1","Job2","Job3","Job4","Job5","LinkedURL","Preview"]
const COLUMNS = [
  {
    field: 'Talent_Name',
    headerName: 'Talent',
  },{
    field: 'Email',
    headerName: 'Email',
  },{
    field: 'Location',
    headerName: 'Location',
  },{
    field: 'Seniority',
    headerName: 'Seniority',
  },{
    field: 'TechStack',
    headerName: 'Tech Stack',
  },{
    field: 'IOM',
    headerName: 'IOM',
  },{
    field: 'job1',
    headerName: 'Job1',
  },{
    field: 'job2',
    headerName: 'Job2',
  },{
    field: 'job3',
    headerName: 'Job3',
  },{
    field: 'job4',
    headerName: 'Job4',
  },{
    field: 'job5',
    headerName: 'Job5',
  }
]


function App() {
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [openTemplate, setOpenTemplate] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewRow, setPreviewRow] = useState();

  const talentImport = () => {
    document.getElementById('talent_input').click()
  }

  const jdImport = () => {
    document.getElementById('jd_input').click()
  }

  const fileUploader = (url) => {
    return async (event) => {
      const file = event.target.files[0]
      const data = new FormData()
      data.append('file', file)
      try {
        let response = await fetch('http://localhost:8888/api/' + url, {
          method: 'PUT',
          body: data
        })
        event.target.value = ''
      } catch(err) {
        alert(err)
      }
    }
  }

  const loadData = async () => {
    try {
      const response = await fetch("http://localhost:8888/api/loaddata")
      const rowData = await response.json()
      const talentDict =  rowData.reduce((accumulator, currentValue) => {
        const talent_id = currentValue.talent_id
        if(accumulator[talent_id]) {
          
          accumulator[talent_id].jobs.push({
            "Job Name": currentValue["Job Name"],
            Company: currentValue.Company,
            Location: currentValue.Location,
            JobURL: currentValue.JobURL
          }) 
        } else {
          accumulator[talent_id] = currentValue
          accumulator[talent_id].jobs = [{
            "Job Name": currentValue["Job Name"],
            Company: currentValue.Company,
            Location: currentValue.Location,
            JobURL: currentValue.JobURL
          }]
        }
        return accumulator
      } ,{})

      const talentData = Object.values(talentDict).filter(row => row.jobs.length > 2).map(row => {
        row.job1 = row.jobs[0].JobURL
        row.job2 = row.jobs[1].JobURL
        row.job3 = row.jobs[2].JobURL
        row.job4 = row.jobs[3]?.JobURL
        row.job5 = row.jobs[4]?.JobURL
        row.id = row.talent_id
        return row
      })
      setData(talentData)
    } catch(err) {
      alert(err)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emailTemplateTrigger = () => {
    setOpenTemplate(true)
  }

  const handlePreview = (event) => {
    setPreviewRow(JSON.parse(event.target.dataset.row))
    setOpenPreview(true)
  }

  const handleCloseModal = () => {
    setOpenTemplate(false)
    setOpenPreview(false)
  }

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Title>
            OCInsights Automated Newsletter System
        </Title>

        <ButtonGroups>
          <Button onClick={talentImport} variant="contained" color="primary"> Talents Import </Button>
          <Button onClick={jdImport} variant="contained" color="primary"> JD Import </Button>
          <Button onClick={emailTemplateTrigger} variant="contained" color="primary"> Email Template </Button>
        </ButtonGroups>

        <ButtonGroups>
          <Button onClick={loadData} variant="contained"> Load Data</Button>
        </ButtonGroups>
        <div hidden>
          <input onChange={fileUploader("talent")} type="file" id='talent_input' accept=".xlsx"/>
          <input onChange={fileUploader("jd")} type="file" id='jd_input' accept=".xlsx"/>
        </div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                {COLUMNS.map(col => <TableCell key={col.headerName} >{col.headerName}</TableCell>)}
                <TableCell >LinkedIn</TableCell>
                <TableCell >Preview</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page*rowsPerPage, (page + 1)*rowsPerPage).map((row) => (
                <TableRow key={row.id}>
                  {COLUMNS.map(col => {
                    if (col.field.substr(0, 3) == 'job') {
                      return <TableCell key={col.field} ><JobCell><a href={row[col.field]} target="_blank">{row[col.field]}</a></JobCell></TableCell>
                    }
                    return <TableCell key={col.field} >{row[col.field]}</TableCell>
                  })}
                  <TableCell ><JobCell><a href={row.LinkedInURL} target="_blank">{row.LinkedInURL}</a></JobCell></TableCell>
                  <TableCell ><Link underline="always" className={classes.link} data-row={JSON.stringify(row)} onClick={handlePreview}>Preview</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={data.length}
            page={page}
            onChangePage={handleChangePage}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10]}
          />
        </TableContainer>
      <Modal className={classes.modal} open={openTemplate} onClose={handleCloseModal}>
        <div className={classes.paper}>
          <EmailTemplate/>
        </div>
      </Modal>
      <Modal className={classes.modal} open={openPreview} onClose={handleCloseModal}>
        <div className={classes.paper}>
          <EmailPreview row={previewRow}/>
        </div>
      </Modal>
      </Container>
    </React.Fragment>
    )
}

export default App;
