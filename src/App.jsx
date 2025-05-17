import React, { useState } from "react"
import { Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Home from "./pages/Home"
import Booking from "./pages/Booking"
import Admin from "./pages/Admin"
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Cart from './components/Cart'
import Footer from './components/Footer'
import { DataProvider } from "./redux/compat/DataContextCompat"
import { OrderProvider } from "./redux/compat/OrderContextCompat"
import { AppointmentProvider } from "./context/AppointmentContext"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from 'react-redux'
import store from './redux/store'
import { ThemeProvider } from "./context/ThemeContext"

function App() {
  // Admin kimlik doğrulama durumu için state kullanıyoruz
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <DataProvider>
          <OrderProvider>
            <AppointmentProvider>
              <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
                {/* Toast bildirimleri için container */}
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss={false}
                  draggable
                  pauseOnHover
                  theme="colored"
                />
                <Header 
                  isAuthenticated={isAuthenticated}
                />
                
                {/* Sepet bileşeni */}
                <Cart />
                
                <main className="flex-grow">
                  <Routes>
                    {/* Ana Sayfa */}
                    <Route path="/" element={<Home />} />
                    
                    {/* Rezervasyon Sayfası */}
                    <Route path="/booking/:packageId" element={<Booking />} />
                    
                    {/* Admin Sayfası */}
                    <Route 
                      path="/admin" 
                      element={
                        <Admin 
                          isAuthenticated={isAuthenticated} 
                          setIsAuthenticated={setIsAuthenticated} 
                        />
                      } 
                    />
                    
                    {/* Ürünler Sayfası */}
                    <Route path="/products" element={<Products />} />
                    
                    {/* Ürün Detay Sayfası */}
                    <Route path="/products/:productId" element={<ProductDetail />} />
                    
                    {/* Hakkımızda Sayfası */}
                    <Route path="/about" element={<About />} />
                  </Routes>
                </main>
                
                <Footer />
              </div>
            </AppointmentProvider>
          </OrderProvider>
        </DataProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App
