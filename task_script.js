// let taskList = {
    // "task1": {
    //     "title": "Do this",
    //     "description": "How to do it",
    //     "assigned": "XYZ",
    //     "status": "Todo",
    //     "due": "25th Jan,2018"
    // },
    // "task2": {
    //     "title": "Do this",
    //     "description": "How to do it",
    //     "assigned": "ABC",
    //     "status": "Todo",
    //     "due": "25th Jan,2018"
    // },
// };

// var users = [ "ABC", "XYZ", "PQR", "DEF", "MNO"];
// let nextTaskId = 1;

// todo
// const TODO = {
//     id: 'TODO',
//     label: 'To-Do',
//     nextTask: DOING.id
// };
(function() {
    var model = {

    }

    var octopus = {
        taskId : 0,

        init: function() {
            if (this.getUsers() === null) {
                localStorage["users"] = JSON.stringify([]);
            }
            if (this.getTaskList() === null) {
                localStorage["taskList"] = JSON.stringify({});
            }
            if (this.getNextTaskId() === null) {
                localStorage["nextTaskId"] = "1";
            }

            // model.init();
            view.init();
            this.addListeners();
        },

        addListeners: function(){
            document.getElementById("NewTask").addEventListener("submit", this.addTask.bind(this));
            document.getElementById("EditTask").addEventListener("submit", function(){
                this.updateTask();
            }.bind(this));
        },

        getUsers: function(){
            return JSON.parse(localStorage.getItem("users"));
        },

        setUsers: function(users){
            localStorage.setItem("users", users);
        },

        getTaskList: function(){
            return JSON.parse(localStorage.getItem("taskList"))
        },

        setTaskList: function(taskList){
            localStorage.setItem("taskList", taskList);
        },

        getUserList: function(){
            return JSON.parse(localStorage.getItem("userList"))
        },

        setUserList: function(userList){
            localStorage.setItem("userList", userList);
        },

        getNextTaskId: function(){
            return JSON.parse(localStorage.getItem("nextTaskId"))
        },

        setNextTaskId: function(nextTaskId){
            localStorage.setItem("nextTaskId", nextTaskId);
        },

        // todo when sorted list has ids
        getUserIdFromName: function(userName){
            let userList = JSON.parse(localStorage["userList"]);
            let userId = null;
            Object.keys(userList).forEach((user) =>{
                // console.log(userList[user]["Name"]);
                if(userList[user]["Name"] === userName) {
                // console.log(userList[user]["userId"])
                userId = userList[user]["userId"];
            }
        })
            return userId;
        },

        allowDrop: function() {
            event.preventDefault();
        },

        drop: function(user) {
            event.preventDefault();
            let taskList = this.getTaskList();
            var data = event.dataTransfer.getData("text");
            var temp = taskList[data];
            this.taskId = data;
            this.deleteTask();
            temp["assigned"] = user;
            taskList[data] = temp;
            debugger
            this.increaseTaskCounter(user, temp.status)
            view.displayTask(data, taskList);
            this.setTaskList(JSON.stringify(taskList));
            view.showDetails(this.taskId);
        },

        drag: function() {
            event.dataTransfer.setData("text", event.target.id);
        },

        addTask: function(){
            let taskList = this.getTaskList();
            let nextTaskId = parseInt(this.getNextTaskId());
            var title = document.getElementById("add_task_title").value;
            var description = document.getElementById("add_task_description").value;
            var assign = document.getElementById("add_task_assign").value;
            var due = document.getElementById("add_task_due").value;
            var status = "Todo";
            // console.log("Task"+nextTaskId);
            taskList["Task"+nextTaskId] = {
                "title": title,
                "description": description,
                "assigned": assign,
                "due": due,
                "status": status,
            }
            this.increaseTaskCounter(assign, status);
            view.clearForm("add");
            document.location.href = "#";
            this.setTaskList(JSON.stringify(taskList));
            view.displayTask("Task"+nextTaskId, taskList);
            nextTaskId = nextTaskId + 1;
            this.setNextTaskId(nextTaskId.toString());
            // addUserInList();
        },

        deleteTask: function(){
            // console.log("deleting")
            let taskList = this.getTaskList();
            let userId = this.getUserIdFromName(taskList[this.taskId].assigned);
            document.getElementById(userId+"_"+taskList[this.taskId].status).removeChild(document.getElementById(this.taskId));
            document.getElementById("ShowDetails").innerHTML = ``;
            this.decreaseTaskCounter(taskList[this.taskId].assigned, taskList[this.taskId].status);
            delete taskList[this.taskId];
            this.setTaskList(JSON.stringify(taskList));
        },

        updateTask: function(){
            let taskList = this.getTaskList();
            var title = document.getElementById("edit_task_title").value;
            var description = document.getElementById("edit_task_description").value;
            var assign = document.getElementById("edit_task_assign").value;
            var due = document.getElementById("edit_task_due").value;
            var status;
            if(document.getElementById("todo").checked){
                status = "Todo";
            }
            else if(document.getElementById("done").checked){
                status = "Done";
            }
            else if(document.getElementById("doing").checked){
                status = "Doing";
            }
            this.setTaskList(JSON.stringify(taskList));
            this.deleteTask();
            taskList = this.getTaskList();
            taskList[this.taskId] = {
                title,
                "description": description,
                "assigned": assign,
                "due": due,
                "status": status,
            }
            document.location.href = "#";
            view.clearForm("edit");
            view.displayTask(this.taskId, taskList);
            this.increaseTaskCounter(assign, status);
            this.setTaskList(JSON.stringify(taskList));
            view.showDetails(this.taskId);
        },

        forwardTask: function(){
            let taskList = this.getTaskList();
            if(taskList[this.taskId].status=="Todo"){
                this.deleteTask();
                taskList[this.taskId].status = "Doing";
                this.increaseTaskCounter(taskList[this.taskId].assigned, "Doing")
            }
            else if(taskList[this.taskId].status=="Doing"){
                this.deleteTask();
                taskList[this.taskId].status = "Done";
                this.increaseTaskCounter(taskList[this.taskId].assigned, "Done")
            }
            else{
                return
            }
            view.displayTask(this.taskId, taskList);
            this.setTaskList(JSON.stringify(taskList));
            view.showDetails(this.taskId);
        },

        increaseTaskCounter: function(user, status){
            let userList = this.getUserList();
            userId = this.getUserIdFromName(user);
            console.log(userId)
            if(status == "Done"){
                userList[userId]["tasks_done"]++;
            }
            else {
                userList[userId]["tasks_pending"]++;
            }
            this.setUserList(JSON.stringify(userList));
        },

        decreaseTaskCounter: function(user, status){
            let userList = this.getUserList();
            userId = this.getUserIdFromName(user);
            if(status == "Done"){
                userList[userId]["tasks_done"]--;
            }
            else {
                userList[userId]["tasks_pending"]--;
            }
            this.setUserList(JSON.stringify(userList));
        },

}

    var view = {
        taskListNode: null,

        init: function() {
            debugger;
            this.taskListNode = document.getElementById("TList1");
            this.showTasksList();
            this.addUserInList();
            },

        showTasksList: function() {
            var users = octopus.getUsers();
            users.forEach((item) => {
                this.displayCard(item);
            })
            let taskList = octopus.getTaskList();
            Object.keys(taskList).forEach((itemName) => {
                this.displayTask(itemName, taskList);
            });
        },

        displayTask: function(taskId, taskList){
            var users = octopus.getUsers();
            const task = taskList[taskId];
            // console.log(taskList[taskId].assigned);
            if(users.indexOf(taskList[taskId].assigned) == -1){
                let taskList = octopus.getTaskList();
                delete taskList[taskId];
                octopus.setTaskList(JSON.stringify(taskList));
                console.log("Is something wrong??");
                return
            }

            // todo: create html : function getNewTaskHtml(task)
            const itemNode = document.createElement("p");
            //// console.log(itemName);
            itemNode.setAttribute("id", taskId);
            itemNode.setAttribute("class", "Task");
            itemNode.addEventListener("click", function(){
                this.showTaskInfo(taskId);
            }.bind(this,taskId))
            itemNode.setAttribute("draggable","true");
            itemNode.addEventListener("dragstart",function(){
                octopus.drag();
            });
            debugger
            itemNode.innerHTML = `
                ${task["title"]}<br>
                    <span class="due-date">Due on: ${task["due"]}</span>
            `
            userId = octopus.getUserIdFromName(task["assigned"]);
            document.getElementById(userId+"_"+task["status"]).appendChild(itemNode);
        },


        displayCard: function(user){
            let itemNode = document.createElement("div");
            // // console.log(user);
            let userId = octopus.getUserIdFromName(user);
            itemNode.setAttribute("id", userId+"_card");
            itemNode.setAttribute("class", "Card")
            itemNode.addEventListener("dragover", function(){
                octopus.allowDrop();
            })
            itemNode.addEventListener("drop", function(){
                octopus.drop(user);
            }.bind(null,user))
            // itemNode.setAttribute("ondragover", "allowDrop(event)");
            // itemNode.setAttribute("ondrop", `drop("${user}")`);
            itemNode.innerHTML = `
            <p id="Name1" class="Name">${user}</p>
            <a href="#new-task-popup" class="user-add-task")>Add Task</a>
            <div class="Check">
                <input type="checkbox" Name="Filter" id="${userId}_todo_f" checked="true">To-do
                <input type="checkbox" Name="Filter" id="${userId}_doing_f" checked="true">Doing
                <input type="checkbox" Name="Filter" id="${userId}_done_f" checked="true">Done<br>
            </div>
            <div class="sub-TList" id=${userId}_subTlist>
                <div id=${userId}_Todo>
                    <p class="heading-text">To-do</p>
                </div>
                <div id=${userId}_Doing>
                    <p class="heading-text">Doing</p>
                </div>
                <div id=${userId}_Done>
                    <p class="heading-text">Done</p>
                </div>
            </div>
            `
            itemNode.getElementsByClassName("user-add-task")[0].addEventListener("click", function(){
                this.fillUser(encodeURIComponent(user))
            }.bind(this, encodeURIComponent(user)));
            this.taskListNode.appendChild(itemNode);
            document.getElementById(userId+"_todo_f").addEventListener("click", function(){
                this.updateFilter(0, userId)
            }.bind(this,0,userId));
            document.getElementById(userId+"_doing_f").addEventListener("click", function(){
                this.updateFilter(1, userId)
            }.bind(this,1,userId));
            document.getElementById(userId+"_done_f").addEventListener("click", function(){
                this.updateFilter(2, userId)
            }.bind(this,2,userId));
        },


        fillUser: function(uname){
            uname = decodeURIComponent(uname);
            document.getElementById("add_task_assign").value = uname;
        },

        updateFilter: function(num,id){
            if(num==0) {
                if (!document.getElementById(id+"_todo_f").checked) {
                    // console.log(1)
                    document.getElementById(id+"_Todo").style.display = "none";
                }
                else {
                    // console.log(2)
                    document.getElementById(id+"_Todo").style.display = "block";
                }
            }
            else if(num==1){
                if (!document.getElementById(id+"_doing_f").checked) {
                    document.getElementById(id+"_Doing").style.display = "none";
                }
                else {
                    document.getElementById(id+"_Doing").style.display = "block";
                }
            }
            else{
                if (!document.getElementById(id+"_done_f").checked) {
                    document.getElementById(id+"_Done").style.display = "none";
                }
                else {
                    document.getElementById(id+"_Done").style.display = "block";
                }
            }
        },

        editTask: function(taskId) {
            let taskList = octopus.getTaskList();
            document.getElementById("edit_task_title").value = taskList[taskId].title;
            document.getElementById("edit_task_description").value = taskList[taskId].description;
            document.getElementById("edit_task_assign").value = taskList[taskId].assigned;
            document.getElementById("edit_task_due").value = taskList[taskId].due;

            // {
            //     TODO: {
            //         id: '',
            //             label: ''
            //     }
            // }
            // const status = taskList[taskId].status;
            // document.getElementById(MAP[status]).checked = true;

            if(taskList[taskId].status=="Todo") {
                document.getElementById("todo").checked = true;
            }
            else if(taskList[taskId].status=="Done") {
                document.getElementById("done").checked = true;
            }
            else{
                document.getElementById("doing").checked = true;
            }
        },

        showTaskInfo: function(id){
            document.getElementById("ShowDetails").innerHTML = ``;
            octopus.taskId = id;
            this.showDetails(id);
        },

        showDetails: function(taskId){
            let taskList = octopus.getTaskList();
            let node = document.getElementById("ShowDetails");
            node.innerHTML = `
            <h1 style="text-align: center">Details</h1>
            <p id="Task Title"> <p class="title"> Task Title: </p>"${taskList[taskId].title}"</p>
            <p id="Task Details" > 
                <p class="title"> Task Details: </p>"${taskList[taskId].description}"
            </p>
            <p id="status"> <p class="title">Status </p>"${taskList[taskId].status}"</p>
            <p id="Assigned"> <p class="title">Assigned To: </p>"${taskList[taskId].assigned}"</p>
            <p id="Due Date"> <p class="title">Due Date: </p>"${taskList[taskId].due}"</p>
            <div id="button-panel">
                <a class="small-button" id="forwardButton">Forward</a>
                <a class="small-button" id="deleteButton">Remove </a>
                <a href="#edit-task-popup" class="small-button" id="editButton">Edit</a>
                <br>
            </div>`
            document.getElementById("forwardButton").addEventListener("click", function(){
                octopus.forwardTask();
            });

            document.getElementById("deleteButton").addEventListener("click", function(){
                this.removePrompt();
            }.bind(this));

            document.getElementById("editButton").addEventListener("click", function(){
                this.editTask(taskId);
            }.bind(this));
        },

        removePrompt: function(){
            if(confirm("Really, Delete this task??")){
                octopus.deleteTask();
            }
        },

        addUserInList: function(){
            console.log("hey")
            var arr = [];
            arr.push("`");
            var users = octopus.getUsers();
            users.forEach((user) => {
                arr.push("<option>"+user+"</option>")
            })
            arr.push("`");
            document.getElementById("add_task_assign").innerHTML = arr.join();
            document.getElementById("edit_task_assign").innerHTML = arr.join();
        },

        clearForm: function(key){
            document.getElementById(key+"_task_title").value = "";
            document.getElementById(key+"_task_description").value = "";
            document.getElementById(key+"_task_due").value = "";
        },
    }

    octopus.init();
}());






// function onLoadFunction() {
//     // console.log(localStorage.getItem("users"))
//
//
// }
//
// function showTasksList() {
//     var users = localStorage.getItem("users");
//     users = JSON.parse(users);
//     users.forEach((item) => {
//         displayCard(item);
// })
//     let taskList = JSON.parse(localStorage["taskList"]);
//     Object.keys(taskList).forEach((itemName) => {
//         displayTask(itemName, taskList);
//     });
// }
//
// function displayTask(taskId, taskList){
//     var users = localStorage.getItem("users");
//     users = JSON.parse(users);
//     const task = taskList[taskId];
//     // console.log(taskList[taskId].assigned);
//     if(users.indexOf(taskList[taskId].assigned) == -1){
//         let taskList = JSON.parse(localStorage["taskList"]);
//         delete taskList[taskId];
//         localStorage["taskList"] = JSON.stringify(taskList);
//         console.log("Is something wrong??");
//         return
//     }
//
//     // todo: create html function getNewTaskHtml(task)
//     const itemNode = document.createElement("p");
//     //// console.log(itemName);
//     itemNode.setAttribute("id", taskId);
//     itemNode.setAttribute("class", "Task");
//     itemNode.setAttribute("onclick", `showTaskInfo("${taskId}")`);
//     itemNode.setAttribute("draggable","true");
//     itemNode.setAttribute("ondragstart","drag(event)");
//     debugger
//     itemNode.innerHTML = `
//     ${task["title"]}<br>
//         <span class="due-date">Due on: ${task["due"]}</span>
//     `
//     userId = getUserIdFromName(task["assigned"]);
//     document.getElementById(userId+"_"+task["status"]).appendChild(itemNode);
// }
//
// function displayCard(user){
//     const itemNode = document.createElement("div");
//     // // console.log(user);
//     let userId = getUserIdFromName(user);
//     itemNode.setAttribute("id", userId+"_card");
//     itemNode.setAttribute("class", "Card")
//     itemNode.setAttribute("ondragover", "allowDrop(event)");
//     itemNode.setAttribute("ondrop", `drop("${user}")`);
//     itemNode.innerHTML = `
//         <p id="Name1" class="Name">${user}</p>
//         <a href="#new-task-popup" class="user-add-task" onclick=fillUser("${encodeURIComponent(user)}")>Add Task</a>
//         <div class="Check">
//             <input type="checkbox" Name="Filter" id="${userId}_todo_f" onclick=updateFilter(0,"${userId}") checked="true">To-do
//             <input type="checkbox" Name="Filter" id="${userId}_doing_f" onclick=updateFilter(1,"${userId}") checked="true">Doing
//             <input type="checkbox" Name="Filter" id="${userId}_done_f" onclick=updateFilter(2,"${userId}") checked="true">Done<br>
//         </div>
//         <div class="sub-TList" id=${userId}_subTlist>
//             <div id=${userId}_Todo>
//                 <p class="heading-text">To-do</p>
//             </div>
//             <div id=${userId}_Doing>
//                 <p class="heading-text">Doing</p>
//             </div>
//             <div id=${userId}_Done>
//                 <p class="heading-text">Done</p>
//             </div>
//         </div>
//     `
//
//     taskListNode.appendChild(itemNode);
// }
//
// function allowDrop(ev) {
//     ev.preventDefault();
// }
//
// function drop(user) {
//     event.preventDefault();
//     let taskList = JSON.parse(localStorage["taskList"]);
//     var data = event.dataTransfer.getData("text");
//     var temp = taskList[data];
//     taskId = data;
//     deleteTask();
//     temp["assigned"] = user;
//     taskList[data] = temp;
//     increaseTaskCounter(user, temp.status)
//     displayTask(data, taskList);
//     localStorage["taskList"] = JSON.stringify(taskList);
//     showDetails();
// }
//
// // todo: TASK_1, TASK_2 / USER_1
//
// function fillUser(uname){
//     debugger
//     uname = decodeURIComponent(uname);
//     document.getElementById("add_task_assign").value = uname;
// }
//
// // arg: (filterId, taskId)
// function updateFilter(num,id){
//     if(num==0) {
//         if (!document.getElementById(id+"_todo_f").checked) {
//             // console.log(1)
//             document.getElementById(id+"_Todo").style.display = "none";
//         }
//         else {
//             // console.log(2)
//             document.getElementById(id+"_Todo").style.display = "block";
//         }
//     }
//     else if(num==1){
//         if (!document.getElementById(id+"_doing_f").checked) {
//             document.getElementById(id+"_Doing").style.display = "none";
//         }
//         else {
//             document.getElementById(id+"_Doing").style.display = "block";
//         }
//     }
//     else{
//         if (!document.getElementById(id+"_done_f").checked) {
//             document.getElementById(id+"_Done").style.display = "none";
//         }
//         else {
//             document.getElementById(id+"_Done").style.display = "block";
//         }
//     }
// }
//
// function drag(ev) {
//     ev.dataTransfer.setData("text", ev.target.id);
// }
//
// function getUserIdFromName(userName){
//     let userList = JSON.parse(localStorage["userList"]);
//     let userId = null;
//     Object.keys(userList).forEach((user) =>{
//         // console.log(userList[user]["Name"]);
//         if(userList[user]["Name"] === userName) {
//             // console.log(userList[user]["userId"])
//             userId = userList[user]["userId"];
//         }
//     })
//     return userId;
// }
//
// function addTask(){
//     let taskList = JSON.parse(localStorage["taskList"]);
//     let nextTaskId = parseInt(localStorage["nextTaskId"]);
//     var title = document.getElementById("add_task_title").value;
//     var description = document.getElementById("add_task_description").value;
//     var assign = document.getElementById("add_task_assign").value;
//     var due = document.getElementById("add_task_due").value;
//     var status = "Todo";
//     // console.log("Task"+nextTaskId);
//     taskList["Task"+nextTaskId] = {
//         "title": title,
//         "description": description,
//         "assigned": assign,
//         "due": due,
//         "status": status,
//     }
//     increaseTaskCounter(assign, status);
//     clearForm("add");
//     document.location.href = "#";
//     localStorage["taskList"] = JSON.stringify(taskList);
//     displayTask("Task"+nextTaskId, taskList);
//     nextTaskId = nextTaskId + 1;
//     localStorage["nextTaskId"] = nextTaskId.toString();
//     // addUserInList();
// }
//
// function deleteTask(){
//     // console.log("deleting")
//     let taskList = JSON.parse(localStorage["taskList"]);
//     let userId = getUserIdFromName(taskList[taskId].assigned);
//     document.getElementById(userId+"_"+taskList[taskId].status).removeChild(document.getElementById(taskId));
//     document.getElementById("ShowDetails").innerHTML = ``;
//     decreaseTaskCounter(taskList[taskId].assigned, taskList[taskId].status);
//     delete taskList[taskId];
//     localStorage["taskList"] = JSON.stringify(taskList);
// }
//
// function editTask() {
//     let taskList = JSON.parse(localStorage["taskList"]);
//     document.getElementById("edit_task_title").value = taskList[taskId].title;
//     document.getElementById("edit_task_description").value = taskList[taskId].description;
//     document.getElementById("edit_task_assign").value = taskList[taskId].assigned;
//     document.getElementById("edit_task_due").value = taskList[taskId].due;
//     if(taskList[taskId].status=="Todo") {
//         document.getElementById("todo").checked = true;
//     }
//     else if(taskList[taskId].status=="Done") {
//         document.getElementById("done").checked = true;
//     }
//     else{
//         document.getElementById("doing").checked = true;
//     }
// }
//
// function updateTask(){
//     let taskList = JSON.parse(localStorage["taskList"]);
//     var title = document.getElementById("edit_task_title").value;
//     var description = document.getElementById("edit_task_description").value;
//     var assign = document.getElementById("edit_task_assign").value;
//     var due = document.getElementById("edit_task_due").value;
//     var status;
//     if(document.getElementById("todo").checked){
//         status = "Todo";
//     }
//     else if(document.getElementById("done").checked){
//         status = "Done";
//     }
//     else if(document.getElementById("doing").checked){
//         status = "Doing";
//     }
//     localStorage["taskList"] = JSON.stringify(taskList);
//     debugger
//     deleteTask();
//     taskList = JSON.parse(localStorage["taskList"]);
//     taskList[taskId] = {
//         "title": title,
//         "description": description,
//         "assigned": assign,
//         "due": due,
//         "status": status,
//     }
//     document.location.href = "#";
//     clearForm("edit");
//     displayTask(taskId, taskList);
//     increaseTaskCounter(assign, status);
//     localStorage["taskList"] = JSON.stringify(taskList);
//     showDetails();
// }
//
// function forwardTask(){
//     let taskList = JSON.parse(localStorage["taskList"]);
//     if(taskList[taskId].status=="Todo"){
//         deleteTask();
//         taskList[taskId].status = "Doing";
//         increaseTaskCounter(taskList[taskId].assigned, "Doing")
//     }
//     else if(taskList[taskId].status=="Doing"){
//         deleteTask();
//         taskList[taskId].status = "Done";
//         increaseTaskCounter(taskList[taskId].assigned, "Done")
//     }
//     else{
//         return
//     }
//     displayTask(taskId, taskList);
//     localStorage["taskList"] = JSON.stringify(taskList);
//     showDetails();
// }
//
// function showTaskInfo(id){
//     document.getElementById()
//     document.getElementById("ShowDetails").innerHTML = ``;
//     taskId = id;
//     //// console.log(id);
//     showDetails();
// }
//
// function showDetails(taskId){
//     let taskList = JSON.parse(localStorage["taskList"]);
//     let node = document.getElementById("ShowDetails");
//     node.innerHTML = `
//         <h1 style="text-align: center">Details</h1>
//         <p id="Task Title"> <p class="title"> Task Title: </p>"${taskList[taskId].title}"</p>
//         <p id="Task Details" >
//             <p class="title"> Task Details: </p>"${taskList[taskId].description}"
//         </p>
//         <p id="status"> <p class="title">Status </p>"${taskList[taskId].status}"</p>
//         <p id="Assigned"> <p class="title">Assigned To: </p>"${taskList[taskId].assigned}"</p>
//         <p id="Due Date"> <p class="title">Due Date: </p>"${taskList[taskId].due}"</p>
//         <div id="button-panel">
//             <a class="small-button" onclick="forwardTask()">Forward</a>
//             <a class="small-button" onclick="removePrompt()">Remove </a>
//             <a href="#edit-task-popup" class="small-button" onclick="editTask()">Edit</a>
//             <br>
//         </div>`
// }
//
// function removePrompt(){
//     if(confirm("Really, Delete this task??")){
//         deleteTask();
//     }
// }
//
// function increaseTaskCounter(user, status){
//     let userList = JSON.parse(localStorage["userList"]);
//     userId = getUserIdFromName(user);
//     // console.log(userId)
//     if(status == "Done"){
//         userList[userId]["tasks_done"]++;
//     }
//     else {
//         userList[userId]["tasks_pending"]++;
//     }
//     localStorage["userList"] = JSON.stringify(userList);
// }
//
// function decreaseTaskCounter(user, status){
//     let userList = JSON.parse(localStorage["userList"]);
//     userId = getUserIdFromName(user);
//     if(status == "Done"){
//         userList[userId]["tasks_done"]--;
//     }
//     else {
//         userList[userId]["tasks_pending"]--;
//     }
//     localStorage["userList"] = JSON.stringify(userList);
// }
//
// function clearForm(key){
//     document.getElementById(key+"_task_title").value = "";
//     document.getElementById(key+"_task_description").value = "";
//     document.getElementById(key+"_task_due").value = "";
//     // document.getElementById(key+"_task_assign").value = "";
//     // if(key == "edit")
//     //     document.getElementById(key+"_task_status").value = "";
// }
//
// function clearTaskList(UserList){
//     document.getElementById("UList1").innerHTML = ``;
// }
//
// function addUserInList(){
//     var arr = [];
//     arr.push("`");
//     var users = localStorage.getItem("users");
//     users = JSON.parse(users);
//     users.forEach((user) => {
//         arr.push("<option>"+user+"</option>")
//     })
//     arr.push("`");
//     document.getElementById("add_task_assign").innerHTML = arr.join();
//     document.getElementById("edit_task_assign").innerHTML = arr.join();
//     debugger
// }