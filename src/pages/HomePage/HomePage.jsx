import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../../components/Header/Header';
import InputField from '../../components/InputField/InputField';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Modal from '../../components/Modal/Modal';
import NoDataFound from '../../components/NoDataFound/NoDataFound';
import SessionTile from '../../components/SessionTile/SessionTile';
import Textarea from '../../components/Textarea/Textarea';
import { useLogout } from '../../hooks/useLogout';

import './HomePage.scss';

const HomePage = () => {

    const navigate = useNavigate();
    const user = JSON.parse(window.localStorage.getItem("user"));
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [sessions, setSessions] = useState(null);
    const { logout } = useLogout();

    const handleCreateSessionButtonClick = () => {
        document.body.style.overflow = 'unset';
        setShowCreateSessionModal(!showCreateSessionModal);
    }


    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    useEffect(() => {
        if (!user) {
            navigate('/login', { replace: true });
        }
        else {
            setLoading(true);
            fetchSessions().then(() => {
                setLoading(false);
            });
            const interval = setInterval(fetchSessions, 5000);
            return () => clearInterval(interval);
        }
    }, []);

    /**
     * Fetch past sessions
     */
    const fetchSessions = async () => {
        try {
            const response = await axios.get('http://127.0.0.1/poker_planning/getSessions', { params: { user_id: user.id } });
            const data = response.data;
            if (data.success === 1) {
                setSessions(data.data);
            }
            else {
                setSessions(null);
            }

        } catch (error) {
            toast.error(error.message);
        }
        finally {
            // setLoading(false);
        }
    }

    /**
     * Handle form submit
     */
    const handleFormSubmit = () => {
        let errors = {};
        if (!formData.name) {
            errors.name = 'Session name is required';
        }
        if (!formData.description) {
            errors.description = 'Session description is requierd';
        }
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }
        else {
            setFormErrors({});
            createSession();
        }
    }

    /**
     * create a new session
     */
    const createSession = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1/poker_planning/create_session', { ...formData, user_id: user.id });
            const data = response.data;
            if (data.success === 1) {
                toast.success(data.message);
                window.localStorage.setItem("moderator", true);
                navigate(`/session/?id=${data.data.id}`);
            }
            else {
                toast.error(data.message);
            }
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            {user && <div className='home'>

                <Header title={'Poker Planning'} user={user} handleLogout={logout} >
                    <button className="home__sessionButton" onClick={handleCreateSessionButtonClick}>Create Session <i className="icon-add-task"></i></button>
                    {showCreateSessionModal && <Modal handleClose={handleCreateSessionButtonClick} show={showCreateSessionModal}>
                        <form className="sessionForm">
                            <p className="sessionForm__title">Create Session</p>

                            <InputField errorMessage={formErrors.name} label={'Name'} onChange={onInputChange} value={formData.name} type={'text'} name={'name'} placeholder={'Session Name'} required={true} />
                            <Textarea errorMessage={formErrors.description} label={'Description'} name={'description'} placeholder={'Session Description'} value={formData.description} onChange={onInputChange} required={true} />
                            {loading ? <LoadingSpinner /> : <button className="sessionForm__submitButton" type='button' onClick={handleFormSubmit} >Create</button>}
                        </form>
                    </Modal>}
                </Header>

                <div className="home__history">
                    <p className="home__history__title">History</p>
                    {loading && <LoadingSpinner />}
                    {!loading && sessions && sessions.map((session) => < SessionTile name={session.name} key={session.id} description={session.description} date={formatDate(session.created_at)} />)}
                    {!loading && !sessions && <NoDataFound message={'No Past Sessions'} />}
                </div>
            </div>}
        </>
    )
}

export default HomePage;

const formatDate = (date) => {
    const t = date.split(/[- :]/);
    const d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
    return d.toDateString();
}
