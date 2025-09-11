import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
//import { StrictMode } from "react"

import Home from "./pages/home/Home"
import LogIn from "./pages/login/Login"
import Signup from "./pages/signup/Signup"
import LandingPage from "./pages/landing-page/Landing"
import LogOut from "./pages/logout/Logout"
import History from "./pages/history/History"
import "./style/App.css";  // <- globale Styles hier laden

const router = createBrowserRouter([
  {path:"/", element:<Home />, errorElement: <div>Error in ln 42 :/ ln 42: *blank*</div>},
  {path:"/login", element: <LogIn />, errorElement: <div>Error in ln 42 :/ ln 42: *blank*</div>},
  {path:"*", element: <LandingPage />, errorElement: <div>Error in ln 42 :/ ln 42: *blank*</div>},
  {path: "/signup",element: <Signup />, errorElement: <div>Error in ln 42 :/ ln 42: *blank*</div>},
  {path:"/logout", element: <LogOut />, errorElement: <div>Error in ln 42 :/ ln 42: *blank*</div>},
  {path:"/game-history",element: <History />, errorElement: <div>Error in ln 42 :/ ln 42: *blank*</div>},
])

createRoot(document.getElementById("root")).render(
    <RouterProvider router={router}/>
)
