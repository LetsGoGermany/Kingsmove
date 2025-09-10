import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
//import { StrictMode } from "react"

import Home from "./pages/home/Home"
import LogIn from "./pages/login/Login"
import Signup from "./pages/signup/Signup"
import LandingPage from "./pages/landing-page/Landing"
import LogOut from "./pages/logout/Logout"

import "./style/App.css";  // <- globale Styles hier laden

const router = createBrowserRouter([
  {path:"/", element:<Home />},
  {path:"/login", element: <LogIn />},
  {path:"*", element: <LandingPage />},
  {path: "/signup",element: <Signup />},
  {path:"/logout", element: <LogOut />},
])

createRoot(document.getElementById("root")).render(
    <RouterProvider router={router}/>
)
