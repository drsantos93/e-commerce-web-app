import { createTheme } from '@mui/material'

const themeOptions = createTheme({
    palette:{
        primary:{
            main: "#3079e6"
        },
        success:{
            main: "#30e661"
        },
        secondary:{
            main: "#bdc2c9"
        },
        error:{
            main: "#d42828"
        }
    },
    typography:{
        fontFamily: '"Roboto", sans-serif'
    }
})

export default themeOptions