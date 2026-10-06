import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Notes.css";

function Notes() {
  const [sessions, setSessions] = useState([]);
  const [notes, setNotes] = useState([]);

  const [form, setForm] = useState({
    session: "",
    client: "",
    type: "private",
    content: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSessions();
    loadNotes();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await api.get("/scheduling");
      setSessions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadNotes = async () => {
    try {
      const response = await api.get("/notes");
      setNotes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSessionChange = (e) => {
    const sessionId = e.target.value;

    const selectedSession = sessions.find(
      (session) => session._id === sessionId
    );

    setForm({
      ...form,
      session: sessionId,
      client: selectedSession?.client?._id || "",
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/notes", form);

      setMessage("Session note created successfully!");

      setForm({
        session: "",
        client: "",
        type: "private",
        content: "",
      });

      loadNotes();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to create session note"
      );
    }
  };

  return (
    <div className="notes-page">
      <h1>Session Notes</h1>
      <p>Keep secure notes for your therapy sessions.</p>

      <div className="client-form">
        <h2>Create Session Note</h2>

        <form onSubmit={handleSubmit}>
          <select
            name="session"
            value={form.session}
            onChange={handleSessionChange}
            required
          >
            <option value="">Select Session</option>

            {sessions.map((session) => (
              <option key={session._id} value={session._id}>
                {session.client?.name || "Client"} -{" "}
                {new Date(session.date).toLocaleString()}
              </option>
            ))}
          </select>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="private">Private</option>
            <option value="shared">Shared</option>
          </select>

          <textarea
            name="content"
            placeholder="Write your session notes..."
            value={form.content}
            onChange={handleChange}
            rows="7"
            required
          />

          <button type="submit">
            Save Note
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>

      <div className="client-list">
        <h2>Saved Notes</h2>

        {notes.length === 0 ? (
          <p>No session notes yet.</p>
        ) : (
          notes.map((note) => (
            <div className="client-card" key={note._id}>
              <h3>
                {note.client?.name || "Client"}
              </h3>

              <p>
                Type: {note.type}
              </p>

              <p>
                {note.content}
              </p>

              {note.session?.date && (
                <small>
                  Session:{" "}
                  {new Date(
                    note.session.date
                  ).toLocaleString()}
                </small>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;

