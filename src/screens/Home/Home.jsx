import React, { useEffect, useState } from 'react'
import logo from '../../assets/logo/logo.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { logoutAdmin, deleteWarning, createWarning, deletePatient } from '../../actions/adminAction';
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
    const [modalAdd, setModalAdd] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [warning, setWarning] = useState({});
    const [detailPatient, setDetailPatient] = useState();
    // add patient
    const [cccd, setCccd] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState();
    const [address, setAddress] = useState('');
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
        toast.success("Xóa thông báo thành công");
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

    const deletePatientHandler = (id) => async () => {
        // console.log(id);
        dispatch(deletePatient(id));
        toast.success("Xóa bệnh nhân thành công");
        // await Axios.delete(`/api/patients/delete/${id}`);
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

    // add patient

    const addBtnPressed = () => async () => {

        if (!cccd.trim() || !password.trim() || !name.trim() || !phone.trim() || !address.trim()) {
            toast.warn("Cần nhập đầy đủ thông tin !")
        }
        else {
            // const addPatient = () => {
            await Axios.post(`/api/patients/register`, { cccd, password, name, phone, address })
                .then(res => {
                    const patientInfo = res.data;
                    toggleModalAdd();
                    toast.success("Thêm bệnh nhân thành công");

                })
                .catch(e => {
                    // console.log('register error: ' + e);
                    toast.warn("Số căn cước đã được đăn ký !");
                });
            // }
            // addPatient();

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
    }

    // edit patient
    const [editPatient, setEditPatient] = useState({});
    const [cccdEdit, setCccdEdit] = useState('');
    const [nameEdit, setNameEdit] = useState('');
    const [phoneEdit, setPhoneEdit] = useState('');
    const [addressEdit, setAddressEdit] = useState('');
    const [idEdit, setIdEdit] = useState('');



    const handleEditPatient = (id) => {
        if (!id) return;
        const getPatient = async () => {
            const { data } = await Axios.get(`/api/patients/${id}`);
            // setEditPatient(data);
            setCccdEdit(data.cccd);
            setNameEdit(data.name);
            setPhoneEdit(data.phone);
            setAddressEdit(data.address);
            setIdEdit(data._id);
        }
        getPatient();
    }

    const editBtnPressed = () => {
        console.log('edit');
        const editHandler = async () => {
            const { data } = await Axios.put('/api/patients/edit', { id: idEdit, cccd: cccdEdit, name: nameEdit, phone: phoneEdit, address: addressEdit });
            if (data) {

                toast.success('Chỉnh sửa thành công');
            }
        }
        editHandler();
        toggleModalEdit();
    }



    const logoutHandler = (e) => {
        e.preventDefault();
        dispatch(logoutAdmin());
        navigate('/login');
    };

    // modal warning infor
    const toggleModal = () => {
        setModal(!modal);
    }
    // modal add patient
    const toggleModalAdd = () => {
        setModalAdd(!modalAdd);
    }

    const toggleModalEdit = () => {
        setModalEdit(!modalEdit);
    }



    // search 

    const [filterData, setFilterData] = useState([]);
    const [nameSearch, setNameSearch] = useState('');
    const [warningByName, setWarningByName] = useState([]);

    const handleNameSearch = (e) => {
        const searchWord = e.target.value;
        setNameSearch(searchWord);
        const nameFilter = patients.filter((patient) => {
            return patient.name.toLowerCase().includes(searchWord.toLowerCase());
        });
        if (searchWord === '') {
            setFilterData([]);
        }
        else {
            setFilterData(nameFilter);
        }
    }

    const clearInput = () => {
        setNameSearch('');
        setFilterData([]);

    }

    const searchWarningByName = (id) => {
        clearInput();
        const filter = warnings.filter((warning) => {
            return warning.patientID.includes(id);
        })
        if (filter.length !== 0) {
            setWarningByName(filter);
            // setWarnings(filter);
        } else {
            // 
            toast.warn("Không có thông báo từ bệnh nhân");
            // console.log('Không tìm thấy');
        }
    }

    const deleteHandlerInSearch = (id, index) => async () => {
        dispatch(deleteWarning(id));
        toast.success("Xóa thông báo thành công");
        setWarningByName(warningByName.filter(item => item._id !== id));
    }

    // search by name in patient list

    const [filterNameData, setFilterNameData] = useState([]);
    const [wordNameEntered, setWordNameEntered] = useState("");

    const handleNameFilter = (e) => {
        const searchWord = e.target.value;
        setWordNameEntered(searchWord);
        const newFilter = patients.filter((patient) => {
            return patient.name.toLowerCase().includes(searchWord.toLowerCase());
        });
        if (searchWord === "") {
            setFilterNameData([]);
        } else {
            setFilterNameData(newFilter);
            console.log(newFilter);
        }
    };

    const clearNameListInput = () => {
        setFilterNameData([]);
        setWordNameEntered("");
    };
    const [filterNameList, setFilterNameList] = useState([]);

    const searchByNameList = (id) => {
        clearNameListInput();
        const filter = patients.filter((patient) => {
            return patient._id.includes(id);
        });

        if (filter.length === 0) {
            setFilterNameList([]);
        } else {
            setFilterNameList(filter);
        }
    };

    // search by address in patient list

    const [filterAddressData, setFilterAddressData] = useState([]);
    const [wordAddressEntered, setWordAddressEntered] = useState("");

    const handleAddressFilter = (e) => {
        const searchWord = e.target.value;
        setWordAddressEntered(searchWord);
        const newFilter = patients.filter((patient) => {
            return patient.address.toLowerCase().includes(searchWord.toLowerCase());
        });
        if (searchWord === "") {
            setFilterAddressData([]);
        } else {
            setFilterAddressData(newFilter);
        }
    };

    const clearAddressInput = () => {
        setFilterAddressData([]);
        setWordAddressEntered("");
    };
    const [filterAddress, setFilterAddress] = useState([]);

    const searchByAddress = (address) => {
        clearAddressInput();
        const filter = patients.filter((patient) => {
            return patient.address.includes(address);
        });

        if (filter.length === 0) {
            setFilterAddress([]);
            console.log("Không tìm thấy");
        } else {
            setFilterAddress(filter);
            console.log(filter);
        }
    };



    return (
        <div className="app">
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
                                    <div className='search-warning grid__column-10-list'>
                                        <input
                                            type="text"
                                            className="search-input"
                                            placeholder="Nhập tên bệnh nhân"
                                            onChange={handleNameFilter}
                                            value={wordNameEntered}
                                        />
                                        <input
                                            type="text"
                                            className="search-input"
                                            placeholder="Nhập địa chỉ"
                                            onChange={handleAddressFilter}
                                            value={wordAddressEntered}
                                        />
                                        <span className="addBtn" onClick={() => { toggleModalAdd() }}>Thêm bệnh nhân</span>
                                    </div>
                                    {
                                        filterNameData.length !== 0 && (
                                            <div className="search-result">
                                                {
                                                    filterNameData.map((data, index) => (
                                                        <div key={index} className="search-result-name" onClick={() => searchByNameList(data._id)}>
                                                            {data.name}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                    {
                                        filterAddressData.length !== 0 && (
                                            <div className="search-result">
                                                {

                                                    <div className="search-result-name" onClick={() => searchByAddress(filterAddressData[0].address)}>
                                                        {filterAddressData[0].address}
                                                    </div>

                                                }
                                            </div>
                                        )
                                    }
                                    <ul className="grid__column-10-list onTop ">
                                        <li>STT</li>
                                        <li>Số Căn cước</li>
                                        <li>Họ tên</li>
                                        <li>Số điện thoại</li>
                                        <li>Địa chỉ</li>
                                        <li>Chức năng</li>
                                    </ul>
                                    {filterAddress.length > 0
                                        ? filterAddress.map((patient, index) => (
                                            <ul key={index} className="grid__column-10-list">
                                                <li>{index + 1}</li>
                                                <li>{patient.cccd}</li>
                                                <li>{patient.name}</li>
                                                <li>{patient.phone}</li>
                                                <li>{patient.address}</li>
                                            </ul>
                                        ))
                                        : filterNameList.length > 0
                                            ? filterNameList.map((patient, index) => (
                                                <ul key={index} className="grid__column-10-list">
                                                    <li>{index + 1}</li>
                                                    <li>{patient.cccd}</li>
                                                    <li>{patient.name}</li>
                                                    <li>{patient.phone}</li>
                                                    <li>{patient.address}</li>
                                                </ul>
                                            ))
                                            : patients.map((patient, index) => (
                                                <ul key={index} className="grid__column-10-list">
                                                    <li>{index + 1}</li>
                                                    <li>{patient.cccd}</li>
                                                    <li>{patient.name}</li>
                                                    <li>{patient.phone}</li>
                                                    <li>{patient.address}</li>
                                                    <li>
                                                        <span className="btn-func" onClick={() => {
                                                            toggleModalEdit();
                                                            handleEditPatient(patient._id)
                                                        }}>
                                                            Sửa
                                                        </span>
                                                        <span className="btn-func" onClick={deletePatientHandler(patient._id)}>
                                                            Xóa
                                                        </span>
                                                    </li>
                                                </ul>
                                            ))}
                                    {/* {
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
                                    } */}
                                </div>)
                                : (
                                    <div className="grid__column-10">
                                        <div className='search-warning grid__column-10-list'>
                                            <input
                                                type="text"
                                                className="search-input"
                                                placeholder="Nhập tên bệnh nhân"
                                                onChange={handleNameSearch}
                                                value={nameSearch}
                                            />
                                        </div>
                                        {
                                            filterData.length !== 0 && (
                                                <div className="search-result">
                                                    {
                                                        filterData.map((data, index) => (
                                                            <div key={index} className="search-result-name" onClick={() => searchWarningByName(data._id)}>
                                                                {data.name}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                        <ul className="grid__column-10-list onTop ">
                                            <li>STT</li>
                                            <li>Ngày giờ</li>
                                            <li>Chức năng</li>
                                        </ul>
                                        {
                                            warningByName.length !== 0 ?
                                                (
                                                    warningByName.map((warning, index) => (
                                                        <ul key={index} className="grid__column-10-list">
                                                            <li>{index + 1}</li>
                                                            <li><Moment format='MMMM Do YYYY, h:mm:ss a'>{warning.dateTime}</Moment></li>
                                                            <li><span className="btn-func" onClick={() => {
                                                                toggleModal();
                                                                setWarning(warning)
                                                            }} >Thông tin chi tiết</span></li>
                                                            <li>
                                                                <span className="btn-func" onClick={deleteHandlerInSearch(warning._id, index)}>
                                                                    Xóa
                                                                </span>

                                                            </li>
                                                        </ul>
                                                    ))
                                                )
                                                :
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

            {/* modal warning infor */}
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

            {/* Modal add patient */}

            {
                modalAdd && (
                    <div className="modal">
                        <div className="overlay">
                            <div className="modal-content">
                                <h2 className="modal__title">
                                    Thêm bệnh nhân
                                </h2>
                                <div className="modal__infor">

                                    <ul className="modal__infor-left left-add">
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
                                        <li>
                                            Mật khẩu
                                        </li>
                                    </ul>

                                    <ul className="modal__infor-right">

                                        <li>
                                            <input type="text" placeholder="Số căn cước" value={cccd} onChange={(e) => setCccd(e.target.value)} />
                                        </li>
                                        <li>
                                            <input type="text" placeholder="Họ tên" value={name} onChange={(e) => setName(e.target.value)} />

                                        </li>
                                        <li>
                                            <input type="text" placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />

                                        </li>
                                        <li>
                                            <input type="text" placeholder="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} />
                                        </li>
                                        <li>
                                            <input type="text" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </li>
                                    </ul>
                                </div>

                                <button className="addBtn addBtnm" onClick={addBtnPressed()}>
                                    Thêm
                                </button>

                                <button className="close-modal" onClick={toggleModalAdd}>
                                    X
                                </button>


                            </div>
                        </div>
                    </div>
                )
            }


            {/* Modal edit patient */}

            {
                modalEdit && (
                    <div className="modal">
                        <div className="overlay">
                            <div className="modal-content">
                                <h2 className="modal__title">
                                    Chỉnh sửa thông tin
                                </h2>
                                <div className="modal__infor">

                                    <ul className="modal__infor-left left-add">
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
                                        cccdEdit !== '' && (
                                            <ul className="modal__infor-right">

                                                <li>
                                                    <input type="text" placeholder="Số căn cước" value={cccdEdit} onChange={(e) => setCccdEdit(e.target.value)} />
                                                </li>
                                                <li>
                                                    <input type="text" placeholder="Họ tên" value={nameEdit} onChange={(e) => setNameEdit(e.target.value)} />

                                                </li>
                                                <li>
                                                    <input type="text" placeholder="Số điện thoại" value={phoneEdit} onChange={(e) => setPhoneEdit(e.target.value)} />

                                                </li>
                                                <li>
                                                    <input type="text" placeholder="Địa chỉ" value={addressEdit} onChange={(e) => setAddressEdit(e.target.value)} />
                                                </li>

                                            </ul>
                                        )
                                    }


                                </div>

                                <button className="addBtn addBtnm" onClick={editBtnPressed}>
                                    Lưu
                                </button>

                                <button className="close-modal" onClick={toggleModalEdit}>
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