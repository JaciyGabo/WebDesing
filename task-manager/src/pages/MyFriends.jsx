import React from "react";
import { Card, Avatar, Button, Input, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const friends = [
  { name: "Laura Ramirez", color: "#ff8c00" },
  { name: "Pedro Paramo", color: "#008000" },
  { name: "Claudia Sheinbaum", color: "#ff4d4f" },
  { name: "Luis Echeverria", color: "#ff8c00" },
];

const suggestions = [
  { name: "José Vasconcelos", color: "#ff8c00" },
  { name: "Ximena Sariñana", color: "#008000" },
];

const MyFriends = () => {
  return (
    <div style={{ minHeight: "79vh", display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
      <Row gutter={20} justify="space-between">
        {/* Sección de Amigos */}
        <Col span={17}>
          <Card style={{ backgroundColor: "#E2E9EE", borderRadius: "25px", padding: "10px", height: "100%" }}>
            <Row gutter={1} justify="center">
              {friends.map((friend, index) => (
                <Col key={index}>
                  <Card
                    style={{
                      textAlign: "center",
                      borderRadius: "15px",
                      padding: "10px",
                      backgroundColor: "transparent",
                      border: "none",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Avatar size={100} style={{ backgroundColor: friend.color }}>
                        {friend.name[0]}
                      </Avatar>
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: "#FFC857",
                          border: "none",
                          color: "#09555B",
                          borderRadius: "10px",
                          marginTop: "10px",
                        }}
                      >
                        {friend.name}
                      </Button>
                    </div>
                  </Card>

                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Panel derecho */}
        <Col span={7}>
          {/* Agregar Amigos */}
          <Card style={{ backgroundColor: "#E2E9EE", borderRadius: "20px", padding: "15px" }}>
            <Input placeholder="Ingresa un ID" style={{ marginBottom: "10px", textAlign: "center", borderRadius: '10px', backgroundColor: '#09555B', border: "2px solid #BAC8D3", color: 'white', flex: 1, '::placeholder': { color: 'white' }, WebkitTextFillColor: 'white' }} />
            <Button type="primary" style={{ backgroundColor: "#ffc107", border: "none", width: "100%", color: "#09555B", borderRadius: "10px" }}>
              Agregar a amigos
            </Button>
          </Card>

          {/* Sugerencias de Amistad */}
          <Card style={{ backgroundColor: "#E2E9EE", borderRadius: "15px", marginTop: "15px", padding: "10px" }}>
            <p style={{ marginBottom: "10px", textAlign: "center", borderRadius: '10px', backgroundColor: '#09555B', border: "2px solid #BAC8D3", color: 'white', flex: 1, fontSize: "15px", padding: "5px" }}>Invitaciones de amistad</p>
            {suggestions.map((suggestion, index) => (
              <Card
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between", // Distribuye el espacio entre los elementos
                  marginBottom: "10px",
                  borderRadius: "15px",
                  backgroundColor: "#67AB9F",
                  padding: "0px", // Añade un padding para que no esté pegado a los bordes
                }}
              >
                <Avatar size={50} style={{ backgroundColor: suggestion.color, marginRight: "10px" }}>
                  {suggestion.name[0]}
                </Avatar>
                <span style={{ flexGrow: 1, background: "#FFC857", padding: "7px", borderRadius: "10px", margin: "0 10px" }}>
                  {suggestion.name}
                </span>
                <Button shape="circle" icon={<PlusOutlined />} />
              </Card>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyFriends;