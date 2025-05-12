import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Grid, Typography, Box } from '@mui/material';
import RoomCard from './components/RoomCard';

function App() {
  const [messages, setMessages] = useState({
    f103: [],
    i111: [],
    canteen: [], 
    hall: []
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/messages");
        const data = response.data;
        
        const groupedMessages = {
          f103: data.filter(msg => msg.topic === 'f103'),
          i111: data.filter(msg => msg.topic === 'i111'),
          canteen: data.filter(msg => msg.topic === 'canteen'),
          hall: data.filter(msg => msg.topic === 'hall')
        };
        
        setMessages(groupedMessages);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Мониторинг датчиков в реальном времени
        </Typography>
        <Grid container spacing={3}>
          {Object.entries(messages).map(([roomId, roomData]) => (
            <Grid item xs={12} md={6} key={roomId}>
              <RoomCard
                roomId={roomId}
                data={roomData[roomData.length - 1]}
                history={roomData}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
