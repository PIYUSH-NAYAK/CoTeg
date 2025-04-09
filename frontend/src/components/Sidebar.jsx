// src/components/Sidebar.jsx
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Folder, Plus, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchRepos, createRepo, deleteRepo } from "../api/repoApi";

export default function Sidebar({ userId }) {
  const [collapsed, setCollapsed] = useState(false);
  const [repos, setRepos] = useState([]);
  const [newRepoName, setNewRepoName] = useState("");

  useEffect(() => {
    if (userId) loadRepos();
  }, [userId]);

  const loadRepos = async () => {
    const data = await fetchRepos(userId);
    if (data) setRepos(data);
  };

  const handleCreateRepo = async () => {
    if (!newRepoName.trim() || !userId) return;
    await createRepo(userId, newRepoName);
    setNewRepoName("");
    loadRepos();
  };

  const handleDeleteRepo = async (repoId) => {
    if (!repoId) return;
    await deleteRepo(repoId);
    loadRepos();
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
                <Button variant="ghost" size="icon" onClick={() => handleDeleteRepo(repo._id)}>
                  <Trash className="text-red-400" />
                </Button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">{userId ? "No repositories found." : "Loading..."}</p>
        )}
      </div>

      {userId && !collapsed && (
        <div className="mt-4 flex gap-2">
          <Input
            placeholder="New Repo"
            value={newRepoName}
            onChange={(e) => setNewRepoName(e.target.value)}
          />
          <Button onClick={handleCreateRepo}>
            <Plus />
          </Button>
        </div>
      )}
    </div>
  );
}
