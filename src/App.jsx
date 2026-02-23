import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import WarehouseStock from "./pages/WarehouseStock";
import OrdersList from "./pages/OrdersList";
import PlaceOrder from "./pages/PlaceOrder";

function App() {

  return (
    <BrowserRouter>
      <div className="app-container" style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
        <Header />
        <Navbar />
        <main style={{flex: 1, padding: '2rem 1.5rem'}}>
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<OrdersList />} />
              <Route path="/place-order" element={<PlaceOrder />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/warehouse/:id/stock" element={<WarehouseStock />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;