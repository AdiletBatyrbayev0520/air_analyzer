import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, IconButton, Dialog } from '@mui/material';
import { DeviceThermostat, WaterDrop, Speed, Height, Co2, Science } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RoomCard = ({ roomId, data, history }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);

  const latestData = data ? JSON.parse(data.value) : null;

  const handleMetricClick = (metric) => {
    setSelectedMetric(metric);
    setDialogOpen(true);
  };

  const getChartData = (metric) => {
    const labels = history.map(item => new Date(item.timestamp).toLocaleTimeString());
    const values = history.map(item => JSON.parse(item.value)[metric]);

    return {
      labels,
      datasets: [
        {
          label: getMetricLabel(metric),
          data: values,
          borderColor: getMetricColor(metric),
          tension: 0.1,
        },
      ],
    };
  };

  const getMetricLabel = (metric) => {
    const labels = {
      temperature: 'Температура (°C)',
      humidity: 'Влажность (%)',
      pressure: 'Давление (hPa)',
      altitude: 'Высота (м)',
      co2: 'CO2 (ppm)',
      tvoc: 'TVOC (ppb)',
    };
    return labels[metric];
  };

  const getMetricColor = (metric) => {
    const colors = {
      temperature: '#ff6b6b',
      humidity: '#4dabf7',
      pressure: '#ffd43b',
      altitude: '#69db7c',
      co2: '#845ef7',
      tvoc: '#ff922b',
    };
    return colors[metric];
  };

  const getMetricIcon = (metric) => {
    const icons = {
      temperature: <DeviceThermostat />,
      humidity: <WaterDrop />,
      pressure: <Speed />,
      altitude: <Height />,
      co2: <Co2 />,
      tvoc: <Science />,
    };
    return icons[metric];
  };

  if (!latestData) return null;

  return (
    <>
      <Card sx={{ minWidth: 275, m: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Комната {roomId}
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(latestData).map(([metric, value]) => (
              <Grid item xs={6} sm={4} key={metric}>
                <IconButton 
                  onClick={() => handleMetricClick(metric)}
                  sx={{ 
                    flexDirection: 'column',
                    color: getMetricColor(metric),
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                  }}
                >
                  {getMetricIcon(metric)}
                  <Typography variant="body2" color="text.secondary">
                    {getMetricLabel(metric)}
                  </Typography>
                  <Typography variant="body1">
                    {value}
                  </Typography>
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {selectedMetric && `${getMetricLabel(selectedMetric)} - Комната ${roomId}`}
          </Typography>
          {selectedMetric && (
            <Line
              data={getChartData(selectedMetric)}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                  },
                },
              }}
            />
          )}
        </CardContent>
      </Dialog>
    </>
  );
};

export default RoomCard; 