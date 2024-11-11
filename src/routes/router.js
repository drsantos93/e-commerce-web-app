import { createBrowserRouter } from "react-router-dom"
import AdminRoute from "./AdminRoute"
import MainRoute from "./MainRoute"

const router = createBrowserRouter([...AdminRoute, ...MainRoute])

export default router
