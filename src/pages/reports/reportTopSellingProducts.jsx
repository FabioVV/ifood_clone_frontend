import { useEffect, useState, useRef } from 'react'
import { getCurrentUserToken } from '../../utils/UserlocalStorage'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    BarElement
  } from 'chart.js'
  import { Bar } from 'react-chartjs-2'


function TopSellingProducts({startDate, endDate, topNum}) {

    const [reportData, setReportData] = useState([]);
    const chartRef = useRef(null);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        Title,
        Tooltip,
        Legend,
        BarElement,
    )
    

    const fetchDataReport = async (url = `http://127.0.0.1:8000/api/v1/reports/sales-product/?startDate=${startDate}&endDate=${endDate}&topNum=${topNum}`) => {

        try{
          const response = await fetch(url, {
            method:'GET',
            headers:{ Authorization:` Token ${getCurrentUserToken()}`, 'Content-Type': 'application/json'},
          })
      
          const data = await response.json()
          setReportData(data)

        } catch(e){
          console.log(e)
    
        } 

    }


    useEffect(()=>{fetchDataReport()}, [])

    const processChartData = () => {

        const products_names = reportData['data']?.map(item => item.name);
        const salesMetrics = reportData['data']?.map(item => item.total_sales); 
        return { products_names, salesMetrics };
        
    };

    const chartOptions = {
        responsive: true,
        // maintainAspectRatio: false,
        locale:'pt-BR',
        indexAxis: 'y', 
          scales: {
            y: {
              title: {
                display: true,
                text: 'Nome do produto'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Quantidade vendida'
              }
            }
          }
    };

    const chartData = {
        labels: processChartData().products_names,
        
        datasets: [
        {
            label: 'Total de vendas (UN)',
            data: processChartData().salesMetrics,
            borderWidth: 2,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
        }
        ],
        hoverOffset: 2

    };

    const downloadChart = () => {

      const chartInstance = chartRef.current;
      const link = document.createElement('a');
      link.download = 'reportTopSellingProducts.jpeg';
      link.href = chartInstance?.toBase64Image('image/jpeg', 1);
      link.click();

    };

  return (
    <>
      <Bar ref={chartRef} data={chartData} options={chartOptions} />
      <button onClick={downloadChart} className="mt-5 btn btn-success btn-xs sm:btn-sm md:btn-md lg:btn-lg">Baixar relatório</button>                       
    </>  
    )
}

export default TopSellingProducts 
