import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginAdmin } from '../../actions/adminAction'
import { useNavigate } from "react-router-dom";


// import LoadingBox from 'components/LoadingBox';

const Login = (props) => {
    document.title = "Đăng Nhập";
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');



    const dispatch = useDispatch();

    const adminLogin = useSelector((state) => state.adminLogin);
    const { adminInfor, loading, error } = adminLogin;



    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(loginAdmin(email, password));
    };

    useEffect(() => {
        if (typeof (error) === 'string') {
            toast.warn(error);
        }
        if (adminInfor) {
            navigate('/');
        }
    }, [error, adminInfor])

    return (

        <div className="login">

            <form className="form" onSubmit={submitHandler}>

                {/* <div className="home-back">
                    <Link to="/">
                        <i className="fas fa-home home-back__icon"></i>
                    </Link>
                </div> */}

                <div className="form__item">
                    <h1 className="form__item__title">Đăng nhập</h1>
                </div>


                <div className="form__item">
                    <label htmlFor="email" className="form__item__label">Email</label>
                    <input className="form__item__input" type="email" id="email" placeholder="Email" required
                        onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="form__item">
                    <label htmlFor="password" className="form__item__label">Mật khẩu</label>
                    <input className="form__item__input" type="password" id="password" placeholder="Nhập mật khẩu" required
                        onChange={e => setPassword(e.target.value)} />
                </div>

                <div className="form__item btn">
                    <button type="submit" className="form__item__submit">Đăng nhập</button>
                    <ToastContainer />
                </div>
            </form>
        </div>

    )
}

export default Login
