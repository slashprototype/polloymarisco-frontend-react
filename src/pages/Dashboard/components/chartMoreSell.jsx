import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { getSalesSummary } from "../../../services/salesService";
import { getProductById } from "../../../services/productService";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

const params = {
  'end_date': '2025-03-28',
  'start_date': '2025-03-01',

}


const ChartMoreSell = (props) => {
  console.debug('Props received [chartMoreSell]: ', props);
  const topProducts = props.sales.details.map(p => ({
    product_id: p.product_id,
    total_quantity: parseFloat(p.total_quantity)
  }))
  .sort((a, b) => b.total_quantity - a.total_quantity)
  .slice(0, 5);

  console.debug('Top products: ', topProducts);
  
  //const [topProducts, setTopProducts] = useState();
  const [sales, setSales] = useState();
  //const sales = useRef
  const [productsSells, setProductsSells] = useState([]);
  const productsName = [];
  const [products, setProducts] = useState([]);
  const hasFetched = useRef(false); // ← Referencia persistente

  const [selectedStartMonth, setSelectedStartMonth] = useState(0); // January
  const [selectedEndMonth, setSelectedEndMonth] = useState(11); // December

  const getProductByIds = async (id) => {
    try {
      let data = await getProductById(id);
      //console.debug("Response product by id[data]: ", data);
      setProductsSells(prev => [...prev, data]);
      productsName.push(data);
      //return data
    } catch (error) {
      throw new Error("Failed to get products");
    }
  }


  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true; // try no repeat runs
      
    /*   for (let i = 0; i < topProducts.length; i++) {
        //setProducts(prevProducts => [...prevProducts,  getProductByIds(topProducts[i].product_id)]);
        getProductByIds(topProducts[i].product_id)
      } */
    }
  }, []);

  //console.debug('====Products by ID [chartMoreSell]: ', productsName);
  let nameList = [];
 /*  for (let i = 0; i < topProducts.length; i++) {
    if (productsName[i].id === topProducts[i].product_id) {
      nameList.push(productsName[i].name);
    }
  } */
 let _quallity = {
   good: 0,
   bad: 0,
   regular: 0
 };
 for(let i = 0 ; i < props.salesTickets.length; i++){
    console.debug('Service quality [chartMoreSell]: ', props.salesTickets[i].service_quality);
    if (props.salesTickets[i].service_quality == 'GOOD') {
      _quallity.good = _quallity.good + 1;
    } else if (props.salesTickets[i].service_quality == 'BAD') {
      _quallity.bad = _quallity.bad + 1;
    } else if (props.salesTickets[i].service_quality == 'REGULAR') {
      _quallity .regular = _quallity.regular + 1;
    }

 }
 console.debug('>>>>>Service quality [chartMoreSell]: ', _quallity);
 console.debug('Products name [chartMoreSell]: ', productsName);
  const data = {
  labels:topProducts.map(p => `Producto ${p.product_id}`),
  //labels: nameList,
  datasets: [
    {
      label: "Cantidad total vendida",
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(75,192,192,0.6)",
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


  //console.debug('Products by ID[productsSells]: ', productsSells);
  //console.debug('Products name [chartMoreSell]: ', productsName);

  return (
  <div className="chart-container" >

    <Bar data={data} options={options} />
  </div>
);
}

export default ChartMoreSell;
