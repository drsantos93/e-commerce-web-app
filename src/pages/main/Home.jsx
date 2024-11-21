import { Typography, Box, Card, Button, CardHeader, CardMedia, CardContent, Pagination } from "@mui/material"
import { useEffect, useLayoutEffect, useState } from "react"
import { Search, SearchIconWrapper, StyledInputBase } from "../../components/Search"
import { Search as SearchIcon } from '@mui/icons-material';
import { addCartItem, retrieveCart, retrieveProductsByPage, updateCartItem } from "../../api/products";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";

const Home = () =>{
    const [row, setRows] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPage, setTotalPage] = useState(0)
    const user = useSelector(state=>state.auth.user)

    // on load

    // will trigger when page updates
    useEffect(()=>{
        setRows([])
        retrieveProductsByPage(page)
        .then(res=>{
            setRows(res.data)
            setTotalPage(res.total_pages)
        })
    },[page])


    const handlePageChange = (event, value) =>{
        setPage(value)
    }

    const addToCart = (id) =>{
        // get user's item cart
        // backend ^^^
        setLoading(true)
        let carte
        let existedItem = {}
        retrieveCart(user.user_id).then(res=>{
            carte = JSON.parse(JSON.stringify(res.data))
            
        }).finally(()=>{
            // iterate all cart items to get current item
            for(let cart of carte){
                
                if(id == cart.item.id){
                    existedItem.id = cart.id
                    existedItem.quantity = cart.quantity
                    
                }
            }
            
            if(Object.keys(existedItem).length > 0){
                existedItem.quantity = parseInt(existedItem.quantity) + 1
                updateCartItem(user.user_id, existedItem)
                .then(res=>{
                    if(res.ok){
                        toast.success(`Item added to cart!`)
                    }
                    setLoading(false)
                }).catch(()=>{
                    setLoading(false)
                })
            }else{
                addCartItem(user.user_id,{item: id, quantity: 1})
                .then(res=>{
                    if(res.ok){
                        toast.success(`Item added to cart!`)
                    }
                    setLoading(false)
                }).catch(()=>{
                    setLoading(false)
                })
            }
            
        })
       
        
        
    }

    return (
        <Box sx={{flex: 1, minHeight: 0, minWidth:0, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', width: '100%'}}>
            <Loading open={loading}/>
            {/* will not work yet */}
            <Card sx={{mt: 2,mb:2, width: '70%'}}>
                <Search>
                    <SearchIconWrapper>
                    <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    
                    />
                </Search>
            </Card>

            {/* paginate items */}
            <Box>
                <Pagination count={totalPage} onChange={handlePageChange} color="primary"/>
            </Box>
            {/* Items */}


            {
                    row.length === 0 ? <Typography variant="h1" color="secondary">Loading...</Typography> : null
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
                         <Card sx={{height: '100%'}} key={index+page}>
                            <CardHeader 
                                title={`${item.name}`}
                                subheader={`${item.type.type}`}
                                
                            />
                            <Typography sx={{ml: 2, fontWeight: 'bold'}} color="primary">
                                Price: {new Intl.NumberFormat('ja-JP',{style: 'currency', currency: 'JPY'}).format(parseFloat(item.price))}
                            </Typography>
                            <CardMedia
                                component="img"
                                sx={{p:2, width: '100%',height: '300px',objectFit: 'contain'}}
                                src={`${item.image_src}`}
                                alt="Picture of post"
                            />
                            <CardContent sx={{display: 'flex',flexDirection: 'column', gap: 1, minWidth:0}}>
                                <Box sx={{flex: 1, minHeight: '0', maxHeight: '200px', maxWidth: '100vw', wordWrap: 'break-word',overflowY: 'auto'}}>
                                    {item.description} <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                                </Box>

                                <Box sx={{flex: 1,minHeight: 0, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 3}}>
                                    <Button variant="contained" color="primary" sx={user ? {display: 'block'}: {display:'none'}} onClick={()=>addToCart(item.id)}>Add to cart</Button>
                                </Box>

                            </CardContent>
                        </Card>
                    ))
                   
                }
               
            </Box>
            
        </Box>
    )
}

export default Home