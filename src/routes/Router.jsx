import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Header from '../components/Header/index.jsx'
import Home from '../screens/Home/Home.jsx'
import Login from '../screens/Login/Login.jsx'
import Notify from '../screens/Notify'


const Router = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/notify" element={<Notify />}></Route>
            </Routes>
        </BrowserRouter>
    )
}


export default Router;