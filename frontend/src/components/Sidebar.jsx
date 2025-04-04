import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Folder, Plus, Trash, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [repos, setRepos] = useState([]);
  const [newRepoName, setNewRepoName] = useState("");
  const [userId, setUserId] = useState(null); // ✅ Fetch userId from Firebase

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // ✅ Set the correct userId
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (userId) {
      fetchRepos();
    }
  }, [userId]);

  const fetchRepos = async () => {
    if (!userId) return;

    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        console.error("❌ No authentication token found.");
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/repos?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRepos(response.data);
    } catch (error) {
      console.error("❌ Error fetching repositories:", error?.response?.data || error.message);
    }
  };

  const createRepo = async () => {
    if (!newRepoName.trim() || !userId) return;

    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        console.error("❌ No authentication token found.");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/repos/create",
        { name: newRepoName, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewRepoName("");
      fetchRepos();
    } catch (error) {
      console.error("❌ Error creating repository:", error?.response?.data || error.message);
    }
  };

  const deleteRepo = async (repoId) => {
    if (!repoId) return;

    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        console.error("❌ No authentication token found.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/repos/${repoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchRepos();
    } catch (error) {
      console.error("❌ Error deleting repository:", error?.response?.data || error.message);
    }
  };

  return (
    <div className={`h-screen bg-gray-900 text-white transition-all ${collapsed ? "w-16" : "w-64"} p-2 shadow-lg`}>
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-bold ${collapsed ? "hidden" : "block"}`}>Repositories</h2>
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        {repos.length > 0 ? (
          repos.map((repo) => (
            <div key={repo._id} className="flex items-center justify-between bg-gray-800 p-2 rounded-md">
              <span className="flex items-center gap-2">
                <Folder /> {!collapsed && repo.name}
              </span>
              {!collapsed && (
                <Button variant="ghost" size="icon" onClick={() => deleteRepo(repo._id)}>
                  <Trash className="text-red-400" />
                </Button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">{userId ? "No repositories found." : "Loading..."}</p>
        )}
      </div>

      {!collapsed && (
        <div className="mt-4 flex gap-2">
          <Input
            placeholder="New Repo"
            value={newRepoName}
            onChange={(e) => setNewRepoName(e.target.value)}
          />
          <Button onClick={createRepo}>
            <Plus />
          </Button>
        </div>
      )}
    </div>
  );
}
