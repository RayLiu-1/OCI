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

function EmailTemplate(props) {
    const classes = useStyles();
    const [ready, setReady] = useState(false)
    const [subjectState, setsubjectState] = useState("")
    const [templateState, setTemplateState]  = useState()
    const { quill, quillRef } = useQuill({modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block']
        ]
      }});

    const submitTemplate = () => {
        const data = JSON.stringify({
            subject: subjectState,
            emailtemplate: JSON.stringify(quill.getContents())
        })
        fetch('http://localhost:8888/api/emailtemplate', {
            method: 'PUT',
            body: data,
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
    }

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
        if (quill && templateState) {
          quill.setContents(JSON.parse(templateState))
          console.log(quill.root.innerHTML)
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
                    <Button onClick={submitTemplate} variant="contained" color="primary"> Save </Button>
                </div>
                <div hidden={ready}>
                    <CircularProgress />
                </div>
            </React.Fragment>

        </div>
    )
} 

export default React.forwardRef((props, ref) => <EmailTemplate {...props} />);