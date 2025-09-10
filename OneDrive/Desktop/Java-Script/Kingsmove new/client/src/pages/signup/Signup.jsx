import Form from "../../components/form/Form"
import Navbar from "../../components/navbar/Navbar"

export default function Signup() {
    const form = {
        inputs: [
            { type: "text", name: "user_name", placeholder:"Username"},
            { type: "email", name: "user_mail", placeholder:"Email"},
            { type: "password", name: "user_password", placeholder: "Password" }
        ],
        conditions: true,
        title: "Sign Up",
        links: [
            {title:"You already have an account? Click here to log in.",to:"/login"},
        ],
        msg:"newUserSignUp"
    }

    return (
        <>
            <Navbar />
            <div className="cover">
                <Form {...form} />
            </div>
        </>
    )
}