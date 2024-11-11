// we need a main layout
// then after main layout all the pages
import MainLayout from "../components/layouts/MainLayout"
import Home from "../pages/main/Home"

const MainRoute = [
    {
        path: '/',
        element: <MainLayout/>,
        children: [
            {
                path: "",
                element: <Home/>
            },
        ]
    }
]

export default MainRoute