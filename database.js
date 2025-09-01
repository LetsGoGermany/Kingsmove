const mysql = require('mysql2');
const crypto = require('crypto');
const sessionLoader = require('./session/session');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RCadmin1887',
  database: 'royalchess'
});

connection.connect()
 
function newUser(userInfo) {
    userInfo.user_password = crypto.createHash('sha256').update(userInfo.user_password).digest('hex');
    let verificationCode = generateCode(6)
    const userTable = [
        userInfo.user_name,
        userInfo.user_id,
        userInfo.user_mail,
        userInfo.user_password,
        verificationCode,
    ]
    const sql = `INSERT INTO users VALUES (?, ?, ?, ? ,NOW(), ?, false,0)`;
    connection.query(sql, userTable)
    return verificationCode;
}

function generateCode(n) {
  let code = '';
  for(i=0;i<n;i++) {
    code+= Math.floor(Math.random()*10);
  }
    return code
}


const util = require('util');
const query = util.promisify(connection.query).bind(connection);


async function doesUserExist(name,typeOfData) {

  console.log(name,typeOfData," \n l46 database")
  const sql = `
  SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END AS user_exists
  FROM users
  WHERE user_${typeOfData} = ?
`;
  const results = await query(sql,name);
  return !!results[0].user_exists;
}


async function tryToVerifyeUser(verification,userId) {
  const sql = `
    SELECT user_verification_code 
    FROM users 
    WHERE user_id = ?;
`;
const code = await query(sql,userId) 
let isCodeCorrect = code[0].user_verification_code === `${verification}`;

if(isCodeCorrect) {
  const sql2 = `
  UPDATE users
  SET user_activated = 1
  WHERE user_id = ?;
`;
query(sql2,userId);
}

return isCodeCorrect


}


async function deleteInactiveUsers() {
    const sql = `
    DELETE FROM users
    WHERE user_activated = 0
    AND user_signup_date < NOW() - INTERVAL 10 MINUTE  
  `;
  await query(sql);
}
  

async function verifyAccount(data) {
  const sqL = "SELECT * FROM users WHERE user_id = ?"
  const result = await query(sqL,[data.user_id])
  if(result.length === 0) return "Invalid Input"

  if(result[0].user_verification_code != data.code)  return "Code is incorrect. Please try again"
  const updateSQL = `
    UPDATE users 
      SET user_activated = 1,
          user_verification_code = NULL 
    WHERE user_id = ?`

  query(updateSQL,[data.user_id])
  return [result[0].user_id]
}

async function userLogInAttempt(data,socket) {
  const keys = JSON.stringify(["user_mail","user_password"])
  const ObjectKeys = JSON.stringify(Object.keys(data))
  if(keys !== ObjectKeys) return socket.emit("errorInLogIn", "Invalid Input")
  const sql = `SELECT * FROM users WHERE user_email = ?`
  const result = await query(sql,[data.user_mail])
  
  if(result.length === 0) return socket.emit("errorInLogIn", "Email does not exists")

  const password = crypto.createHash('sha256').update(data.user_password).digest('hex')
  if(password !== result[0].user_password) return socket.emit("errorInLogIn", "Password is incorrect")
  
  const sessionID = await sessionLoader.addUserSession([result[0].user_id])
  return socket.emit("userLoggedInSucess",{user_id: result[0].user_id, sessionId: sessionID})
}

async function getNameById(id) {
  try {
    const sql = `SELECT user_name FROM users WHERE user_id = ?`
    const result = await query(sql,[id])
    return result[0].user_name
  } catch(error) {
    console.trace(error)
  }
}

async function getNamesById(IDs) {
 const sql = `SELECT user_name
              FROM users
              WHERE user_id IN (?);
              `
  const names = await query(sql, [IDs])
  return names
}
module.exports = {newUser,connection,doesUserExist,tryToVerifyeUser,deleteInactiveUsers,verifyAccount,userLogInAttempt,getNameById,getNamesById};
