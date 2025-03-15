import React from "react";
import { Card, Avatar, Button, Row, Col, Image } from "antd";
import { HeartOutlined, DownloadOutlined, SyncOutlined, WhatsAppOutlined } from "@ant-design/icons";
import Mimir from '../assets/Amimir.jpeg'
import BuenosDias from '../assets/BuenosDias.jpeg'
import Ojitos from '../assets/Ojitos.jpeg'
import hola from '../assets/hola.png'
import LaMoricion from '../assets/LaMoricion.jpeg'
import MalditoPadro from '../assets/MalditoPedro.png'
import PapasQueso from '../assets/PapasQueso.jpeg'
import salchipapa from '../assets/salchipapas.jpeg'


const sharedCats = [
  { name: "Pedro Paramo", color: "#ff8c00", image: Mimir, catName: "La meneable" },
  { name: "Luis Echeverria", color: "#008000", image: BuenosDias, catName: "Mia" },
];

const catImages = [
  { src: PapasQueso, name: "Ronroneo" },
  { src: Ojitos, name: "Duerme bien" },
  { src: hola, name: "Buenos días" },
  { src: LaMoricion, name: "Blanco puro" },
  { src: MalditoPadro, name: "Ojitos" },
  { src: salchipapa, name: "Misterio oculto" },
];


const MyCats = () => {
  return (
    <div style={{ minHeight: "79vh", display: 'flex', justifyContent: 'center', alignItems: 'center', }}>

      <Row gutter={16} justify="space-between">
        {/* Panel izquierdo */}
        <Col span={7} >

          <Card style={{ backgroundColor: "#E2E9EE", borderRadius: "15px" }}>
            <p style={{ marginBottom: "10px", textAlign: "center", borderRadius: "10px", backgroundColor: "#09555B", border: "2px solid #BAC8D3", color: "white", fontSize: "15px", padding: "5px", }}>
              Gatos compartidos conmigo
            </p>

            {sharedCats.map((user, index) => (
              <Card
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center", // 🔥 Alinea verticalmente todos los elementos
                  justifyContent: "space-evenly", // 🔥 Distribuye uniformemente los elementos
                  marginBottom: "10px",
                  borderRadius: "15px",
                  backgroundColor: "#67AB9F",
                }}
              >
                {/* Contenedor del Avatar y Nombre */}
                <Row
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexGrow: 1, // 🔥 Que ocupe el mismo espacio que la imagen
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <Avatar size={50} style={{ backgroundColor: user.color }}>
                    {user.name[0]}
                  </Avatar>
                  <span
                    style={{
                      background: "#FFC857",
                      padding: "7px",
                      borderRadius: "10px",
                      textAlign: "center",
                      display: "flex", // 🔥 Asegura que el texto esté centrado
                      alignItems: "center",
                      justifyContent: "center",
                      flexGrow: 1,
                    }}
                  >
                    {user.name}
                  </span>
                </Row>

                {/* Contenedor de la imagen con centrado absoluto */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexGrow: 1, // 🔥 Que ocupe el mismo espacio que el texto
                  }}
                >
                  <Image width={100} src={user.image} style={{ display: "block", margin: "auto" }} />
                </div>
              </Card>
            ))}
          </Card>


        </Col>

        {/* Panel de imágenes de gatos */}
        <Col span={17}>
          <Row gutter={[16, 16]}>
            {catImages.map((cat, index) => (
              <Col span={8} key={index}>
                <Card
                  style={{
                    backgroundColor: "#dfe6e9",
                    borderRadius: "15px",
                    padding: "10px",
                    textAlign: "center",
                  }}
                  cover={<Image style={{height:"150px", width: "auto" }} src={cat.src} />}
                >
                  <Row justify="center" gutter={8}>
                    <Col>
                      <Button shape="circle" icon={<HeartOutlined />} />
                    </Col>
                    <Col>
                      <Button shape="circle" icon={<DownloadOutlined />} />
                    </Col>
                    <Col>
                      <Button shape="circle" icon={<WhatsAppOutlined />} />
                    </Col>
                    <Col>
                      <Button shape="circle" icon={<SyncOutlined />} />
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default MyCats;