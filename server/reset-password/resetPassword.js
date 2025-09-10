const db = require("../database")
const resetPasswordModel = require("./reset-password-mode")


async function sendResetCode(mail) {
    console.log(mail)
    const sql = `
        SELECT user_id FROM users
        WHERE user_email = ?;
    `
    const [userId] = await db.query(sql,[mail])
    if(userId === undefined) return [false,"Email adress does not Exist"]
    const passwordobject = new resetPasswordModel({ user_id: userId.user_id })
    await passwordobject.save()
    return [true,passwordobject._id]
}


async function sendNewPassword(data) {
    if(typeof data.newPassword !== "string" || data.newPassword.length <= 7 || data.newPassword.length > 72) return "Password has to be atleast 8 characters" 
    const userId = await resetPasswordModel.findOne({_id:data.id},{user_id: 1})
    if(userId === null) return "Invalid Link"
    await db.newPassword(userId,data.newPassword)
    return "Changed Sucessfull"
}

async function isActiveLink(id) {
    const userId = await resetPasswordModel.findOne({_id:id})
    return userId === null 
}
module.exports = {sendResetCode, sendNewPassword, isActiveLink} 