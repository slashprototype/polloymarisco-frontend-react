import React, { useState, useMemo, useEffect } from "react";

import { useOutletContext } from "react-router-dom";

import {
  Button,
  Input,
  Typography,
  Divider,
  Card,
  Space,
  FloatButton,
  Tooltip,
  Col,
  Row,
  DatePicker,
  Statistic,
  Spin,
  Descriptions,
} from "antd";
import dayjs from "dayjs";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

import { getSalesSummary, getSalesTickets } from "../../services/salesService";
import { summarizeSalesBySeller } from "../../utils/summarizeSalesBySeller";
// import components child
import ProductsComponent from "./components/productsView/productsComponent";
import ChartMoreSell from "./components/chartMoreSell";
// import styles
const { Title, Text } = Typography;
const path = "https://www.polloymariscoezm.com/";

const formatDate = (date) => {
  if (dayjs(date).isValid()) {
    return dayjs(date).format("YYYY-MM-DD");
  }
  return undefined;
};

const formatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

/* 
  Total aamount ess el totaal de venta en pesos
  Filtrar por price_type y sumar los aaamount de menudeo, maayoreo, etc.
  Precio, es por cantidad kilos, paquetes, unitarios

*/
const DashboardPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 650 });
  const [isMinimized, setIsMinimized] = useState(false);

  const [searchText, setSearchText] = useState("");
  const { sharedData, updateSharedData, sellers } = useOutletContext(); // receive data Products

  const [waitToPlot, setWaitToPlot] = useState(true);

  const [startDate, setStartDate] = useState(dayjs());
  const [salesSeller, setSalesSeller] = useState([]);
  const [endDate, setEndDate] = useState(dayjs());
  const [sales, setSales] = useState();
  const [totalAmount, setTotalAmount] = useState(0); // total sells
  const [salesTickets, setSalesTickets] = useState();

  const handleUpdate = () => {
    updateSharedData("Updated Data");
  };

  const handleChangeDate = (which, date, dateString) => {
    let dateFormat;
    if (date !== null) {
      const year = date.year();
      const month = date.month(); // 👈 IMPORTANTE: sumar 1
      const day = date.date();
      dateFormat = `${year}-${month}-${day}`;
    }
    if (which === "startDate") {
      setStartDate(date);
    } else if (which === "endDate") {
      setEndDate(date);
    }
  };
  const getSales = async (params) => {
    try {
      let data = await getSalesSummary(params);
      //console.debug("Response products summary [Dashboard]: ", data);
      setSales(data);
      setTotalAmount(data.total_amount);
      //! Se esta generando problema al hacer el setSales
      //console.debug("Sales [Dashboard]:", sales);
      //setProductSells(sales.details);
    } catch (error) {
      console.error("Failed to get sales summary [Dashboard]:", error);
    }
  };

  const getTickets = async (params) => {
    //console.debug("Params to get tickets [Dashboard]: ", params);
    try {
      let data = await getSalesTickets(params);
      setSalesTickets(data);
      //console.debug("%%%% Response products tickets [Dashboard]: ", data);
    } catch (error) {
      console.error("Failed to get sales tickets [Dashboard]:", error);
    }
  };

  //console.debug("Shared data received [Dashboard]: ", sharedData);

  // Minimizar automáticamente en móviles
  useEffect(() => {
    if (isMobile) {
      console.debug("Minimizing on mobile view");
      setIsMinimized(true);
    } else {
      console.debug("Restoring on desktop view");
      setIsMinimized(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const data = {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      from: "DashboardPage",
    };
    getSales(data);
    getTickets(data);
  }, [startDate, endDate]);

  useEffect(() => {
    if (salesTickets && sellers) {
      const summarized = summarizeSalesBySeller(salesTickets, sellers);
      setSalesSeller(summarized);
      console.debug("Sales summarized by seller [Dashboard]: ", summarized);
    }
  }, [salesTickets, sellers]);

  setTimeout(() => {
    if (waitToPlot) {
      setWaitToPlot(false);
      const formatted = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(parseFloat(totalAmount));
      setTotalAmount(formatted);
      //console.debug("Sales tickets [Dashboard]: ", salesTickets);
    }
  }, 2000);

  //console.debug("Tickets sales [Dashboard]: ", salesTickets);
  return (
    <div>
      <h3>Dashboard Page</h3>
      <Row>
        <Col span={20}>
          <Row className=" scroll-wrap" gutter={[10, 10]} style={{ padding: "10px" }}>
            {sharedData.map((item) => (
              <ProductsComponent productData={item} startDate={startDate} endDate={endDate} />
            ))}
          </Row>
        </Col>
        <Col span={4}>
          <div
            className="floatDatePicker"
            style={{
              top: isMobile ? "auto" : "110px",
              bottom: isMobile ? "20px" : "auto",
              padding: isMinimized ? "5px" : "10px",
            }}
          >
            {!isMinimized && (
              <div>
                <h4 style={{ marginBottom: "-4px" }}>Venta total</h4>
                <Statistic
                  value={totalAmount}
                  valueStyle={{ color: "#3f8600", fontSize: "18px" }}
                />
                <h5 style={{ marginBottom: "1px" }}>Fecha inicio</h5>
                <DatePicker
                  //onChange={onSelectDate}
                  value={startDate}
                  onChange={setStartDate}
                />
                <h5 style={{ marginBottom: "1px" }}>Fecha fin</h5>
                <DatePicker
                  //onChange={onSelectDate}
                  value={endDate}
                  onChange={(date) => handleChangeDate("endDate", date, date)}
                />
   
                <div style={{ paadding: "2px" }}>
                  {salesSeller.map((sellerData) => (
                    <div>
                      <Divider style={{ marginBottom: "0px" }}>
                       <Text strong>{sellerData.sellerName} </Text> 
                      </Divider>
                      
                      <Text strong>Total Venta: </Text>
                      {formatter.format(sellerData.totalAmount)} <br />
                      <Text strong>Total Kilos: </Text>
                      {sellerData.totalKilos.toFixed(3)} kg
                    </div>
                  ))}
                </div>
              </div>
            )}
            <FloatButton
              type="primary"
              icon={isMinimized ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setIsMinimized(!isMinimized)}
              style={{
                right: isMobile ? "20px" : "10px",
                bottom: isMobile ? "20px" : "10px",
              }}
              tooltip={isMinimized ? "Expandir" : "Minimizar"}
            />
          </div>
        </Col>
      </Row>
      <br /> <br />
      <Row span={20}>
        {!waitToPlot && (
          <Col span={12}>
            {sales !== undefined && salesTickets !== undefined && sellers !== undefined ? (
              <ChartMoreSell sales={sales} salesTickets={salesTickets} sellers={sellers} />
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Spin type="secondary">Cargando gráfico de ventas...</Spin>
              </div>
            )}
          </Col>
        )}
      </Row>
    </div>
  );
};

export default DashboardPage;
