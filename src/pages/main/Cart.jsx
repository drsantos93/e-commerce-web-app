import { Typography, Box, Card, Button, CardHeader, CardMedia, CardContent, Pagination } from "@mui/material"
import { useEffect, useLayoutEffect, useState } from "react"
import { Search, SearchIconWrapper, StyledInputBase } from "../../components/Search"
import { Search as SearchIcon } from '@mui/icons-material';
import { retrieveCartItems } from "../../api/products";
import { useDispatch, useSelector } from "react-redux";
import { verify } from "../../api/auth";
import { reset, setUser } from "../../redux/slice";
import { jwtDecode } from "jwt-decode";

const Cart = () =>{
    const [row, setRows] = useState([])
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const token = sessionStorage.getItem('user')
    const dispatch = useDispatch()
    
 

    // will trigger when page updates
    useEffect(()=>{
        setRows([])
        // band-aid
        let userc = {}
        verify(token)
        .then(res=>{
            if(res){
                const userm = jwtDecode(token)
                 
                dispatch(setUser(userm)) //redux
                
                userc = userm
            }else{
                dispatch(reset())
                sessionStorage.clear()
                nav("../")
            }
        }).finally(()=>{
            retrieveCartItems(userc.user_id,page)
            .then(res=>{
                setRows(res.data)
                setTotalPage(res.total_pages)
            })
        })
       

        
    },[page])


    const handlePageChange = (event, value) =>{
        
        setPage(value)
    }

    return (
        <Box sx={{flex: 1, minHeight: 0, minWidth:0, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', width: '100%'}}>
            
          

            {/* Items */}
            {
                    row.length === 0 ? <Typography variant="h1" color="secondary">No Data</Typography> :   
                    <Box mt={2}>
                        <Pagination count={totalPage} onChange={handlePageChange} color="primary"/>
                    </Box>
            }
            <Box sx={{
                flex:1,
                p:2,  
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px,1fr))', 
                gap: 2,     
                width: '100%',
                minHeight: 0
            }}>
                {
                    row.map((item, index)=>(
                         <Card sx={{height: '100%'}} key={item.id+page}>
                            <CardHeader 
                                title={`${item.item.name}`}
                                subheader={`${item.item.type.type}`}
                                
                            />
                            <Typography sx={{ml: 2, fontWeight: 'bold'}} color="primary">
                                Price: {new Intl.NumberFormat('ja-JP',{style: 'currency', currency: 'JPY'}).format(parseFloat(item.item.price))}
                            </Typography>
                            <CardMedia
                                component="img"
                                sx={{p:2, width: '100%',height: '300px',objectFit: 'contain'}}
                                src={`${item.item.image_src}`}
                                alt="Picture of post"
                            />
                            <CardContent sx={{display: 'flex',flexDirection: 'column', gap: 1, minWidth:0}}>
                                <Box sx={{flex: 1, minHeight: '0', maxHeight: '200px', maxWidth: '100vw', wordWrap: 'break-word',overflowY: 'auto'}}>
                                    {item.item.description} <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                                </Box>

                                <Box sx={{flex: 1,minHeight: 0, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 3}}>
                                    <Typography color="info">Quantity: {item.quantity}</Typography>
                                    <Button variant="contained" color="warning">Proceed to checkout</Button>
                                    <Button variant="contained" color="error" >Remove from cart</Button>
                                </Box>

                            </CardContent>
                        </Card>
                    ))
                   
                }
               
            </Box>
            
        </Box>
    )
}

export default Cart