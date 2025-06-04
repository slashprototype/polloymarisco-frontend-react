import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TopProductsChart = ({ title, mostSold, leastSold }) => {
  const labelsMost = mostSold.map(item => item.name);
  const dataMost = mostSold.map(item => item.quantity);

  const labelsLeast = leastSold.map(item => item.name);
  const dataLeast = leastSold.map(item => item.quantity);

  return (
    <div style={{ maxWidth: 600, margin: "30px auto" }}>
      <h3 style={{ textAlign: "center" }}>{title}</h3>
      <Bar
        data={{
          labels: [...labelsMost, ...labelsLeast],
          datasets: [
            {
              label: "Más Vendidos",
              data: [...dataMost, ...Array(leastSold.length).fill(0)],
              backgroundColor: "rgba(54, 162, 235, 0.7)", // azul
            },
            {
              label: "Menos Vendidos",
              data: [...Array(mostSold.length).fill(0), ...dataLeast],
              backgroundColor: "rgba(255, 99, 132, 0.7)", // rojo
            },
          ],
        }}
        options={{
          responsive: true,
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
