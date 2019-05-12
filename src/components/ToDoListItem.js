import React, {memo, useState} from 'react';

import {
    ListItem,
    Checkbox,
    IconButton,
    ListItemText,
    ListItemSecondaryAction,
} from '@material-ui/core';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';

const { ipcRenderer } = window.require("electron");

const onCheckBoxToggle = (isCompleted, setIsCompleted, id) => () => {
    setIsCompleted(!isCompleted);
    ipcRenderer.send("todo:changeIsCompleted", {id, isCompleted: !isCompleted});
};

const TodoListItem = memo(({todo, onDeleteButtonClick}) => {
        const [isCompleted, setIsCompleted] = useState(todo.isCompleted);

        return (
            <ListItem divider={true}>
                <Checkbox
                      onClick={onCheckBoxToggle(isCompleted, setIsCompleted, todo.id)}
                      checked={isCompleted}
                    disableRipple
                />
                <ListItemText style={isCompleted ? {textDecoration: "line-through"} : {textDecoration: "none"}} primary={todo.text}/>
                <ListItemSecondaryAction>
                    <IconButton aria-label="Delete Todo" onClick={() => onDeleteButtonClick(todo.id)}>
                        <DeleteOutlined/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        )
    });

export default TodoListItem;