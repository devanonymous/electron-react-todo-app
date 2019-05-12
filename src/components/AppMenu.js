import React, {useState} from 'react';
import {IconButton, MenuList, MenuItem, Paper, ListItemIcon, ListItemText} from '@material-ui/core';
import {Close, Clear, Add, Menu} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';


const {ipcRenderer} = window.require("electron");

const styles = theme => ({
    menuItem: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& $primary, & $icon': {
                color: theme.palette.common.white,
            },
        },
    },
    primary: {},
    icon: {},
});

const renderButton = (isOpen, setIsOpen) => (
    <IconButton onClick={() => setIsOpen(!isOpen)} style={{
        marginLeft: -125,
        marginRight: 20
    }} color="inherit" aria-label="Menu">
        <Menu/>
    </IconButton>
);

const onMenuItemClick = (menuItem, setIsOpen) => () => {
    ipcRenderer.send(`menu:${menuItem}`);
    setIsOpen(false);
};

const renderMenu = (classes, setIsOpen) => (
    <Paper style={{marginTop: 240, marginLeft: -60}}>
        <MenuList>
            <MenuItem onClick={onMenuItemClick('newTodo', setIsOpen)} className={classes.menuItem}>
                <ListItemIcon className={classes.icon}>
                    <Add/>
                </ListItemIcon>
                <ListItemText classes={{primary: classes.primary}} inset primary="New todo"/>
            </MenuItem>
            <MenuItem onClick={onMenuItemClick('clearTodos', setIsOpen)} className={classes.menuItem}>
                <ListItemIcon className={classes.icon}>
                    <Clear/>
                </ListItemIcon>
                <ListItemText classes={{primary: classes.primary}} inset primary="Clear todos"/>
            </MenuItem>
            <MenuItem onClick={onMenuItemClick('quit', setIsOpen)} className={classes.menuItem}>
                <ListItemIcon className={classes.icon}>
                    <Close/>
                </ListItemIcon>
                <ListItemText classes={{primary: classes.primary}} inset primary="Quit"/>
            </MenuItem>
        </MenuList>
    </Paper>
);

const AppMenu = props => {
    const {classes} = props;
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            {renderButton(isOpen, setIsOpen)}
            {isOpen && renderMenu(classes, setIsOpen)}
        </>
    );
};


export default withStyles(styles)(AppMenu);