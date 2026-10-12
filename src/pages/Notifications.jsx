import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errMsg } from "../api.js";

export default function Notifications() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/notifications")
      .then((res) => setItems(res.data))
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));
  }, []);

  const open = async (n) => {
    try {
      if (!n.seen) {
        await api.put(`/notifications/${n.id}/read`);
        setItems((list) => list.map((x) => (x.id === n.id ? { ...x, seen: true } : x)));
      }
    } catch (err) {
      setError(errMsg(err));
      return;
    }
    if (n.link) navigate(n.link);
  };

  const markAll = async () => {
    try {
      await api.put("/notifications/read-all");
      setItems((list) => list.map((x) => ({ ...x, seen: true })));
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setItems((list) => list.filter((x) => x.id !== id));
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const unread = items.filter((n) => !n.seen).length;

  return (
    <div>
      <div className="page-head">
        <h2>Notifications</h2>
        {unread > 0 && (
          <button type="button" className="link-btn" onClick={markAll}>
            Mark all as read
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading...</p>}
      {!loading && items.length === 0 && (
        <div className="empty">You have no notifications yet.</div>
      )}

      <div className="notice-list">
        {items.map((n) => (
          <div className={`notice ${n.seen ? "" : "unread"}`} key={n.id}>
            <div className="notice-body" onClick={() => open(n)}>
              <strong>{n.title}</strong>
              <p className="pre">{n.message}</p>
              <span className="notice-time">{n.createdAt.replace("T", " ").slice(0, 16)}</span>
            </div>
            <div className="notice-actions">
              <button type="button" className="link-btn" onClick={() => remove(n.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}