import React, { useEffect, useState, useRef } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


import { getProductById } from "../../../services/productService";
import { getTopProductsByType } from "../../../utils/topProductsByType";
import TopProductsChart from "./topProductsChart";

import "./chartMoreSell.css";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Lo más vendido",
      font: {
        size: 20,
        weight: "bold",
      },
    },
  },
};

const productType = {
  weight_based: "Kg",
  unit_based: "Unidades",
  packaged: "Paquete",
  piece_based: "Piezas",
}

const params = {
  'end_date': '2025-03-28',
  'start_date': '2025-03-01',

}

const ChartMoreSell = (props) => {
  console.debug('Props received [chartMoreSell]: ', props);
  const topProducts = props.sales ? props.sales.details.map(p => ({
    product_id: p.product_id,
    total_quantity: parseFloat(p.total_quantity)
  }))
  .sort((a, b) => b.total_quantity - a.total_quantity)
  .slice(0, 5) : [];
  //console.debug('===°° %% Top products [chartMoreSell]: ', topProducts);

  const sellersData = props.sellers.map((seller) => {
      return { id: seller.id, name: seller.first_name };
    }
    );
  //console.debug('===°° %% Sellers data [chartMoreSell]: ', sellersData);
  const resultProducts = getTopProductsByType(props.salesTickets);
  console.debug('=== %% Top Result products by type [chartMoreSell]: ', resultProducts);

  const [sales, setSales] = useState();

  const [productsSells, setProductsSells] = useState([]);
  const productsName = [];
  const [products, setProducts] = useState([]);
  const hasFetched = useRef(false); // ← Referencia persistente
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedStartMonth, setSelectedStartMonth] = useState(0); // January
  const [selectedEndMonth, setSelectedEndMonth] = useState(11); // December

  const getProductByIds = async (id) => {
    try {
      let data = await getProductById(id);
      return data
    } catch (error) {
      throw new Error("Failed to get products");
    }
  }

  const fetchAllProducts = async () => {
    setLoadingProducts(true);
    const productPromises = topProducts.map(p => getProductByIds(p.product_id));
    try {
      const productsData = await Promise.all(productPromises);// espera a que todas terminen
      setProducts(productsData);
      //console.debug("Fetched products: ", productsData);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoadingProducts(false);
    }
  }


  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true; // try no repeat runs
      //fetchAllProducts();
    }
  }, []);

  //console.debug('====Products by ID [chartMoreSell]: ', productsName);
  let nameList = [];
/*    for (let i = 0; i < topProducts.length; i++) {
    console.debug('Top products ID: ', topProducts[i].product_id);
    const data = getProductByIds(topProducts[i].product_id);
    setProductsSells(prev => [...prev, data]);
    productsName.push(data);
    console.debug("Products sells [chartMoreSell]: ", productsSells);
      console.debug("Products name [chartMoreSell]: ", productsName);

    //nameList.push({name: productsName[i].name, id: topProducts[i].product_id, quantity: topProducts[i].total_quantity});

  }  */

    //console.debug('Products [chartMoreSell]: ', products);
  //console.debug('###### Name list [chartMoreSell]: ', nameList);
  //console.debug("Products sells [chartMoreSell]: ", productsSells);
  //console.debug("Products name [chartMoreSell]: ", productsName);

 let sellersMap = {};
 props.salesTickets.forEach(({ seller, service_quality }) => {


    if (!sellersMap[seller]) {
      sellersMap[seller] = { good: 0, bad: 0, regular: 0 };
    }
    if (service_quality === 'GOOD') {
      sellersMap[seller].good += 1;
      sellersMap[seller].name = sellersData.find(s => s.id === seller).name;
    }
    if (service_quality === 'BAD') {
      sellersMap[seller].bad += 1;
      sellersMap[seller].name = sellersData.find(s => s.id === seller).name;
    }
    if (service_quality === 'REGULAR') {
      sellersMap[seller].regular += 1;
      sellersMap[seller].name = sellersData.find(s => s.id === seller).name;
    }
  });

//console.debug('>>>>>>> Service quality SellerMap[chartMoreSell]: ', sellersMap);
 //console.debug('Products name [chartMoreSell]: ', productsName);
  const data = {
  labels:topProducts.map(p => `Producto ${p.product_id}`),
  //labels: nameList,
  datasets: [
    {
      label: "Cantidad total vendida",
      backgroundColor: "rgba(14, 199, 73, 0.89))",
      borderColor: "rgba(75,192,192,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgb(44, 224, 170)",
      hoverBorderColor: "rgba(75,192,192,1)",
      data: topProducts.map(p => p.total_quantity),
    },
  ],
};

  // * Receive data from parent to plot and sync with Date picker

    const handleEndMonthChange = (e) => {
      const newEnd = parseInt(e.target.value);
      setSelectedEndMonth(newEnd);
      if (newEnd < selectedStartMonth) {
        setSelectedStartMonth(newEnd);
      }
    };

    // Convertir el map a un array de gráficos
  const sellerCharts = Object.entries(sellersMap).map(([sellerId, counts]) => {

    const chartData = {
      labels: ['Bueno', 'Malo', 'Regular'],
      datasets: [
        {
          data: [counts.good, counts.bad, counts.regular],
          backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
          hoverOffset: 4,
        },
      ],
    };

    return (
      <div key={sellerId} style={{ width: "200px", margin: "-2px" }}>
        <h3>Vendedor {counts.name}</h3>
        <Pie data={chartData} />
      </div>
    );
  });

  return (
  <div className="chart-container" >
    <div style={{ width: "100%", height: "250px" }}>
      <Bar data={data} options={options} />
    </div>
    <div className="chart-sellers" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>{sellerCharts} </div>
    <TopProductsChart
      title="Top productos más y menos vendidos (Kg)"
      mostSold={resultProducts.weight_based.topMostSold}
      leastSold={resultProducts.weight_based.topLeastSold}
    />

  </div>
);
}

export default ChartMoreSell;
