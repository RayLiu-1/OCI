import React, {useState} from 'react';
import { useQuill } from 'react-quilljs';
import { Button } from '@material-ui/core';

import 'quill/dist/quill.snow.css';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const EditorCt = styled.div`
  width: 800px;
  height: 300px;
  & .ql-container {
      height: calc(100% - 50px)
  }
`
const useStyles = makeStyles((theme) => ({
    subject: {
        width: '100%',
        marginBottom: theme.spacing(2)
    }
}))

function EmailPreview(props) {
    const { row } = props
    const classes = useStyles();
    const [ready, setReady] = useState(false)
    const [subjectState, setsubjectState] = useState("")
    const [templateState, setTemplateState]  = useState()
    const { quill, quillRef } = useQuill({
        "theme": "snow",
        "modules": {
            "toolbar": false
        }
      });

    React.useEffect(() => {
        async function fetchData() {
            const response = await fetch('http://localhost:8888/api/emailtemplate')
            const {subject, emailtemplate} = await response.json()
            setsubjectState(subject || subject)
            setReady(true)
            setTemplateState(emailtemplate)
        }
        fetchData();
    }, [])

    React.useEffect(() => {
        if (quill) {
            quill.disable()
        }
        if (quill && templateState) {
            const {ops} = JSON.parse(templateState)
            quill.setContents(ops)
            let emailHtml = quill.root.innerHTML
            emailHtml = emailHtml.replace("[ First Name ]", row.Talent_Name)
            console.log(emailHtml)
            if (row.jobs.length < 5) {
                emailHtml = emailHtml.replace(/<p>5..*?<\/p>/, "")
            }
            if (row.jobs.length < 4) {
                emailHtml = emailHtml.replace(/<p>4..*?<\/p>/, "")
            }

            row.jobs.forEach(job => {
                emailHtml = emailHtml.replace("[Job Name]", job["Job Name"])
                emailHtml = emailHtml.replace("[Company]", job["Company"])
                emailHtml = emailHtml.replace("[Location]", job["Location"])
                emailHtml = emailHtml.replace("[URL]", `<a href="${job["JobURL"]}"> Job URL </a>` )
            })

            quill.clipboard.dangerouslyPasteHTML(emailHtml)
        }
        
    }, [quill, templateState]);

    return (
        <div>
            <React.Fragment>
                <div hidden={!ready}>
                    <TextField value={subjectState} onChange={(event) => setsubjectState(event.target.value)} className={classes.subject} label="Subject" variant="outlined" />
                    <EditorCt>
                        <div ref={quillRef} />
                    </EditorCt>
                    <Button variant="contained" color="primary"> Send </Button>
                </div>
                <div hidden={ready}>
                    <CircularProgress />
                </div>
            </React.Fragment>
        </div>
    )
} 

export default React.forwardRef((props, ref) => <EmailPreview {...props} />);