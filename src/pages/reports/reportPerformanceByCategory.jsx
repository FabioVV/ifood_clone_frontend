import { useEffect, useState } from 'react'
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
    BarElement
  } from 'chart.js'
  import { Bar } from 'react-chartjs-2'


function SalesPerformanceByProductCategory({startDate, endDate}) {

    const [reportData, setReportData] = useState([]);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        BarElement,
    )
    

    const fetchDataReport = async (url = `http://127.0.0.1:8000/api/v1/reports/sales-performance-by-product-category/?startDate=${startDate}&endDate=${endDate}`) => {

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

        const categories = reportData['data']?.map(item => item.categories__name);
        const salesMetrics = reportData['data']?.map(item => item.total_sales); // Assuming 'sales' is the sales metric for each category
        return { categories, salesMetrics };
        
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        locale:'pt-BR',
    };

    const chartData = {
        labels: processChartData().categories,
        
        datasets: [
        {
            label: 'Total de vendas (UN)',
            data: processChartData().salesMetrics,
            borderWidth: 2,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
        }
        ],
        hoverOffset: 4

    };

  return (
    <Bar data={chartData} options={chartOptions} />
  )
}

export default SalesPerformanceByProductCategory 
