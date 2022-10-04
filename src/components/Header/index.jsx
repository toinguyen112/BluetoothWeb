import React, { useEffect, useState } from 'react'
import logo from '../../assets/logo/logo.jpg'
import { logoutAdmin } from '../../actions/adminAction';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';


const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [admin, setAdmin] = useState();

    const logoutHandler = (e) => {
        e.preventDefault();
        dispatch(logoutAdmin());
        navigate('/login');
    };

    useEffect(() => {
        setAdmin(localStorage.getItem('adminInfor'));
    }, [])

    return (
        <div className="header">
            <div className="header__left">
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className="header__right">
                <div className="header__right-icon">
                    <i class="fa-solid fa-user"></i>
                </div>

                <div className="header__right-text" onClick={logoutHandler}>
                    {
                        admin ? 'Đăng xuất' : 'Đăng nhập'
                    }
                </div>

            </div>
        </div>
    )
}

export default Header