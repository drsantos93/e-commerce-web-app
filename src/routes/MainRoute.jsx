// we need a main layout
// then after main layout all the pages
import MainLayout from "../components/layouts/MainLayout"
import Home from "../pages/main/Home"
import Cart from "../pages/main/Cart"

const MainRoute = [
    {
        path: '/',
        element: <MainLayout/>,
        children: [
            {
                path: "",
                element: <Home/>
            },
            {
                path: "/cart",
                element: <Cart/>
            }
        ]
    }
]

export default MainRoute