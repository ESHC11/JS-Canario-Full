import { Routes, Route, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import AuthPage from "./pages/AuthPage"
import Shop from "./pages/Shop"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import OrderSuccess from "./pages/OrderSuccess"
import Orders from "./pages/Orders"
import Profile from "./pages/Profile"
import Wishlist from "./pages/Wishlist"

import AdminRoute from "./components/layout/AdminRoute"
import Dashboard from "./pages/admin/Dashboard"
import ManageProducts from "./pages/admin/ManageProducts"
import ManageCategories from "./pages/admin/ManageCategories"
import ManageOrders from "./pages/admin/ManageOrders"
import ProductForm from "./pages/admin/ProductForm"
import EditProduct from "./pages/admin/EditProduct"

function App() {
    const location = useLocation()
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname.startsWith('/admin')

    return (
        <>
            {!isAuthPage && <Navbar />}
            <Routes>
                {/* Rutas Públicas y de Tienda */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<AuthPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/success" element={<OrderSuccess />} />
                
                {/* Rutas de Usuario */}
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<Wishlist />} />

                {/* Rutas de Administración Protegidas */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/admin/products" element={<ManageProducts />} />
                    <Route path="/admin/categories" element={<ManageCategories />} />
                    <Route path="/admin/orders" element={<ManageOrders />} />
                    <Route path="/admin/products/new" element={<ProductForm />} />
                    <Route path="/admin/products/edit/:id" element={<EditProduct />} />
                </Route>
            </Routes>
            {!isAuthPage && <Footer />}
        </>
    )
}

export default App
