// let userList = {
    // "User1": { // id1
    //     "Name": "XYZ",
    //     "Role": "Developer",
    //     "img": "img_avatar.png",
    //     "tasks_pending": 5,
    //     "tasks_done": 0
    // },
    // "XZZ": { // id2
    //     "Name": "XZZ",
    //     "Role": "Senior Developer",
    //     "img": "img_avatar.png",
    //     "tasks_pending": 0,
    //     "tasks_done": 0
    // }
// };


(function () {
    var model = {

    }

    var octopus = {
        currentUserId: null,
        init: function() {
            debugger
            if (this.getUsers() === null) {
                localStorage["users"] = JSON.stringify([]);
            }
            if (this.getUserList() === null) {
                localStorage["userList"] = JSON.stringify({});
            }
            if (this.getNextUserId() === null) {
                localStorage["nextUserId"] = "1";
            }

            // this.dataClass = new Model();
            // this.dataClass.setUsers();
            // model.init();
            view.init();
            this.addListeners();
        },

        addListeners: function(){
            document.getElementById("add-new-user").addEventListener("submit", function(){
                this.addUser();
            }.bind(this));
            document.getElementById("update-user").addEventListener("submit", function(){
                this.updateUser();
            }.bind(this));
        },

        getUsers: function(){
            return JSON.parse(localStorage.getItem("users"));
        },

        setUsers: function(users){
            localStorage.setItem("users", users);
        },

        getUserList: function(){
            return JSON.parse(localStorage.getItem("userList"))
        },

        setUserList: function(userList){
            localStorage.setItem("userList", userList);
        },

        getNextUserId: function(){
            return JSON.parse(localStorage.getItem("nextUserId"))
        },

        setNextUserId: function(nextUserId){
            localStorage.setItem("nextUserId", nextUserId);
        },

        showUsersList: function(userList) {
            this.sortList(userList)
            Object.keys(userList).forEach((user) => {
                view.displayUser(user, userList);
            });
        },

        addUser: function(){
            let userId = parseInt(this.getNextUserId());
            let userList = this.getUserList();
            var name = document.getElementById("Add_name").value;
            // name = name.replace(/ /g,"-");  // todo: not needed
            var role = document.getElementById("Add_role").value;
            var arr = document.getElementById("Add_image").value.split("\\");   // todo: fixme
            var img = arr[arr.length-1] || "img_avatar.png";

            userList["user"+userId] = {
                "Name": name,   // name,
                "Role": role,
                "userId": "user" + userId,
                "img": img,
                "tasks_pending": 0,
                "tasks_done": 0,
            }
            document.location.href = "#";
            view.clearUserList(userList);
            userList = this.sortList(userList);
            console.log(userList)
            this.showUsersList(userList);
            var users = this.getUsers();
            users.push(name);   // todo: push id
            users = users.sort();
            this.setUsers(JSON.stringify(users));
            view.clearForm("Add");
            userId = userId + 1;
            this.setNextUserId(userId.toString());
            this.setUserList(JSON.stringify(userList));
        },

        deleteFromUsersList: function(name){
            var users=this.getUsers();
            console.log(name);
            users.splice(users.indexOf(name),1);    // todo ?
            this.setUsers(JSON.stringify(users));
        },

        updateUser: function(){
            let userList = this.getUserList();
            var name = document.getElementById("Edit_name").value;
            // name = name.replace(" ","-");
            var role = document.getElementById("Edit_role").value;
            var arr = document.getElementById("Edit_image").value.split("\\");
            let userId = this.currentUserId;
            var img = arr[arr.length-1] || userList[userId].img;
            userList[userId]["Role"] = role;
            userList[userId]["img"] = img;
            document.location.href = "#";
            view.clearUserList(userList);
            userList = this.sortList(userList);
            this.showUsersList(userList);
            view.clearForm("Edit");
            this.setUserList(JSON.stringify(userList));
        },

        sortList: function(unordered) {
            console.log(Object.keys(unordered).length)
            return unordered;
        },
    }

    var view = {
        userListNode: null,
        init: function() {
            debugger;
            this.userListNode = document.getElementById("UList1");
            octopus.showUsersList(octopus.getUserList()); //
          //  octopus.getUsersList().forEach()
        },

        displayUser: function(userId, userList){
            const itemNode = document.createElement("div");
            const user = userList[userId];
            // console.log("hey"+`"${item["Name"]}"`);
            itemNode.setAttribute("id", user["userId"]);
            itemNode.setAttribute("class", "container")
            itemNode.innerHTML = `
            <img src="${user["img"]}" alt="${user["userId"]}" style="width:100%">
            <div class="NameContainer">
                <h4 style="text-align: center"><b>${user["Name"]}</b></h4>
            </div>
            <div class="overlay">
                <div id="User1Details" class="UserDetails">
                    <p id="Name"> 
                        <p class="title"> Name: 
                            <a class="edit">&#x274C;</a>
                            <a href="#popup2" class="edit">&#x270E;</a>
                        </p>${user["Name"]}
                    </p>
                    <p id="Role"> <p class="title">Role: </p>${user["Role"]}</p>
                    <p id="Pending"> <p class="title">Tasks Pending: </p>${user["tasks_pending"]}</p>
                    <p id="Done"> <p class="title">Tasks Done: </p>${user["tasks_done"]}</p>
                </div>
            </div>`
            itemNode.getElementsByClassName("edit")[0].addEventListener("click", function(){
                this.deleteUser(user["userId"])
            }.bind(this));
            itemNode.getElementsByClassName("edit")[1].addEventListener("click", function(){
                this.fillUserInfo(user["userId"])
            }.bind(this));
            this.userListNode.appendChild(itemNode);
        },

        deleteUser: function(userId){
            // console.log(name)
            var del = confirm("All the users details will be deleted!!\nReally, Delete this user??")
            if(del) {
                // name = decodeURIComponent(name);    // todo
                let userList = octopus.getUserList();
                octopus.deleteFromUsersList(userList[userId].Name);
                delete userList[userId];
                octopus.setUserList(JSON.stringify(userList));
                this.userListNode.removeChild(document.getElementById(userId));
            }
        },

        fillUserInfo: function(userId){
            let userList = octopus.getUserList();
            document.getElementById("Edit_name").value = userList[userId].Name;
            console.log(userList[userId].Role)
            octopus.currentUserId = userId;
            document.getElementById("Edit_role").value = userList[userId].Role;
        },

        clearForm: function(key){
            // string templates
            document.getElementById(key+"_name").value = '';
            // document.getElementById(key+"_role").value = 'Product Manger';
            document.getElementById(key+"_image").value = '';
        },

        clearUserList: function(userList){
            document.getElementById("UList1").innerHTML = ``;
        },

    }
    octopus.init();
}())
// let userListNode = null;
// let currentUserId = null;
//
// function onLoadFunction() {
//     if(localStorage.getItem("users") === null) {
//         localStorage["users"] = JSON.stringify([]);
//     }
//     if(localStorage.getItem("userList") === null) {
//         localStorage["userList"] = JSON.stringify({});
//     }
//     if(localStorage.getItem("nextUserId") === null){
//         localStorage["nextUserId"] = "1";
//     }
//     userListNode = document.getElementById("UList1");
//     let userList = JSON.parse(localStorage["userList"]);
//     showUsersList(userList);
// }
//
// function showUsersList(userList) {
//     Object.keys(userList).forEach((user) => {
//         displayUser(user, userList);
// });
// }
//
// // todo: let/var
// function addUser(){
//     let userId = parseInt(localStorage["nextUserId"]);
//     let userList = JSON.parse(localStorage["userList"]);
//     var name = document.getElementById("Add_name").value;
//     // name = name.replace(/ /g,"-");  // todo: not needed
//     var role = document.getElementById("Add_role").value;
//     var arr = document.getElementById("Add_image").value.split("\\");   // todo: fixme
//     var img = arr[arr.length-1] || "img_avatar.png";
//
//     userList["user"+userId] = {
//         "Name": name,   // name,
//         "Role": role,
//         "userId": "user" + userId,
//         "img": img,
//         "tasks_pending": 0,
//         "tasks_done": 0,
//     }
//     document.location.href = "#";
//     clearUserList(userList);
//     userList = sortList(userList);
//     console.log(userList)
//     showUsersList(userList);
//     var users=localStorage.getItem("users");
//     users = JSON.parse(users);
//     users.push(name);   // todo: push id
//     users = users.sort();
//     localStorage.setItem("users",JSON.stringify(users));
//     clearForm("Add");
//     userId = userId + 1;
//     localStorage["nextUserId"] = userId.toString();
//     localStorage["userList"] = JSON.stringify(userList);
// }
//
// function displayUser(userId, userList){
//     const itemNode = document.createElement("div");
//     const user = userList[userId];
//     // console.log("hey"+`"${item["Name"]}"`);
//     itemNode.setAttribute("id", user["userId"]);
//     itemNode.setAttribute("class", "container")
//     itemNode.innerHTML = `
//         <img src="${user["img"]}" alt="${user["userId"]}" style="width:100%">
//         <div class="NameContainer">
//             <h4 style="text-align: center"><b>${user["Name"]}</b></h4>
//         </div>
//         <div class="overlay">
//             <div id="User1Details" class="UserDetails">
//                 <p id="Name">
//                     <p class="title"> Name:
//                         <a onclick={deleteUser("${(user["userId"])}")} class="edit">&#x274C;</a>
//                         <a onclick={fillUserInfo("${(user["userId"])}")} href="#popup2" class="edit">&#x270E;</a>
//                     </p>${user["Name"]}
//                 </p>
//                 <p id="Role"> <p class="title">Role: </p>${user["Role"]}</p>
//                 <p id="Pending"> <p class="title">Tasks Pending: </p>${user["tasks_pending"]}</p>
//                 <p id="Done"> <p class="title">Tasks Done: </p>${user["tasks_done"]}</p>
//             </div>
//         </div>`
//     userListNode.appendChild(itemNode);
//
// }
//
// function deleteUser(userId){
//     // console.log(name)
//     var del = confirm("All the users details will be deleted!!\nReally, Delete this user??")
//     if(del) {
//         // name = decodeURIComponent(name);    // todo
//         let userList = JSON.parse(localStorage["userList"]);
//         deleteFromUsersList(userList[userId].name);
//         delete userList[userId];
//         localStorage.userList = JSON.stringify(userList);
//         userListNode.removeChild(document.getElementById(userId));
//     }
// }
//
// function deleteFromUsersList(name){
//     var users=localStorage.getItem("users");
//     users = JSON.parse(users);
//     users.splice(users.indexOf(name),1);
//     localStorage.setItem("users",JSON.stringify(users));
// }
//
// function fillUserInfo(userId){
//     let userList = JSON.parse(localStorage["userList"]);
//     document.getElementById("Edit_name").value = userList[userId].Name;
//     console.log(userList[userId].Role)
//     currentUserId = userId;
//     document.getElementById("Edit_role").value = userList[userId].Role;
// }
//
// function clearForm(key){
//     // string templates
//     document.getElementById(key+"_name").value = '';
//     document.getElementById(key+"_role").value = '';
//     document.getElementById(key+"_image").value = '';
// }
//
// function clearUserList(userList){
//     document.getElementById("UList1").innerHTML = ``;
// }
//
// function updateUser(){
//     let userList = JSON.parse(localStorage["userList"]);
//     var name = document.getElementById("Edit_name").value;
//     // name = name.replace(" ","-");
//     var role = document.getElementById("Edit_role").value;
//     var arr = document.getElementById("Edit_image").value.split("\\");
//     let userId = currentUserId;
//     var img = arr[arr.length-1] || userList[userId].img;
//     userList[userId]["Role"] = role;
//     userList[userId]["img"] = img;
//     document.location.href = "#";
//     clearUserList(userList);
//     userList = sortList(userList);
//     showUsersList(userList);
//     clearForm("Edit");
//     localStorage["userList"] = JSON.stringify(userList);
// }
//
// function sortList(unordered) {
//     const ordered = {};
//     Object.keys(unordered).sort().forEach(function(key) {
//         ordered[key] = unordered[key];
//     });
//     return ordered;
// }
//
