import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
//import { createFromIconfontCN } from '@ant-design/icons';
import { Menu, Switch, Layout, theme, Button, Col, Row } from "antd";

import { PiFishDuotone, PiBeerBottleDuotone } from "react-icons/pi";
import { GiChicken } from "react-icons/gi";

import { Spin } from 'antd';



import { useNavigate, Outlet, useLocation } from "react-router-dom";

import "./main-layout.css";

import { getProducts } from "../services/productService";

const { Header, Footer, Sider, Content } = Layout;


const menuItems = [
  {
    label: "Mariscos",
    icon: <PiFishDuotone />,
    key: "seafood",
  },
  {
    label: "Pollo",
    icon: <GiChicken />,
    key: "chicken",
  },
  {
    label: "Salsas",
    icon: <PiBeerBottleDuotone />,
    key: "sauces",
  },
  {
    label: "Otros",
    icon: <MailOutlined />,
    key: "others",
  },
];

const MainLayoutComponent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sharedData, setSharedData] = useState([]);
  const [currentKey, setCurrentKey] = useState("seafood");
  const [collapsed, setCollapsed] = useState(false);
  //console.log("Current key: ", currentKey);

  const filterProductsByCategory = (category) =>{
    //console.log('Category to filter--: ',category);
    const filteredResult = products.filter((product) =>
      product.category.toLowerCase().includes(category.toLowerCase())
    );
    setSharedData(filteredResult);
    //console.log('Filtered products shared data: ',sharedData);

  }

  const getAPIGetProducts = async () => {
    let data = await getProducts();
    if (data!== undefined) {
      //console.debug("====Data is not undefined", data);
      setLoading(false);
      setProducts(data);
      //console.debug("Response products// Al iniciar layout: ", data);
      //!No se esta actualizando 
      filterProductsByCategory(currentKey);
    }
    
};

  const navigate = useNavigate();
  const location = useLocation();

  const updateSharedData = (newData) => {
    setSharedData(newData);
  };




  useEffect(() => {
    if (loading) {
      try {
        getAPIGetProducts();
        //filterProductsByCategory(currentKey);
        //setTimeout(() =>{filterProductsByCategory(currentKey)},2000);
      } catch (e) {
        console.error("Error trying get products", e);
      }
    }
  }, [loading]);

  useEffect(() => {
  if (products.length > 0) {
    filterProductsByCategory(currentKey);
  }
}, [products, currentKey]); // Escucha cuando cambien products o currentKey

  const onExit = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {" "}
      {/* Ensure full viewport height */}
      <Sider
        className="bg-gradient"
        breakpoint="md" // Adjust breakpoint as needed
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        collapsedWidth={100} // puede ser "0" si quieres ocultarlo completamente
        onBreakpoint={(broken) => {
          console.log('Broken[MainLayout]',broken);
        }}
      >
        <div className="logo" /> {/* Your logo or title */}
        <br />
        <h2 style={{ textAlign: "center", color: "white" }}>Sucursal</h2>
        <br />
        <div className="logo" />
        <Menu
          className="menu-container"
          mode="inline"
          theme="dark"
    
          onClick={(e) => {
            //console.debug("Click", e);
            setCurrentKey(e.key);
            filterProductsByCategory(e.key);
          }}
          //defaultSelectedKeys={}
          selectedKeys={[currentKey]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          className="site-layout-sub-header-background"
          style={{ padding: 0 }}
        >
          <Row>
            <Col span={20} style={{ textAlign: "left", alignItems: "center" , alignContent: "center"}}>
              <Button type={location.pathname === "/dashboard" ? "primary" : "default"} style={{ marginLeft: "45px" }} onClick={() => {if (location.pathname !== "/dashboard") navigate("/dashboard")} }>
                General
              </Button>
              <Button type={location.pathname === "/dashboard/precios" ? "primary" : "default"} style={{ margin: "10px" }} onClick={() => {if (location.pathname !== "/dashboard/precios") navigate("/dashboard/precios")} }>
                Precios
              </Button>
            </Col>
            <Col span={4} style={{ textAlign: "right" }}>
              <Button type="primary" style={{ margin: "10px" }} onClick={onExit}>
                Salir
              </Button>
              
            </Col>
          </Row>

        </Header>
        <Content className="content-layout" style={{ margin: "20px 12px 0" }}>
          <div
            className="site-layout-background"
            style={{ padding: 15, minHeight: 600 }}
          >
            {loading  ? (
              <div className="loading-container">
                <Spin
                  spinning={loading}
                  tip="Cargando catálogo..."
                  size="large"
                  style={{ minHeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}
                > </Spin>
              </div>
            ) : (
              <div className="content-container">
                <Outlet context={{ sharedData, updateSharedData }} />
              </div>
            )}

{/*             <Outlet context={{ sharedData, updateSharedData }} /> */}
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          EMH Design ©2025 Created by EMMARHER
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayoutComponent;
