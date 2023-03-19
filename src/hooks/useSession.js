import axios from "axios";
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useSession = () => {
    const navigate = useNavigate();
    const moderator = window.localStorage.getItem("moderator");

    /*** Add Story***/
    const [formData, setFormData] = useState({ story: '', description: '' });
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }
    const [showAddStory, setShowAddStory] = useState(false);
    const handleAddStoryClick = () => {
        if (!moderator) {
            toast.error('You don\'t have access');
        }
        else if (activeStoryRef.current) {
            toast.error('There\'s already active story');
        }
        else {
            setShowAddStory(!showAddStory);
        }
    }
    const handleFormSubmit = () => {
        if (!formData.story) {
            toast.error('Story field is required');
            return;
        }
        if (!formData.description) {
            toast.error('Story Description is required');
            return;
        }
        addStory();
        setFormData({});
    }
    const addStory = async () => {

        try {
            const response = await axios.post('http://127.0.0.1/poker_planning/addStory', {
                ...formData, session_id: sessionInfoRef.current.id
            });
            const data = response.data;
            if (data.success === 1) {
                toast.success(data.message);
                getStories(sessionInfoRef.current.id);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    /*** Add Story END ***/


    /*** Close Session ***/
    const closeSession = async () => {
        if (!moderator) {
            toast.error('You don\'t have access');
        }
        else {
            try {
                const response = await axios.put('http://127.0.0.1/poker_planning/closeSession', { session_id: sessionInfoRef.current.id });
                const data = response.data;
                if (data.success === 1) {
                    toast.success(data.message);
                    window.localStorage.removeItem("moderator");
                    navigate('/', { replace: true });
                }
                else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
    }
    /*** Close Session END ***/


    /*** Reveal Story Points ***/
    const revealStoryPoints = async () => {
        if (!moderator) {
            toast.error('You don\'t have access');
        }
        else if (!activeStoryRef.current) {
            toast.error('No active story');
        }
        else {
            try {
                await axios.put('http://127.0.0.1/poker_planning/revealStoryPoints',
                    { "story_id": activeStoryRef.current });
            }
            catch (error) {
                toast.error(error.message);
            }
        }
    }
    /*** Reveal Story Points END */


    /*** Reset Story Points ***/
    const resetStoryPoints = async () => {
        if (!moderator) {
            toast.error('You don\'t have access');
        }
        else if (!activeStoryRef.current) {
            toast.error('No active story');
        }
        else {
            try {
                const response = await axios.put('http://127.0.0.1/poker_planning/resetStoryPoints', { "story_id": activeStoryRef.current });
                const data = response.data;
                if (data.success === 1) {
                    toast.success(data.message);
                }
                else {
                    toast.error(data.message);
                }
            }
            catch (error) {
                toast.error(error.message);
            }
        }
    }
    /*** Reset Story Points END */


    /*** Invite Members */
    const inviteMembers = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url)
            .then(function () {
                alert("URL copied to clipboard");
            })
            .catch(function () {
                alert("Error copying URL to clipboard");
            });
    }
    /*** Invite Members END ***/


    /*** Join Session ***/
    const joinSession = async (user_id, session_id) => {
        try {
            const response = await axios.post('http://127.0.0.1/poker_planning/joinSession',
                { "user_id": user_id, "session_id": session_id });

            const data = response.data;
            if (data.success === 1) {
                toast.success(data.message);
                window.localStorage.setItem("member", true)
            }
            else {
                toast.error(data.message);
                navigate('/', { replace: true });
            }
        }
        catch (error) {
            toast.error(error.message);
            navigate('/', { replace: true });
        }
    }
    /*** Join Session END ***/


    /*** Get Stories ***/
    const [stories, setStories] = useState(null);
    const activeStoryRef = useRef(null);
    const getStories = async (id) => {
        try {
            const response = await axios.get("http://127.0.0.1/poker_planning/getStories",
                { params: { session_id: id } });
            const data = response.data;
            if (data.success === 1) {
                for (let i = 0; i < data.data.length; i++) {
                    if (data.data[i].status === 'active') {
                        activeStoryRef.current = data.data[i].id;
                        break;
                    }
                    activeStoryRef.current = null;
                }
                setStories(data.data);

            }
        }
        catch (error) {
            toast.error(error.message);
        }
    }
    /*** Get Stories END ***/


    /*** Get Participants ***/
    const [participants, setParticipants] = useState(null);
    const [showParticipants, setShowParticipants] = useState(false);
    const handleParticipantsButtonClick = () => {
        setShowParticipants(!showParticipants);
    }
    const getParticipants = async (id) => {
        try {
            const response = await axios.get('http://127.0.0.1/poker_planning/getParticipants',
                { params: { session_id: id } });

            const data = response.data;
            if (data.success === 1) {
                setParticipants(data.data);
            }
            else {
                toast.error('Couldn\'t get participants');
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    /*** Get Participants END ***/


    /*** Accept Story Points ***/
    const acceptStoryPoints = async () => {
        if (!moderator) {
            toast.error('You don\'t have access');
        }
        else if (!activeStoryRef.current) {
            toast.error('No active story');
        }
        else {
            try {
                const response = await axios.put('http://127.0.0.1/poker_planning/acceptStory', {
                    "session_id": sessionInfoRef.current.id,
                    "story_id": activeStoryRef.current
                });
                const data = response.data;
                if (data.success === 1) {
                    toast.success(data.message);
                    activeStoryRef.current = null;
                    setStoryPoints(null);
                }
            }
            catch (error) {
                toast.error(error.message);
            }
        }
    }
    /*** Accept Story Points END */


    /*** Vote Story Points ***/
    const voteStoryPoints = async (user_id, points) => {
        if (!activeStoryRef.current) {
            toast.error('No active story');
        }
        else {
            try {
                const response = await axios.post('http://127.0.0.1/poker_planning/voteStoryPoints',
                    {
                        "story_id": activeStoryRef.current,
                        "user_id": user_id,
                        "story_points": points
                    });
                const data = response.data;
                if (data.success === 1) {
                    toast.success(data.message);
                }
                else {
                    toast.error(data.message);
                }
            }
            catch (error) {
                toast.error(error.message);
            }
        }
    }
    /*** Vote Story Points END ***/


    /*** Get Story Points of active story***/
    const [storyPoints, setStoryPoints] = useState(null);
    const getStoryPoints = async () => {
        if (activeStoryRef.current) {
            try {
                const response = await axios.get('http://127.0.0.1/poker_planning/getStoryPoints',
                    { params: { story_id: activeStoryRef.current } });
                const data = response.data;
                if (data.success === 1) {
                    setStoryPoints(data.data);
                }
                else {
                    setStoryPoints(null);
                }
            }
            catch (error) {
                toast.error(error.message);
            }
        }
        else {
            setStoryPoints(null);
        }
    }
    /*** Get Story Points ***/


    /*** Get Session Info ***/
    const sessionInfoRef = useRef(null);
    const getSessionInfo = async (id) => {
        try {
            const response = await axios.get('http://127.0.0.1/poker_planning/getSessionInfo', { params: { id: id } });
            const data = response.data;
            if (data.success === 1) {
                sessionInfoRef.current = data.data;
            }
            else {
                toast.error(data.message);
                navigate('/', { replace: true });
            }
        }
        catch (error) {
            toast.error(error.message);
            navigate('/', { replace: true });
        }
    };
    /*** Get Session Info END ***/

    return {
        storyPoints, getStoryPoints, acceptStoryPoints, voteStoryPoints, getStories, joinSession,
        inviteMembers, stories, showParticipants, handleParticipantsButtonClick,
        onInputChange, handleFormSubmit, showAddStory, handleAddStoryClick, formData, closeSession,
        revealStoryPoints, resetStoryPoints, getParticipants, participants, activeStoryRef, sessionInfoRef, getSessionInfo
    };
}
export { useSession };