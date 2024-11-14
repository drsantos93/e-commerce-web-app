import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import theme from './theme'
import router from './routes/router'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import './App.css'
import {store} from './redux/store'
import { Provider } from 'react-redux'

function App() {

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnHover
        />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  )
}

export default App
