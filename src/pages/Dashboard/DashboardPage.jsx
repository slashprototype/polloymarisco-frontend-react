import React, { useState, useEffect } from "react";

import { useOutletContext } from "react-router-dom";

import {
  Button,
  Typography,
  Divider,
  Card,
  FloatButton,
  Col,
  Row,
  DatePicker,
  Statistic,
  Spin,
  message,
  Modal,
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
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const { sharedData, updateSharedData, sellers } = useOutletContext(); // receive data Products

  const [waitToPlot, setWaitToPlot] = useState(true);

  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [salesSeller, setSalesSeller] = useState([]);
  const [endDate, setEndDate] = useState(dayjs().startOf("day"));
  const [sales, setSales] = useState();
  const [weeklySales, setWeeklySales] = useState(); // tiempo de venta
  const [totalAmount, setTotalAmount] = useState(0); // total sells
  const [salesTickets, setSalesTickets] = useState();

  const handleUpdate = () => {
    updateSharedData("Updated Data");
  };

  const handleChangeDate = (which, date) => {
    if (!date || !dayjs(date).isValid()) return;
    const normalizedDate = dayjs(date).startOf("day");
    const normalizedStart = startDate ? dayjs(startDate).startOf("day") : null;
    const normalizedEnd = endDate ? dayjs(endDate).startOf("day") : null;

    if (which === "startDate") {
      if (normalizedEnd && normalizedDate.isAfter(normalizedEnd)) {
        message.warning("La fecha de inicio no puede ser posterior a la fecha de fin.", 6);
        return;
      }
      setStartDate(normalizedDate);
    } else if (which === "endDate") {
      if (normalizedStart && normalizedDate.isBefore(normalizedStart)) {
        message.warning("La fecha de fin no puede ser anterior a la fecha de inicio.", 6);
        return;
      }
      setEndDate(normalizedDate);
    }
  };
  const getSales = async (params) => {
    try {
      let data = await getSalesSummary(params);

      setSales(data);
      setTotalAmount(data.total_amount);

      //! Se esta generando problema al hacer el setSales
    } catch (error) {
      console.error("Failed to get sales summary [Dashboard]:", error);
    }
  };

  const getWeeklyRanges = (endDate, weeks = 7) => {
    const ranges = [];
    let end = dayjs(endDate).endOf("week");

    for (let i = 0; i < weeks; i++) {
      const start = end.subtract(6, "day");
      ranges.unshift({
        startDate: start.format("YYYY-MM-DD"),
        endDate: end.format("YYYY-MM-DD"),
      });
      end = start.subtract(1, "day");
    }
    return ranges;
  };

  const fetchWeeklySales = async (endDate) => {
    const ranges = getWeeklyRanges(endDate);
    try {
      const requests = ranges.map((range) =>
        getSalesSummary({ startDate: range.startDate, endDate: range.endDate })
      );
      const results = await Promise.all(requests);
      return results.map((res, i) => ({
        ...res,
        weekLabel: `Semana ${i + 1}`,
        range: ranges[i],
      }));
    } catch (error) {
      console.error("Error fetching weekly sales:", error);
      return [];
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
    const interval = setInterval(() => {
      const data = {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        from: "DashboardPage",
      };
      const weeksAgo = startDate.subtract(1, "week");
      const week2Ago = weeksAgo.subtract(1, "week");
      const week3Ago = week2Ago.subtract(1, "week");
      const week4Ago = week3Ago.subtract(1, "week");
      const week5Ago = week4Ago.subtract(1, "week");
      const week6Ago = week5Ago.subtract(1, "week");
      const week7Ago = week6Ago.subtract(1, "week");

      const windowSales = {
        startDate: formatDate(weeksAgo),
        endDate: formatDate(endDate),
        from: "DashboardPage",
      };
      const week1Sales = {
        startDate: formatDate(startDate),
        endDate: formatDate(weeksAgo),
        from: "DashboardPage",
      };
      const week2Sales = {
        startDate: formatDate(week2Ago),
        endDate: formatDate(weeksAgo),
        from: "DashboardPage",
      };
      const week3Sales = {
        startDate: formatDate(week3Ago),
        endDate: formatDate(week2Ago),
        from: "DashboardPage",
      };
      const week4Sales = {
        startDate: formatDate(week4Ago),
        endDate: formatDate(week3Ago),
        from: "DashboardPage",
      };
      const week5Sales = {
        startDate: formatDate(week5Ago),
        endDate: formatDate(week4Ago),
        from: "DashboardPage",
      };
      const week6Sales = {
        startDate: formatDate(week6Ago),
        endDate: formatDate(week5Ago),
        from: "DashboardPage",
      };
      const week7Sales = {
        startDate: formatDate(week7Ago),
        endDate: formatDate(week6Ago),
        from: "DashboardPage",
      };
      const getWindow = async () => {
        const data = await fetchWeeklySales(endDate);
        setWeeklySales(data);
      };

      getWindow();

      getSales(data);
      getTickets(data);
      message.info("Actualizado", 3);
    }, 20000);
    return () =>  clearInterval(interval); // Clean to unmount
  }, [startDate, endDate]);

  useEffect(() => {
    if (salesTickets && sellers) {
      const summarized = summarizeSalesBySeller(salesTickets, sellers);
      setSalesSeller(summarized);
      //console.debug("Sales summarized by seller [Dashboard]: ", summarized);
    }
    if (sales && salesTickets && sellers) {
      console.debug(" ====#####  Carga completa [Dashboard]: ");
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [salesTickets, sellers, sales]);

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
              <div style={{ textAlign: "center", padding: "2px" }}>
                <h4 style={{ marginBottom: "-4px" }}>Venta total</h4>
                <Statistic
                  value={totalAmount}
                  valueStyle={{ color: "#3f8600", fontSize: "18px" }}
                />
                <h5 style={{ marginBottom: "1px" }}>Fecha inicio</h5>
                <DatePicker
                  value={startDate}
                  onChange={(date) => handleChangeDate("startDate", date)}
                />
                <h5 style={{ marginBottom: "1px" }}>Fecha fin</h5>
                <DatePicker
                  value={endDate}
                  onChange={(date) => handleChangeDate("endDate", date)}
                />
                <div style={{ padding: "2px" }}>
                  {salesSeller.map((sellerData) => (
                    <div>
                      <Divider style={{ marginBottom: "0px" }}>
                        <Text strong>{sellerData.sellerName} </Text>
                      </Divider>
                      <Text strong>Total Venta: </Text>
                      {formatter.format(sellerData.totalAmount)} <br />
                      <Text strong>Total Kilos: </Text>
                      {sellerData.totalKilos.toFixed(3)} kg <br />
                      <Text strong>Total Unidades: </Text>
                      {sellerData.totalUnits} <br />
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
                top: isMobile ? "20px" : "10px",
                marginTop: isMobile ? "50px" : "100px",
              }}
              tooltip={isMinimized ? "Expandir" : "Minimizar"}
            />
          </div>
        </Col>
      </Row>
      <br /> <br />
      <Row span={20}>
        {!waitToPlot ? (
          <Col span={12}>
            {sales !== undefined && salesTickets !== undefined && sellers !== undefined ? (
              <ChartMoreSell
                sales={sales}
                salesTickets={salesTickets}
                sellers={sellers}
                weeklySales={[...weeklySales].reverse()}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Spin type="secondary">Cargando gráfico de ventas...</Spin>
              </div>
            )}
          </Col>
        ) : (
          <Col span={12}>
            <div style={{ textAlign: "center", padding: "20px", margin: "20px" }}>
              <h4 style={{ marginBottom: "4px" }}>Cargando ...</h4>
              <Spin size="large" type="secondary" tip="Cargando gráfico de ventas..."></Spin>
            </div>
          </Col>
        )}
      </Row>
      <Modal
        open={isLoading}
        footer={null}
        closable={false}
        centered
        bodyStyle={{ textAlign: "center" }}
      >
        <Spin size="large" tip="Cargando datos..." />
      </Modal>
    </div>
  );
};

export default DashboardPage;
