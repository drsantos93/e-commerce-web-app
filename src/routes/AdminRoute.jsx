// we need a main layout
// then after main layout all the pages
import MainAdminLayout from "../components/layouts/MainAdminLayout"
import Dashboard from "../pages/admin/Dashboard"
import Products from "../pages/admin/Products"
const AdminRoute = [
    {
        path: '/admin',
        element: <MainAdminLayout/>,
        children: [
            {
                path: "",
                element: <Dashboard/>
            },
            {
                path: "/admin/products",
                element: <Products/>
            }
        ]
    }
]

export default AdminRoute