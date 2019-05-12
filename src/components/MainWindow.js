import React, { Component } from "react";
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

class MainWindow extends Component {
  /*TODO:*/
  state = {
    todos: []
  };

  componentDidMount() {
    ipcRenderer.send("todo:list");

    ipcRenderer.on("todo:list", (event, data) => {
      this.setState({ todos: data });
    });
    ipcRenderer.on("todo:add", (event, data) => {
      this.setState({ todos: [...this.state.todos, data] });
    });
    ipcRenderer.on("todo:clear", event => {
      this.setState({ todos: [] });
    });
  }

  onDeleteButtonClick = (id) => {
    const todoId = this.state.todos.findIndex(todo => todo.id === id);
    this.state.todos.splice(todoId, 1);
    this.setState({todos: [...this.state.todos]});
    ipcRenderer.send("todo:remove", id);
  };

  renderTodos = () => {
    return this.state.todos.map(todo => <ToDoListItem onDeleteButtonClick={this.onDeleteButtonClick} key={todo.id} todo={todo} />);
  };

  render() {
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
          {this.renderTodos()}
        </List>
        <Fab onClick={() => ipcRenderer.send('menu:newTodo')} color="primary" aria-label="Add" className={this.props.classes.fab}>
          <AddIcon />
        </Fab>
      </Paper>
    );
  }
}

export default withStyles(style)(MainWindow);
