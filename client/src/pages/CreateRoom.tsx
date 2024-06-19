import { useNavigate } from 'react-router-dom';
import { v1 as uuid } from 'uuid';

const CreateRoom = () => {
    const nav = useNavigate();
    function create() {
        const id = uuid();
        nav(`/room/${id}`);
    }

    return <button onClick={create}>Create room</button>;
};

export default CreateRoom;
