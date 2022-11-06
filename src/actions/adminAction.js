import Axios from 'axios';
import { ADMIN_LOGIN_REQUEST, ADMIN_LOGIN_SUCCESS, ADMIN_LOGIN_FAIL, ADMIN_LOGOUT } from '../constants/adminConstants'

export const loginAdmin = (email, password) => async (dispatch) => {
    dispatch({ type: ADMIN_LOGIN_REQUEST, payload: { email, password } });
    try {
        const { data } = await Axios.post('/api/admin/login', { email, password });
        dispatch({ type: ADMIN_LOGIN_SUCCESS, payload: data });
        // console.log('action: ', data);
        // Axios.defaults.headers.common['authorization'] = `Bearer ${data.token}`;
        localStorage.setItem('adminInfor', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: ADMIN_LOGIN_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const logoutAdmin = () => (dispatch) => {
    localStorage.removeItem('adminInfor');
    dispatch({ type: ADMIN_LOGOUT });
};

export const deleteWarning = (id) => async (dispatch) => {
    try {
        await Axios.delete(`/api/warnings/delete/${id}`);
    } catch (error) {
        console.log(error);
    }
}

export const createWarning = (patientID) => async (dispatch) => {
    try {
        await Axios.post('/api/warnings/create', { patientID: patientID });
    } catch (error) {
        console.log(error);
    }
}