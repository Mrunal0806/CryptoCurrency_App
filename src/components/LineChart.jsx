import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Col, Row, Typography } from 'antd';

const { Title } = Typography;

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);

const LineChart = ({ coinId, currentPrice, coinName, days }) => {
  const [coinHistory, setCoinHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
        );
        if (!response.ok) throw new Error('Failed to fetch data.');
        const data = await response.json();
        setCoinHistory(data?.prices || []);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError(err.message);
        setCoinHistory([]);
      } finally {
        setLoading(false);
      }
    };

    if (coinId) fetchHistory();
  }, [coinId, days]);

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!coinHistory.length) return <div>No historical data available.</div>;

  const coinPrice = coinHistory.map((entry) => entry[1]);
  const coinTimestamp = coinHistory.map((entry) =>
    new Date(entry[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );

  const data = {
    labels: coinTimestamp,
    datasets: [
      {
        label: 'Price (USD)',
        data: coinPrice,
        borderColor: '#0071bd',
        backgroundColor: 'rgba(0, 113, 189, 0.1)',
        fill: true,
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  return (
    <>
      <Row className="chart-header">
        <Title level={2} className="chart-title">{coinName} Price Chart</Title>
        <Col className="price-container">
          <Title level={5}>Current {coinName} Price: ${currentPrice}</Title>
        </Col>
      </Row>
      <Line data={data} options={options} />
    </>
  );
};

export default LineChart;




