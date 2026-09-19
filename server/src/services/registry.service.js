const fs = require("fs");
const path = require("path");

const STORAGE_DIR = path.join(__dirname, "..", "..", "list");
if(!fs.existsSync(STORAGE_DIR)){
  fs.mkdirSync(STORAGE_DIR);
}

function addPaper(examId, examName, timeStamp){
    const filePath = path.join(STORAGE_DIR, 'paper.json');
    try{
        let papersList=[];
        const element={
            id: examId,
            name: examName, 
            time: timeStamp
        };
        if(fs.existsSync(filePath)){
            const content = fs.readFileSync(filePath, 'utf-8');
            papersList=content?JSON.parse(content):[];
        }
        papersList.push(element);
        const jsonString = JSON.stringify(papersList, null, 2);
        fs.writeFileSync(filePath, jsonString, 'utf-8');
        console.log("Successfully written to paper.json");
    }
    catch(err){
        console.error("Error: ",err);
    }
}

function addUser(userId, userName){
    const filePath = path.join(STORAGE_DIR, 'user.json');
    try{
        let userList=[];
        const element={
            id: userId,
            name: userName
        };
        if(fs.existsSync(filePath)){
            const content = fs.readFileSync(filePath, 'utf-8');
            userList=content?JSON.parse(content):[];
        }
        userList.push(element);
        const jsonString = JSON.stringify(userList, null, 2);
        fs.writeFileSync(filePath, jsonString, 'utf-8');
        console.log("Successfully written to user.json");
    }
    catch(err){
        console.error("Error: ",err);
    }
}

module.exports = { addPaper, addUser };
