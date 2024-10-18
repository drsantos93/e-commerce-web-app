// we need a main layout
// then after main layout all the pages
import MainLayout from "../components/layouts/MainLayout"
import Dashboard from "../pages/Dashboard"
import Profiles from "../pages/Products"
const AdminRoute = [
    {
        path: '/',
        element: <MainLayout/>,
        children: [
            {
                path: "",
                element: <Dashboard/>
            },
            {
                path: "/products",
                element: <Profiles/>
            }
        ]
    }
]

export default AdminRoute