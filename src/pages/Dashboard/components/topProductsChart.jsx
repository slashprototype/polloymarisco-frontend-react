import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TopProductsChart = ({ title, mostSold, leastSold }) => {
  const labelsMost = mostSold.map(item => item.name);
  const dataMost = mostSold.map(item => item.quantity);


  const labelsLeast = leastSold.map(item => item.name);
  const dataLeast = leastSold.map(item => item.quantity);

  const customWidth = mostSold.length > 15 ? 800 : 600; // Adjust width based on number of products
  const customHeight = mostSold.length > 8 ? 900 : 500; // Adjust height based on number of products

  return (
    <div style={{ width: "150%", height: customHeight, marginTop: "40px" }}>
      <h4 style={{ textAlign: "center" }}>{title}</h4>
      <Bar

        data={{
          labels: [...labelsMost, ...labelsLeast],
          datasets: [
            {
              label: "Más Vendidos",
              data: [...dataMost, ...Array(leastSold.length).fill(0)],
              backgroundColor: "rgba(54, 162, 235, 0.7)", // azul
              barThickness: 22,
            },
            {
              label: "Menos Vendidos",
              data: [...Array(mostSold.length).fill(0), ...dataLeast],
              backgroundColor: "rgba(255, 99, 132, 0.7)", // rojo
              barThickness: 22,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y",
          categoryPercentage: 0.8, // espacio entre grupos
          barPercentage: 0.9,
          plugins: {
            legend: {
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Cantidad vendida" },
            },
            x: {
                stacked: false,
              ticks: {
                maxRotation: 90,
                minRotation: 45,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default TopProductsChart;
