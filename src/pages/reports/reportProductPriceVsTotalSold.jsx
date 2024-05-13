import { useEffect, useState, useRef } from 'react'
import { getCurrentUserToken } from '../../utils/UserlocalStorage'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    BarElement,
    PointElement
  } from 'chart.js'
  import { Scatter } from 'react-chartjs-2'


function ProductPriceVsTotalSold({startDate, endDate, topNum}) {

    const [reportData, setReportData] = useState([]);
    const chartRef = useRef(null);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        Title,
        Tooltip,
        Legend,
        BarElement,
        PointElement
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

    const processChartData = reportData['data']?.map(product => {
        return {
            x: product?.price,
            y: product?.total_sales,
            r: product?.total_sales * 0.5   // Adjust the radius as needed
        };
    })

    const chartOptions = {
        responsive: true,
        // maintainAspectRatio: false,
        locale:'pt-BR',
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Preço',
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Vendas',
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: function(context) {
                        // Pego a posição do produto através do contexto, e acesso ele
                        const index = context[0]?.dataIndex;
                        return reportData['data'][index]?.name;
                    },
                    label: function(context) {
                        const index = context.dataIndex;
                        const product = processChartData[index];
                        return `Preço: ${product?.x} - Total de vendas: ${parseInt(product?.y)} unidades`;
                    }
                }
            }
        }
    };

    const chartData = {
        datasets: [
            {
                label: 'Preço VS Total vendido',
                data: processChartData,
                backgroundColor: 'rgb(75, 192, 192)'
            }
        ],

        hoverOffset: 2

    };

    const downloadChart = () => {

      const chartInstance = chartRef.current;
      const link = document.createElement('a');
      link.download = 'reportProductSalesVsPrice.jpeg';
      link.href = chartInstance?.toBase64Image('image/jpeg', 1);
      link.click();

    };

  return (
    <>
      <Scatter ref={chartRef} data={chartData} options={chartOptions} />
      <button onClick={downloadChart} className="mt-5 btn btn-success btn-xs sm:btn-sm md:btn-md lg:btn-lg">Baixar relatório</button>                       
    </>  
    )
}

export default ProductPriceVsTotalSold 
