import { useEffect, useState } from 'react'
import DefaultPage from '../../components/DefaultPage'

import ReportAvgPriceOverTime from './reportAvgPriceOverTime'
import SalesPerformanceByProductCategory from './reportPerformanceByCategory'
import TopSellingProducts from './reportTopSellingProducts'
import ProductPriceVsTotalSold from './reportProductPriceVsTotalSold'

function ReportsFilter() {

    const [reportType, setReportType] = useState('')
    const [showReport, setShowReport] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [topNum, setTopNum] = useState(10)


    function clearFields(){
        setEndDate('')
        setStartDate('')
    }

    function handleProductsNumber(e){
        const numberRegex = /^[0-9]+$/

        if (numberRegex.test(e.target.value) || e.target.value == '') {
            setTopNum(e.target.value)
        } 

    }


    useEffect(()=>{clearFields();}, [reportType])

    useEffect(() => {
        switch (showReport) {
            case '1':
                setShowReport(<ReportAvgPriceOverTime startDate={startDate} endDate={endDate}/>);
                break;
            case '2':
                setShowReport(<SalesPerformanceByProductCategory startDate={startDate} endDate={endDate}/>);
                break;
            case '3':
                setShowReport(<TopSellingProducts topNum={topNum} startDate={startDate} endDate={endDate}/>);
                break;
            case '4':
                setShowReport(<ProductPriceVsTotalSold topNum={topNum} startDate={startDate} endDate={endDate}/>);
                break;
        
    }
    }, [showReport, startDate, endDate, topNum]);

    /*
        Average Order Value Over Time:
        X-axis: Time (e.g., daily, weekly, monthly).
        Y-axis: Average order value.
        Filter: Date range.
        Chart Type: Line chart.
    */

    /*
        Sales Performance by Product Category:
        X-axis: Product category.
        Y-axis: Total sales amount.
        Filter: Date range.
        Chart Type: Vertical bar chart.
    */

    /*
        Top Selling Products:
        X-axis: Product name.
        Y-axis: Quantity sold.
        Filter: Date range.
        Chart Type: Horizontal bar chart.
    */
  return (
    // Restaurantes que mais venderam
    <DefaultPage>
        <section className='reports-container'>
            <div id='filter-side'>
                <h1 className='payment-title'>Relatórios</h1>
                <select value={reportType} onChange={(event)=>setReportType(event.target.value)} className="select select-bordered select-lg w-full max-w">
                    <option value='' disabled selected>Escolha um relátorio</option>
                    <option value='1'>Restaurantes que mais venderam</option>
                    <option value='2'>Produtos mais vendidos de cada categoria</option>
                    <option value='3'>Produtos mais vendidos</option>
                    <option value='4'>Total vendidos do produto VS seu preço</option>

                </select>

                {(() => {
                switch (reportType) {
                    
                    case '1':
                        return <>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">De</span>
                                </div>
                                <input value={startDate} onChange={(e)=>setStartDate(e.target.value)} type="datetime-local" className="input input-bordered w-full max-w-xs" />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Até</span>
                                </div>
                                <input value={endDate} onChange={(e)=>setEndDate(e.target.value)} type="datetime-local" className="input input-bordered w-full max-w-xs" />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Quantos restaurantes?</span>
                                </div>
                                <input value={topNum} onChange={(e)=>handleProductsNumber(e)} type="number" placeholder="Digite o número aqui" className="input input-bordered w-full max-w-xs" />
                            </label>
                            <button onClick={() => {setShowReport('1')}} className="mt-5 btn btn-outline btn-info btn-xs sm:btn-sm md:btn-md lg:btn-lg">Gerar relatório</button>                        </>
                    case '2':
                        return <>
                            {/* <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">De</span>
                                </div>
                                <input value={startDate} onChange={(e)=>setStartDate(e.target.value)} type="datetime-local" className="input input-bordered w-full max-w-xs" />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Até</span>
                                </div>
                                <input value={endDate} onChange={(e)=>setEndDate(e.target.value)} type="datetime-local" className="input input-bordered w-full max-w-xs" />
                            </label> */}
                            <button onClick={()=>{setShowReport('2')}} className="mt-5 btn btn-outline btn-info btn-xs sm:btn-sm md:btn-md lg:btn-lg">Gerar relatório</button>
                        </>
                    case '3':
                        return <>
                            {/* <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">De</span>
                                </div>
                                <input value={startDate} onChange={(e)=>setStartDate(e.target.value)} type="datetime-local" className="input input-bordered w-full max-w-xs" />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Até</span>
                                </div>
                                <input value={endDate} onChange={(e)=>setEndDate(e.target.value)} type="datetime-local" className="input input-bordered w-full max-w-xs" />
                            </label> */}

                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Quantos produtos?</span>
                                </div>
                                <input value={topNum} onChange={(e)=>handleProductsNumber(e)} type="number" placeholder="Digite o número aqui" className="input input-bordered w-full max-w-xs" />
                            </label>
                            <button onClick={()=>{setShowReport('3')}} className="mt-5 btn btn-outline btn-info btn-xs sm:btn-sm md:btn-md lg:btn-lg">Gerar relatório</button>
                        </>
                        case '4':
                            return <>
                                {/* <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text">De</span>
                                    </div>
                                    <input value={startDate} onChange={(e)=>setStartDate(e.target.value)} type="datetime-local" className="input input-bordered w-full max-w-xs" />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text">Até</span>
                                    </div>
                                    <input value={endDate} onChange={(e)=>setEndDate(e.target.value)} type="datetime-local" className="input input-bordered w-full max-w-xs" />
                                </label> */}
    
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text">Quantos produtos?</span>
                                    </div>
                                    <input value={topNum} onChange={(e)=>handleProductsNumber(e)} type="number" placeholder="Digite o número aqui" className="input input-bordered w-full max-w-xs" />
                                </label>
                                <button onClick={()=>{setShowReport('4')}} className="mt-5 btn btn-outline btn-info btn-xs sm:btn-sm md:btn-md lg:btn-lg">Gerar relatório</button>
                            </>
                    default:
                        return null
                }
                })()}

            </div>

            <div id='chart-side' style={{ width: '80vw' }}>
                {showReport}
            </div>

        </section>

    </DefaultPage>
  )
}

export default ReportsFilter
