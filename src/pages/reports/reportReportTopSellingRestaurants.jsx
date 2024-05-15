import { useEffect, useState, useRef } from 'react'
import { getCurrentUserToken } from '../../utils/UserlocalStorage'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,

  } from 'chart.js'
  import { Line } from 'react-chartjs-2'


function TopSellingRestaurants({startDate, endDate, topNum}) {

    const [reportData, setReportData] = useState([]);
    const chartRef = useRef(null);


    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
    )


    const fetchDataReport = async (url = `http://127.0.0.1:8000/api/v1/reports/top-selling-restaurants/?startDate=${startDate}&endDate=${endDate}&topNum=${topNum}`) => {

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

        const totalOrders = reportData['data']?.map(order => order.total_orders);
        const restaurant = reportData['data']?.map(order => order.restaurant);
        return { totalOrders, restaurant };
        
    };

    const chartOptions = {
        responsive: true,
        // maintainAspectRatio: false, // Set to false to allow the chart to resize freely
        locale:'pt-BR',
        scales: {
        y: {
          title: {
            display: true,
            text: 'Total de pedidos'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Restaurates'
          }
        }
      }
    };

    const chartData = {
        labels: processChartData().restaurant,
        
        datasets: [
        {
            label: 'Total de pedidos',
            data: processChartData().totalOrders,
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
        }
        ],
        hoverOffset: 4

    };


    const downloadChart = () => {

      const chartInstance = chartRef.current;
      const link = document.createElement('a');
      link.download = 'reportAverageOrderPriceOverTime.jpeg';
      link.href = chartInstance?.toBase64Image('image/jpeg', 1);
      link.click();

  };

  return (
    <>
      <Line ref={chartRef} data={chartData} options={chartOptions} />
      <button onClick={downloadChart} className="mt-5 btn btn-success btn-xs sm:btn-sm md:btn-md lg:btn-lg">Baixar relatório</button>                       
    </>
  )
}

export default TopSellingRestaurants
