import React, { useEffect, useState } from 'react'
import logo from '../../assets/logo/logo.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { logoutAdmin, deleteWarning, createWarning } from '../../actions/adminAction';
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import Moment from 'react-moment'
import Header from '../../components/Header'
import SideBar from '../../components/SideBar'
import PatientList from '../../components/PatientList'
import notify from '../../assets/notify/notify.mp3';
import { ToastContainer, toast } from 'react-toastify';


import io from "socket.io-client";



const Home = () => {

    document.title = 'Trang chủ';
    // const patientID = '633a5ae296527a92165c510d';
    const cates = [
        {
            'id': 1,
            'name': 'Danh sách bệnh nhân'
        },
        {
            'id': 2,
            'name': 'Thông báo'
        }

    ];
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [cateId, setCateId] = useState(1);
    const [adminInfor, setAdminInfor] = useState();
    const [patients, setPatients] = useState([]);
    const [warnings, setWarnings] = useState([]);
    const [modal, setModal] = useState(false);
    const [warning, setWarning] = useState({});
    const [detailPatient, setDetailPatient] = useState();
    // const [reWarnings, setReWarnings] = useState([]);

    // connect to server socket
    useEffect(() => {
        const socket = io.connect("http://localhost:5001");
        socket.on('send-web', (data) => {
            // document.querySelector('body').focus();
            console.log(data);
            handleAddWarning(data);
            playAudio();
        })
    }, [])

    const playAudio = () => {
        const audio = document.querySelector('#audio');
        audio.src = notify;
        audio.play();
        toast.warn("Có bệnh nhân ra khỏi khu vực");
    }


    useEffect(() => {
        setAdminInfor(localStorage.getItem('adminInfor'));
        (
            async () => {
                // Axios.defaults.headers.common['authorization'] = `Bearer ${JSON.parse(localStorage.getItem('adminInfor')).token}`;
                const { data } = await Axios.get('/api/patients'
                    ,
                    {
                        headers: {
                            authorization: `Bearer ${JSON.parse(localStorage.getItem('adminInfor')).token}`
                        }
                    }
                );
                setPatients(data);
            }
        )();
        (
            async () => {
                const { data } = await Axios.get('/api/warnings'
                    ,
                    {
                        headers: {
                            authorization: `Bearer ${JSON.parse(localStorage.getItem('adminInfor')).token}`
                        }
                    }
                );
                setWarnings(data.reverse());
                // setReWarnings(data.reverse());
            }
        )();
    }, []);


    useEffect(() => {

        if (!warning.patientID) return;
        const getPatient = async () => {
            const { data } = await Axios.get(`/api/patients/${warning.patientID}`);
            setDetailPatient(data);
        }
        getPatient();
    }, [warning]);


    // test add warning
    const handleAddWarning = async (patientID) => {
        dispatch(createWarning(patientID));
        // toast.warn('Có bệnh nhân ra khỏi khu vực');
        const { data } = await Axios.get('/api/warnings'
            ,
            {
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('adminInfor')).token}`
                }
            }
        );
        setWarnings(data.reverse());
    }

    const deleteHandler = (id) => async () => {

        dispatch(deleteWarning(id));
        const { data } = await Axios.get('/api/warnings'
            ,
            {
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('adminInfor')).token}`
                }
            }
        );
        setWarnings(data.reverse());
        // setReWarnings(data.reverse());
        // console.log(data);
    }


    const logoutHandler = (e) => {
        e.preventDefault();
        dispatch(logoutAdmin());
        navigate('/login');
    };

    const toggleModal = () => {
        setModal(!modal);
    }



    return (
        <div className="app">

            {/* <SideBar />
            <PatientList /> */}

            {/* <div className="header">
                <div className="header__left">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <div className="header__right">
                    <div className="header__right-icon">
                        <i class="fa-solid fa-user"></i>
                    </div>

                    <div className="header__right-text" onClick={logoutHandler}>
                        Đăng xuất
                    </div>

                </div>
            </div> */}
            <Header />
            <ToastContainer />
            <div className="main">
                <div className="grid wide">
                    <div className="grid__row app__content">
                        <div className="grid__column-2">
                            <audio id="audio" />

                            <ul className="grid__column-2-cate">
                                {
                                    cates.map((item, index) => (
                                        <li key={item.id}
                                            style={{ color: cateId === item.id ? '#fff' : '#333' }}
                                            onClick={() => setCateId(item.id)}
                                        >
                                            {item.name}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>



                        {
                            cateId === 1 ?
                                (<div className="grid__column-10">
                                    <ul className="grid__column-10-list onTop ">
                                        <li>STT</li>
                                        <li>Số Căn cước</li>
                                        <li>Họ tên</li>
                                        <li>Số điện thoại</li>
                                        <li>Địa chỉ</li>
                                    </ul>
                                    {
                                        patients.length > 0 &&
                                        (
                                            patients.map((patient, index) => (
                                                <ul key={index} className="grid__column-10-list">
                                                    <li>{index + 1}</li>
                                                    <li>{patient.cccd}</li>
                                                    <li>{patient.name}</li>
                                                    <li>{patient.phone}</li>
                                                    <li>{patient.address}</li>
                                                </ul>
                                            ))
                                        )
                                    }
                                </div>)
                                : (
                                    <div className="grid__column-10">
                                        <ul className="grid__column-10-list onTop ">
                                            <li>STT</li>
                                            <li>Ngày giờ</li>
                                            <li>Chức năng</li>

                                        </ul>
                                        {
                                            warnings.length > 0 &&
                                            (
                                                warnings.map((warning, index) => (
                                                    <ul key={index} className="grid__column-10-list">
                                                        <li>{index + 1}</li>
                                                        <li><Moment format='MMMM Do YYYY, h:mm:ss a'>{warning.dateTime}</Moment></li>
                                                        <li><span className="btn-func" onClick={() => {
                                                            toggleModal();
                                                            setWarning(warning)
                                                        }} >Thông tin chi tiết</span></li>
                                                        <li>
                                                            <span className="btn-func" onClick={deleteHandler(warning._id)}>
                                                                Xóa
                                                            </span>

                                                        </li>
                                                    </ul>
                                                ))
                                            )
                                        }
                                    </div>
                                )
                        }


                    </div>
                </div>
            </div>

            {
                modal && (
                    <div className="modal">
                        <div className="overlay">
                            <div className="modal-content">
                                <h2 className="modal__title">
                                    Thông tin bệnh nhân
                                </h2>
                                <div className="modal__infor">

                                    <ul className="modal__infor-left">
                                        <li>
                                            Số căn cước
                                        </li>
                                        <li>
                                            Họ tên
                                        </li>
                                        <li>
                                            Số điện thoại
                                        </li>
                                        <li>
                                            Địa chỉ
                                        </li>
                                    </ul>

                                    {
                                        detailPatient && (
                                            <ul className="modal__infor-right">

                                                <li>
                                                    {detailPatient.cccd}

                                                </li>
                                                <li>
                                                    {detailPatient.name}

                                                </li>
                                                <li>
                                                    {detailPatient.phone}

                                                </li>
                                                <li>
                                                    {detailPatient.address}

                                                </li>
                                            </ul>
                                        )
                                    }

                                </div>

                                <button className="close-modal" onClick={toggleModal}>
                                    X
                                </button>


                            </div>
                        </div>
                    </div>
                )
            }


        </div>
    )

}

export default Home;