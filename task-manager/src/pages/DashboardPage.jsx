import React from 'react';
import { Input, Button, Card, Row, Col } from 'antd';
import { WhatsAppOutlined, DownloadOutlined, ShareAltOutlined, HeartOutlined } from '@ant-design/icons';
import gato from '../assets/PapasQueso.jpeg'
const DashboardPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Row gutter={16} style={{ width: '100%', height: '100%' }}>
        <Col span={7}>
          <Card style={{ backgroundColor: '#E2E9EE', borderRadius: '20px', padding: '16px', height: '95%', textAlign: 'center' }}>
            <h2 style={{ color: '#09555B', fontSize: "45px", textAlign: "center" }}>¿Sabias qué?</h2>
            <p style={{ color: '#09555B', fontSize: "20px" }}>Datos curiosos sobre los gatos</p>
          </Card>
        </Col>
        <Col span={17}>
          <Card style={{ backgroundColor: '#E2E9EE', borderRadius: '25px', padding: '16px', textAlign: 'center', height: '95%' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <Input
                placeholder="Escribe algo..."
                style={{borderRadius: '20px', textAlign: 'center', backgroundColor: '#09555B', border: "2px solid #BAC8D3", color: 'white', flex: 1, '::placeholder': { color: 'white' }, WebkitTextFillColor: 'white'  }}
              />
              <Button
                type="primary"
                style={{ backgroundColor: '#FFC857', border: 'none', color : '#09555B', borderRadius: '10px' }}
              >
                Generar imagen
              </Button>
            </div>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <img
                src={gato}// Reemplaza con la URL de tu imagen
                alt="Generated"
                style={{ width: '36%', borderRadius: '8px' }}
              />
              <Button
                icon={<HeartOutlined style={{ color: 'red' }} />}
                style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'transparent', border: 'none' }}
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button icon={<DownloadOutlined />} style={{ marginRight: '8px' }} />
              <Button icon={<WhatsAppOutlined />} style={{ marginRight: '8px' }} />
              <Button icon={<ShareAltOutlined />} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
