import React, {useState} from "react";
import { Button, TextField, Paper } from '@material-ui/core';
import "../App.css";

const { ipcRenderer } = window.require("electron");

const onChange = (setValue) => e => {
  setValue(e.target.value);
};

const onAddClick = (value) => () => {
  ipcRenderer.send("todo:add", { text: value });
};
const onCancelClick = () => {
  ipcRenderer.send("todo:cancel");
};

const AddTodoWindow = (props) => {
  const [value, setValue] = useState("");
    return (
      <>
        <Paper style={{ margin: 16, padding: 16 }}>
          <TextField
            placeholder="Add Todo here"
            autoFocus
            value={value}
            onChange={onChange(setValue)}
            style={{ marginRight: 5 }}
          />
          <Button onClick={onAddClick(value)} variant="outlined" color="primary" style={{marginLeft:10}}>
            Add
          </Button>
          <Button onClick={onCancelClick} variant="outlined" color="secondary" style={{marginLeft:10}}>
            Cancel
          </Button>
        </Paper>
      </>
    );
};

export default AddTodoWindow;
