import {BrowserRouter as Router} from 'react-router-dom'
import './index.css'
import _Routes from './routes'


function App() {
  return (
    <>
        <Router>
            <_Routes/>
        </Router>
    </>
  )
}

export default App
