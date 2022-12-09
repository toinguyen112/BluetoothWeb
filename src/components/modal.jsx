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


