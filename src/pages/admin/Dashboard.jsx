import {Box, Button, Typography} from "@mui/material"
import { retrieveProducts } from "../../api/products"
import { prefetchData, useData } from '../../../utils/data-loader'
import { useEffect } from "react"

prefetchData(retrieveProducts)



function Dashboard(){
    const test = useData()
    

    useEffect(()=>{
        window.dispatchEvent(new Event('dataFetch')) 
    },[])

    const handleClick = ()=>{
        console.log(test,'click-test')
    }

    return (
        <Box>
            <Typography variant="h1">
                Hello World!
            </Typography>
            <Button variant="contained" onClick={handleClick}>Click Me</Button>
        </Box>
    )
}

export default Dashboard