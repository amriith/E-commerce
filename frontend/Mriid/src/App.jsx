import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { Signup } from './pages/Signup'
import {Signin} from './pages/Signin'
import { Products } from "./pages/Products";
import {Cart} from "./pages/Cart";
import {Orders} from "./pages/Orders";
import {Dashboard} from "./pages/Dashboard";
import { Layout } from './pages/Layout';
function App() {

    return (
      <>
        <BrowserRouter>
          <Routes>
    <Route path="/" element={<Layout />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/products" element={<Products/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/orders" element={<Orders/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
    </Route>          
          </Routes>
        </BrowserRouter>
      </>
    )
  }
  
  export default App