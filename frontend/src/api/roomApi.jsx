import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_URL = 'http://localhost:5000/api/rooms';

const getToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return await user.getIdToken();
};

export const createRoom = async (repoId) => {
  const token = await getToken();
  const user = getAuth().currentUser;
  const res = await axios.post(`${API_URL}/create`, {
    repoId,
    userId: user.uid
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.room;
};

export const joinRoom = async (roomId) => {
  const token = await getToken();
  const user = getAuth().currentUser;
  const res = await axios.post(`${API_URL}/join`, {
    roomId,
    userId: user.uid
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.room;
};
