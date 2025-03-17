import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "./DataTable";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("Fetching messages...");
        const response = await axios.get("http://localhost:5000/api/messages");
        console.log("Received data:", response.data);
        setMessages(response.data);
        setError(null);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setError("Ошибка при получении данных");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>Мониторинг датчиков в реальном времени</h1>
      <div className="messages-container">
        {error && <div className="error">{error}</div>}
        {loading && <div className="loading">Загрузка данных...</div>}
        {!loading && !error && messages.length === 0 && (
          <div className="no-data">Нет доступных данных</div>
        )}
        {!loading && !error && messages.length > 0 && (
          <DataTable data={messages} />
        )}
      </div>
    </div>
  );
}

export default App;
