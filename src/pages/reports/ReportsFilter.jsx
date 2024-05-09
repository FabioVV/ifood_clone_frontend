import { useState } from 'react'
import DefaultPage from '../../components/DefaultPage'
import { getCurrentUserToken } from '../../utils/UserlocalStorage'


function ReportsFilter() {

    const [reportType, setReportType] = useState('')

    const fetchDataReport = async (url = `http://127.0.0.1:8000/api/v1/reports/filter-data/?teste=${1}`) => {
    
        try{
          const response = await fetch(url, {
            method:'GET',
            headers:{ Authorization:` Token ${getCurrentUserToken()}`, 'Content-Type': 'application/json'},
          })
      
          const data = await response.json()
          console.log(data)

        } catch(e){
          console.log(e.message)
    
        } 

    }
    /*
        Sales Performance by Product Category:
        X-axis: Product category.
        Y-axis: Total sales amount.
        Filter: Date range.
        Chart Type: Vertical bar chart.
    */

    /*
        Average Order Value Over Time:
        X-axis: Time (e.g., daily, weekly, monthly).
        Y-axis: Average order value.
        Filter: Date range.
        Chart Type: Line chart.
    */

    /*
        Top Selling Products:
        X-axis: Product name.
        Y-axis: Quantity sold.
        Filter: Date range.
        Chart Type: Horizontal bar chart.
    */
  return (
    <DefaultPage>

         

        <section className='reports-container'>
            <div id='filter-side'>
                <h1 className='payment-title'>Relatórios</h1>
                <select value={reportType} onChange={(event)=>setReportType(event.target.value)} className="select select-bordered select-lg w-full max-w">
                    <option value='' disabled selected>Escolha uma forma de relátorio</option>
                    <option value='1'>Preço médio de pedido em determinado período</option>
                    <option value='2'>Produtos mais vendidos de cada categoria</option>
                    <option value='3'>Produtos mais vendidos</option>

                </select>

                {(() => {
                switch (reportType) {
                    case '1':
                        return <></>
                    case '2':
                        return <>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">De</span>
                                </div>
                                <input type="datetime-local" className="input input-bordered w-full max-w-xs" />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Até</span>
                                </div>
                                <input type="datetime-local" className="input input-bordered w-full max-w-xs" />
                            </label>
                            <button className="mt-5 btn btn-outline btn-info btn-xs sm:btn-sm md:btn-md lg:btn-lg">Gerar relatório</button>
                        </>
                    default:
                        return ""
                }
                })()}
            
            </div>

            <div id='chart-side'>
            
            </div>

        </section>


    </DefaultPage>
  )
}

export default ReportsFilter
