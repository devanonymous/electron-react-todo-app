const electron = require("electron");
const uuid = require("uuid");
const fs = require("fs");

const {app, BrowserWindow, ipcMain} = electron;
let startUrl =
    process.env.ELECTRON_START_URL || `file://${__dirname}/build/index.html`;
startUrl = startUrl.trim();

let mainWindow;
let addTodoWindow;
let todos = [];

fs.readFile("db.json", (err, jsonTodos) => {
    if (!err) {
        const oldTodos = JSON.parse(jsonTodos);
        todos = oldTodos;
    }
});

const createWindow = () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        height: 600,
        width: 800,
        resizable: false
    });
    const url = startUrl + "?window=main";
    mainWindow.loadURL(url);

    //enable garbage collector
    mainWindow.on("closed", () => {
        writeTodosToDisk();
        app.quit();
        mainWindow = null;
    });
    mainWindow.setMenu(null)
};

const writeTodosToDisk = () => {
    const jsonTodos = JSON.stringify(todos);
    fs.writeFileSync("db.json", jsonTodos);
};

const createAddTodoWindow = () => {
    addTodoWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        height: 100,
        width: 450,
        modal: true,
        frame: false,
        resizable: false,
        show: false
    });

    const url = startUrl + "?window=new_todo";
    addTodoWindow.loadURL(url);

    addTodoWindow.on("closed", () => {
        addTodoWindow = null;
    });

    addTodoWindow.setMenu(null);
};

app.on("ready", () => {
    createWindow();
    createAddTodoWindow()
});

ipcMain.on("todo:list", event => {
    mainWindow.webContents.send("todo:list", todos);
});

ipcMain.on("menu:newTodo", event => {
    addTodoWindow.show();
});

ipcMain.on("menu:clearTodos", event => {
    todos = [];
    mainWindow.webContents.send("todo:clear");
});

ipcMain.on("menu:quit", event => {
    app.quit();
});

ipcMain.on("todo:add", (event, data) => {
    const todo = {
        id: uuid(),
        isCompleted: false,
        text: data.text
    };
    todos.push(todo);
    mainWindow.webContents.send("todo:add", todo);
    addTodoWindow.hide();
});

ipcMain.on("todo:remove", (event, id) => {
    const todoId = todos.findIndex(todo => todo.id === id);
    todos.splice(todoId, 1);
    writeTodosToDisk();
});

ipcMain.on("todo:changeIsCompleted", (event, {id, isCompleted}) => {
    const todoId = todos.findIndex(todo => todo.id === id);
    todos[todoId].isCompleted = isCompleted;
    writeTodosToDisk();
});

ipcMain.on("todo:cancel", (event, data) => {
    addTodoWindow.hide();
});
