import React, {Component, useEffect, useState} from "react";
import { AppBar, Toolbar, Typography, Paper, List, Fab, withStyles } from '@material-ui/core';
import ToDoListItem from './ToDoListItem';
import AddIcon from '@material-ui/icons/Add';
import AppMenu from './AppMenu'

const { ipcRenderer } = window.require("electron");

const style = theme => ({
    fab: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
    }
});

const MainWindow = props => {
    /*TODO:*/
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        ipcRenderer.send("todo:list");

        ipcRenderer.on("todo:list", (event, data) => {
            setTodos(data);
        });
        ipcRenderer.on("todo:add", (event, data) => {
            setTodos(oldTodos => [...oldTodos, data]);
            // console.log(newTodos, 'NEEEEEEEEEWWWWWWWW!!!!!!!!!!', todos, data)
        });
        ipcRenderer.on("todo:clear", event => {
            setTodos([]);
        });
    }, []);

    const onDeleteButtonClick = (id) => {
        const todoId = todos.findIndex(todo => todo.id === id);
        todos.splice(todoId, 1);
        setTodos([...todos]);
        ipcRenderer.send("todo:remove", id);
    };

    const renderTodos = () => {
        return todos.map(todo => <ToDoListItem onDeleteButtonClick={onDeleteButtonClick} key={todo.id} todo={todo} />);
    };

    return (
        <Paper
            elevation={0}
            style={{flexGrow: 1, padding: 0, margin: 0, backgroundColor: '#fafafa' }}
        >
            <AppBar color="primary" position="relative" style={{ height: 64 }}>
                <Toolbar style={{ height: 64 }}>
                    <Typography style={{marginLeft: 30}} color="inherit">TODO APP</Typography>
                    <AppMenu />
                </Toolbar>
            </AppBar>
            <List>
                {renderTodos()}
            </List>
            <Fab onClick={() => ipcRenderer.send('menu:newTodo')} color="primary" aria-label="Add" className={props.classes.fab}>
                <AddIcon />
            </Fab>
        </Paper>
    );

};

export default withStyles(style)(MainWindow);
