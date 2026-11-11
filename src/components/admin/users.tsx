"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/admin-api";
import { errorMessage } from "@/lib/errors";
import type { PublicUser } from "@/lib/types";

export default function UserList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<PublicUser[]>([]);
  const [search, setSearch] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.getUsers();
      setData(res.users ?? []);
    } catch (err) {
      setError(errorMessage(err, "Failed to load users."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function changePlan(userId: string, planId: string) {
    try {
      await adminApi.updateUser(userId, { plan: planId });
      refresh();
    } catch (err) {
      setError(`Update failed: ${errorMessage(err, "Update failed.")}`);
    }
  }

  async function updateCredits(userId: string, credits: number) {
    try {
      await adminApi.updateUser(userId, { credits });
      refresh();
    } catch (err) {
      setError(`Update failed: ${errorMessage(err, "Update failed.")}`);
    }
  }

  async function toggleRole(userId: string, role: string) {
    try {
      await adminApi.updateUser(userId, { role });
      refresh();
    } catch (err) {
      setError(`Update failed: ${errorMessage(err, "Update failed.")}`);
    }
  }

  async function removeUser(userId: string) {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      await adminApi.deleteUser(userId);
      refresh();
    } catch (err) {
      setError(`Delete failed: ${errorMessage(err, "Delete failed.")}`);
    }
  }

  function filtered() {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((u) => u.email.toLowerCase().includes(q));
  }

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (error && !data.length) return <p className="text-red-400">{error}</p>;

  return (
    <section className="settings-card">
      <div className="section-title-row">
        <h2>Users</h2>
        <div className="filter-row">
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filter-input"
          />
          <button onClick={refresh} className="filter-active">
            Refresh
          </button>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      {filtered().map((user) => (
        <div key={user.id} className="admin-user">
          <div className="admin-user-info">
            <b>{user.name}</b>
            <span className="text-slate-400">{user.email}</span>
            <span className="badge-demo">{user.plan}</span>
            <span className="text-xs text-slate-500">{user.credits} credits</span>
          </div>

          <div className="admin-user-actions">
            <select
              value={user.plan}
              onChange={(e) => changePlan(user.id, e.target.value)}
              className="select"
            >
              <option value="free">Free</option>
              <option value="pro">Pro ($19/mo)</option>
              <option value="business">Business ($49/mo)</option>
            </select>

            <input
              type="number"
              defaultValue={user.credits}
              min={0}
              onBlur={(e) => {
                const next = parseInt(e.target.value, 10);
                if (Number.isNaN(next) || next < 0 || next === user.credits) return;
                updateCredits(user.id, next);
              }}
              className="input credit-field"
            />

            <button
              onClick={() => toggleRole(user.id, user.role === "admin" ? "user" : "admin")}
              className="toggle-btn"
            >
              {user.role === "admin" ? "Disable admin" : "Make admin"}
            </button>

            <button onClick={() => removeUser(user.id)} className="danger-btn">
              Delete
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
