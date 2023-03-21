import './SessionPage.scss';

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { useLogout } from '../../hooks/useLogout';
import { useSession } from '../../hooks/useSession';
import Modal from '../../components/Modal/Modal';
import InputField from '../../components/InputField/InputField';
import Textarea from '../../components/Textarea/Textarea';
import Card from '../../components/Card/Card';
import { toast } from 'react-toastify';

const SessionPage = () => {

    /*** Get session id from url */
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    let id = queryParams.get('id');
    /***Get session id END ***/

    const navigate = useNavigate();

    /*** useSession Hook */
    const { activeStoryRef, sessionInfoRef, voteStoryPoints, acceptStoryPoints, getStories,
        inviteMembers, stories, joinSession, participants,
        showParticipants, handleParticipantsButtonClick, getParticipants, onInputChange,
        handleFormSubmit, showAddStory, handleAddStoryClick, formData, formErrors, resetStoryPoints,
        revealStoryPoints, closeSession, storyPoints, getStoryPoints, getSessionInfo } = useSession();
    /*** useSession Hook END ***/

    const user = JSON.parse(window.localStorage.getItem("user"));
    const moderator = window.localStorage.getItem("moderator");


    const { logout } = useLogout();


    const [activeCard, setActiveCard] = useState(null);
    const onCardSelect = (e) => {
        setActiveCard(e.target.id);
        voteStoryPoints(user.id, e.target.id);
    }

    // run at the start
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        else {
            if (!moderator) {
                joinSession(user.id, id);
            }
            getSessionInfo(id);
            getParticipants(id);
            getStories(id);
            const interval = setInterval(() => {
                getSessionInfo(id);
                getParticipants(id);
                getStories(id);
                getStoryPoints();
                if (sessionInfoRef.current?.status == 'closed') {
                    toast.error('Session is closed by the moderator');
                    navigate('/', { replace: true });
                }
            }, 5000);
            return () => clearInterval(interval);
        }
    }, []);


    return (
        <>

            {user && <div className='session'>
                <Header title={sessionInfoRef.current?.name} handleLogout={logout} user={user} >
                    <div className="session__participantsContainer">
                        <button onClick={handleParticipantsButtonClick} className='session__participantsContainer__button' >
                            <i className="icon-groups"></i>
                            <span>{participants?.length}</span>
                        </button>
                        {showParticipants && <ParticipantsList participants={participants} />}
                    </div>
                </Header>

                <div className="session__body">

                    <SessionActions inviteMembers={inviteMembers} resetStoryPoints={resetStoryPoints} revealStoryPoints={revealStoryPoints} closeSession={closeSession} />

                    <SessionMain activeStory={activeStoryRef.current} activeCard={activeCard} onCardSelect={onCardSelect} storyList={stories} storyPoints={storyPoints} voteStoryPoints={voteStoryPoints} user_id={user.id} />

                    <SessionStoryboard resetStoryPoints={resetStoryPoints} acceptStoryPoints={acceptStoryPoints} storyList={stories} user_id={user.id} showAddStory={showAddStory} handleAddStoryClick={handleAddStoryClick} onInputChange={onInputChange} formData={formData} handleFormSubmit={handleFormSubmit} formErrors={formErrors} />
                </div>
            </div>}
        </>
    )
}

export default SessionPage;

/*** Participants List ***/
const ParticipantsList = ({ participants }) => {
    return (
        <div className='participants'>
            {participants?.map((participant) => <div key={participant.id} >{participant.name}</div>)}
        </div>
    )
}
/*** Participants List END ***/


/*** Session Actions ***/
const SessionActions = ({ inviteMembers, revealStoryPoints, resetStoryPoints, closeSession }) => {
    return (
        <div className="session__actions">
            <button className='session__actions__button' onClick={inviteMembers} ><i className="icon-person-add"></i>Invite</button>
            <button className='session__actions__button' onClick={resetStoryPoints} ><i className="icon-reset"></i>Reset</button>
            <button className='session__actions__button' onClick={revealStoryPoints}><i className="icon-visibility-on"></i>Reveal</button>
            <button className='session__actions__button' onClick={closeSession} ><i className="icon-close"></i>Close</button>
        </div>
    );
}
/*** Session Actions END ***/


/*** Session Main Section */
const SessionMain = ({ storyPoints, storyList, activeCard, onCardSelect, activeStory }) => {

    const cards = [
        { value: '0' },
        { value: '1' },
        { value: '2' },
        { value: '3' },
        { value: '5' },
        { value: '8' },
        { value: '13' },
        { value: '20' },
        { value: '40' },
        { value: '100' },
    ];

    const activeStoryObject = storyList?.find(story => story.id === activeStory);

    return (
        <div className="session__main">
            <div className="session__main__membersPointCards">
                {activeStory && storyPoints?.map((point) => <div className='membersPointCard' key={point.id}>
                    <Card value={activeStoryObject?.reveal != 0 ? point.points : null} />
                    <p>{point.name}</p>
                </div>)}
            </div>
            <div className="session__main__pointCards">
                {cards.map((card) => <Card key={card.value} value={card.value} selected={activeCard == card.value ? true : false} onClick={onCardSelect} />)}
            </div>
        </div>
    );
}
/*** Session Main Section END ***/


/*** Storyboard Section ***/
const SessionStoryboard = ({ resetStoryPoints, acceptStoryPoints, storyList, showAddStory, handleAddStoryClick, onInputChange, formData, handleFormSubmit, formErrors }) => {

    const [showStoryModal, setShowStoryModal] = useState(false);
    const [activeStory, setActiveStory] = useState({});
    const onStoryClick = (id) => {
        setActiveStory(storyList.find(story => story.id == id));
        setShowStoryModal(true);
    }

    const onStoryModalClose = () => {
        setShowStoryModal(false);
    }

    return (
        <div className="session__storyboardContainer">
            <div className="storyboard__stories">
                <p className="storyboard__title">Story Board</p>
                <table className='storyTable' >
                    <thead className='storyTable__head'>
                        <tr>
                            <th>#</th>
                            <th>Story</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody className='storyTable__body'>
                        {storyList && storyList.map((story) => <tr data={story} onClick={() => {
                            onStoryClick(story.id);
                        }} key={story.id} className={story.status === 'active' ? 'active' : 'closed'}>
                            <td>{storyList.indexOf(story) + 1}</td>
                            <td >{story.name}</td>
                            <td>{story.reveal != 0 ? story.average_points : '-'}</td>
                        </tr>)}
                    </tbody>
                </table>
                {showStoryModal && <Modal handleClose={onStoryModalClose} show={showStoryModal} >
                    <div className="storyModal">
                        <p className="storyModal__title">Story Details</p>
                        <InputField label={'Story'} value={activeStory.name} type={'text'} name={'story'} disabled={true} />
                        <Textarea label={'Description'} name={'description'} readonly={true} value={activeStory.description} disabled={true} />
                    </div>
                </Modal>}
            </div>
            <div className="storyboard__actions">
                <div className="storyboard__actions__storyActions">
                    <button className='button button--accept' onClick={acceptStoryPoints} ><i className="icon-accept"></i></button>
                    <button className='button button--reject' onClick={resetStoryPoints} ><i className="icon-reject"></i></button>
                </div>
                <button className="storyboard__actions__addStory" onClick={handleAddStoryClick} >Add Story<i className="icon-add-task"></i></button>

                {showAddStory && <Modal handleClose={handleAddStoryClick} show={showAddStory} >
                    <form className="addStoryForm">
                        <p className="addStoryForm__title">Add New Story</p>
                        <InputField errorMessage={formErrors.story} label={'Story'} onChange={onInputChange} value={formData.name} type={'text'} name={'story'} placeholder={'Story'} required={true} />
                        <Textarea errorMessage={formErrors.description} label={'Description'} name={'description'} placeholder={'Story Description'} value={formData.description} onChange={onInputChange} required={true} />
                        <button className="addStoryForm__button" type='button' onClick={handleFormSubmit} >Add</button>
                    </form>
                </Modal>}

            </div>
        </div>
    );
}
/*** Storyboard Section END */
