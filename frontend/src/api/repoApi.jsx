import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_URL = 'http://localhost:5000/api/';

const getToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User not authenticated');
  }

  return await user.getIdToken();
};

const fetchRepos = async (userId) => {
  if (!userId) return;

  try {
    const token = await getToken();
    const response = await axios.get(`${API_URL}repos?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching repositories:", error?.response?.data || error.message);
  }
};

const createRepo = async (userId, repoName) => {
  try {
    const token = await getToken();
    await axios.post(
      `${API_URL}repos/create`,
      {
        name: repoName,
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("❌ Error creating repository:", error?.response?.data || error.message);
  }
};

const deleteRepo = async (repoId) => {
  try {
    const token = await getToken();
    await axios.delete(`${API_URL}repos/${repoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("❌ Error deleting repository:", error?.response?.data || error.message);
  }
};

export { fetchRepos, createRepo, deleteRepo };
