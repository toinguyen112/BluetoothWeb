import React, { useState } from 'react'
import { Link } from 'react-router-dom'





const SideBar = () => {
    const [active, setActive] = useState('home');
    return (
        // <div className="grid__column-2">

        //     <ul className="grid__column-2-cate">
        //         <link to='/'>
        //             <li className={`${active} === 'home' ? 'active' : ''`} onClick={() => setActive('home')}>
        //                 Danh sách bệnh nhân
        //             </li>
        //         </link>
        //         <link to='/notify'>
        //             <li className={`${active} === 'notify' ? 'active' : ''`} onClick={() => setActive('notify')}>
        //                 Thông báo
        //             </li>
        //         </link>

        //     </ul>
        // </div>
        <div className="sidebar">
            <ul className="sidebar__list">
                <Link to="/">
                    <li className="sidebar__list-item">
                        Danh sách bệnh nhân
                    </li>
                </Link>
                <Link to="notify">
                    <li className="sidebar__list-item">
                        Thông báo
                    </li>
                </Link>
            </ul>
        </div>

        // <div className="sidebar">
        //     <ul className="sidebar__list">
        //         <link to='/'>
        //             <li className={`sidebar__list-item ${active} === 'home' ? 'active' : ''`} onClick={() => setActive('home')}>
        //                 Danh sách bệnh nhân
        //             </li>
        //         </link>
        //         <link to='/notify'>
        //             <li className={`sidebar__list-item ${active} === 'notify' ? 'active' : ''`} onClick={() => setActive('notify')}>
        //                 Thông báo
        //             </li>
        //         </link>
        //     </ul>
        // </div>
    )
}

export default SideBar