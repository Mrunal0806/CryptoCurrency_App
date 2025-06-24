import React, { useState, useEffect } from 'react';
import millify from 'millify';
import { Collapse, Row, Col, Typography, Avatar } from 'antd';
import HTMLReactParser from 'html-react-parser';
import Loader from './Loader';

const { Text } = Typography;
const { Panel } = Collapse;

const Exchanges = () => {
  const [exchangesList, setExchangesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/exchanges');
        const data = await response.json();
        setExchangesList(data);
      } catch (error) {
        console.error('Error fetching exchanges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExchanges();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Row>
        <Col span={6}><strong>Exchanges</strong></Col>
        <Col span={6}><strong>24h Trade Volume</strong></Col>
        <Col span={6}><strong>Trust Score</strong></Col>
        <Col span={6}><strong>Country</strong></Col>
      </Row>
      <Row>
        {exchangesList.map((exchange) => (
          <Col span={24} key={exchange.id}>
            <Collapse>
              <Panel
                showArrow={false}
                header={(
                  <Row>
                    <Col span={6}>
                      <Avatar className="exchange-image" src={exchange.image} />
                      <Text style={{ marginLeft: 10 }}><strong>{exchange.name}</strong></Text>
                    </Col>
                    <Col span={6}>
                      ${millify(exchange.trade_volume_24h_btc || 0)} BTC
                    </Col>
                    <Col span={6}>{exchange.trust_score || 'N/A'}</Col>
                    <Col span={6}>{exchange.country || 'N/A'}</Col>
                  </Row>
                )}
              >
                <p>Year Established: {exchange.year_established || 'N/A'}</p>
                <p>URL: <a href={exchange.url} target="_blank" rel="noreferrer">{exchange.url}</a></p>
              </Panel>
            </Collapse>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Exchanges;




