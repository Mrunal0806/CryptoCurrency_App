import React, { useState } from 'react';
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Col, Row, Typography, Select } from 'antd';
import {
  DollarCircleOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  NumberOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  CheckOutlined,
} from '@ant-design/icons';

import { useGetCryptoDetailsQuery } from '../services/cryptoApi';
import Loader from './Loader';
import LineChart from './LineChart';

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails = () => {
  const { coinId } = useParams();
  const [timeperiod, setTimeperiod] = useState('7');

  const { data: cryptoData, isFetching } = useGetCryptoDetailsQuery(coinId);

  const cryptoDetails = cryptoData?.market_data;
  const coinInfo = cryptoData;

  if (isFetching || !cryptoDetails) return <Loader />;

  const timeOptions = ['1', '7', '30', '90', '180', '365'];

  const stats = [
    {
      title: 'Price to USD',
      value: `$${millify(cryptoDetails.current_price?.usd || 0)}`,
      icon: <DollarCircleOutlined />,
    },
    {
      title: 'Market Cap',
      value: `$${millify(cryptoDetails.market_cap?.usd || 0)}`,
      icon: <DollarCircleOutlined />,
    },
    {
      title: '24h Volume',
      value: `$${millify(cryptoDetails.total_volume?.usd || 0)}`,
      icon: <ThunderboltOutlined />,
    },
    {
      title: 'All-time-high',
      value: `$${millify(cryptoDetails.ath?.usd || 0)}`,
      icon: <TrophyOutlined />,
    },
    {
      title: 'Rank',
      value: `#${coinInfo?.market_cap_rank || 'N/A'}`,
      icon: <NumberOutlined />,
    },
  ];

  const genericStats = [
    {
      title: 'Circulating Supply',
      value: millify(cryptoDetails.circulating_supply || 0),
      icon: <ExclamationCircleOutlined />,
    },
    {
      title: 'Total Supply',
      value: millify(cryptoDetails.total_supply || 0),
      icon: <ExclamationCircleOutlined />,
    },
    {
      title: 'Max Supply',
      value: cryptoDetails.max_supply ? millify(cryptoDetails.max_supply) : 'N/A',
      icon: <ExclamationCircleOutlined />,
    },
    {
      title: 'Is Deflationary',
      value: cryptoDetails.deflationary ? <CheckOutlined /> : <StopOutlined />,
      icon: <ExclamationCircleOutlined />,
    },
  ];

  return (
    <Col className="coin-detail-container">
      <Col className="coin-heading-container">
        <Title level={2} className="coin-name">
          {coinInfo?.name} ({coinInfo?.symbol?.toUpperCase()}) Price
        </Title>
        <p>
          {coinInfo?.name} live price in USD. View value statistics, market cap and supply data.
        </p>
      </Col>

      {/* Select Time Period */}
      <Select
        defaultValue={timeperiod}
        className="select-timeperiod"
        onChange={(value) => setTimeperiod(value)}
        style={{ marginBottom: 24, width: 150 }}
      >
        {timeOptions.map((date) => (
          <Option key={date} value={date}>
            {date === '1' ? '1d' : date === 'max' ? 'Max' : `${date}d`}
          </Option>
        ))}
      </Select>

      {/* Line Chart */}
      <LineChart
        coinId={coinId}
        days={timeperiod}
        currentPrice={millify(cryptoDetails.current_price?.usd || 0)}
        coinName={coinInfo?.name || ''}
      />

      {/* Stats */}
      <Col className="stats-container">
        <Col className="coin-value-statistics">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">{coinInfo?.name} Value Statistics</Title>
            <p>An overview showing statistics of {coinInfo?.name} like market cap, trading volume, etc.</p>
          </Col>
          {stats.map(({ icon, title, value }, i) => (
            <Col className="coin-stats" key={i}>
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>

        <Col className="other-stats-info">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">Other Stats Info</Title>
            <p>Additional stats for {coinInfo?.name}.</p>
          </Col>
          {genericStats.map(({ icon, title, value }, i) => (
            <Col className="coin-stats" key={i}>
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>
      </Col>

      {/* Description and Links */}
      <Col className="coin-desc-link">
        <Row className="coin-desc">
          <Title level={3} className="coin-details-heading">What is {coinInfo?.name}?</Title>
          {coinInfo?.description?.en
            ? HTMLReactParser(coinInfo.description.en)
            : 'No description available.'}
        </Row>
        <Col className="coin-links">
          <Title level={3} className="coin-details-heading">{coinInfo?.name} Links</Title>
          {coinInfo?.links?.homepage?.map((url, idx) =>
            url ? (
              <Row className="coin-link" key={idx}>
                <Title level={5} className="link-name">Homepage</Title>
                <a href={url} target="_blank" rel="noreferrer">{url}</a>
              </Row>
            ) : null
          )}
        </Col>
      </Col>
    </Col>
  );
};

export default CryptoDetails;


