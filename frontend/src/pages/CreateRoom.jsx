import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRepos } from "../api/repoApi";
import { createRoom } from "../api/roomApi";
import { getAuth } from "firebase/auth";
import { Button } from "../components/ui/button";

export default function CreateRoom() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = getAuth().currentUser;

  useEffect(() => {
    const loadRepos = async () => {
      if (user) {
        const data = await fetchRepos(user.uid);
        setRepos(data || []);
      }
    };
    loadRepos();
  }, [user]);

  const handleCreateRoom = async () => {
    if (!selectedRepo) return;
    try {
      setLoading(true);
      const room = await createRoom(selectedRepo);
      navigate(`/editor/${room.roomId}`); // ✅ UPDATED PATH
    } catch (error) {
      console.error("Failed to create room", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-indigo-600 to-blue-500 flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Create a New Room</h1>

      <div className="w-full max-w-md space-y-4">
        <label className="block text-left">Select Repository</label>
        <select
          value={selectedRepo}
          onChange={(e) => setSelectedRepo(e.target.value)}
          className="w-full p-3 rounded-md text-black"
        >
          <option value="">-- Choose a repo --</option>
          {repos.map((repo) => (
            <option key={repo._id} value={repo._id}>
              {repo.name}
            </option>
          ))}
        </select>

        <Button
          onClick={handleCreateRoom}
          disabled={!selectedRepo || loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-md mt-4"
        >
          {loading ? "Creating..." : "Create Room 🚀"}
        </Button>
      </div>
    </div>
  );
}
