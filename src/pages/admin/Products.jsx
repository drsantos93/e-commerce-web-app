import {Box, TextField, Typography, Button, Select, MenuItem, InputLabel, FormControl, NativeSelect} from "@mui/material"
import {useState,useEffect, useMemo, useLayoutEffect} from 'react'
import {DataGrid} from '@mui/x-data-grid'
import { retrieveProducts, DMLProducts, retrieveProductTypes } from '../../api/products'
import CustomModal from "../../components/Modal"
import { toast } from "react-toastify"
import {Edit,Delete} from '@mui/icons-material'
import $ from 'jquery'
import { Form } from "react-router-dom"


// {field: '', headerName: '' [, any css]}


function Products(){
    const [rows,setRows] = useState([])
    const [types, setTypes] = useState([])
    const [open, setOpen] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState({})
    const columns = useMemo(() =>[
        {
            field: 'id', // backend
            headerName: 'Item ID',
            width: 100,
            fontWeight: 'bold',
            
        },
        {
            field: 'name',
            headerName: 'Product Name',
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'price',
            headerName: "Price",
            flex:1,
            
        },
        {
            field: 'description',
            headerName: "Description",
            flex: 1
        },
        {
            field: "type",
            headerName: "Product Type",
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: params=>(
                <Typography>{params.row.type?.type ?? ''}</Typography>
            )
        },
        {
            field: 'image_src',
            headerName: "Image",
            flex: 1,
            sortable: false,
            renderCell: params =>(
                <Box sx={{height: 200, width: '100%' }} component='img' src={params.row.image_src} />
            )
        },
        {
            field: 'action',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            renderCell: params =>(
                <Box
                    sx={{display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center', mt:'7px'}}
                >
                    <Button 
                        sx={{flex: 1}}
                        variant="outlined" 
                        color="primary" 
                        onClick={()=>openModal("edit", params.row)}
                     >
                        <Edit />
                    </Button>
                    <Button 
                        sx={{flex: 1}} 
                        variant="outlined" 
                        color="error"
                        onClick={()=>DeleteProduct(params.row)}
                    >
                        <Delete />
                    </Button>
                </Box>
            )
        }
    ])

    const retrieve = () =>{
        retrieveProducts().then(res=>{
            setRows(res.data)
            console.log(res.data)
        })

        retrieveProductTypes()
        .then(res=>{
            setTypes(res.data)
        });
    }

    useLayoutEffect(()=>{
        retrieve()
    },[])


    const openModal = (type, item) =>{
     
        if(type === 'edit'){
            
            setEditMode(true)
            setSelectedProduct(item)
        }

        setOpen(true)
    }

    const closeModal = () =>{
        setEditMode(false)
        setSelectedProduct({})
        setOpen(false)
    }

    const AddProduct = (e) =>{
        e.preventDefault()
        // get value using jquery
        //document.getElementById
        //$("#")
        const data = {
            name:$("#Name").val(),
            price:$("#Price").val(),
            description:$("#Description").val(),
            image_src:$("#Image").val(),
            product_type: parseInt($("#ProductType").val())
        }
        console.log(data)
        // method type for adding: POST
        DMLProducts(data, "POST")
        .then(response=>{
            // API response returns: "ok", "data"
            if(response.ok){
                toast.success(`${data.name} Added!`)
                retrieve()
                closeModal()
            }else{
                // API response are: "ok", "message"
                toast.error(response.message ?? "Internal Server Error!")
            }
        })
    }

    const UpdateProduct = (e) =>{
        e.preventDefault()
        const data = {
            name:$("#Name").val(),
            price:$("#Price").val(),
            description:$("#Description").val(),
            image_src:$("#Image").val(),
            product_type:$("#ProductType").val(),
            id: selectedProduct.id
        }
        //method type for update: PATCH
        console.log("data local")
        console.log(data)
        DMLProducts(data, "PATCH")
        .then(response=>{
            // API response returns: "ok", "data"
            if(response.ok){
                toast.success(`Product ID: ${selectedProduct.id} Updated!`)
                retrieve()
                closeModal()
            }else{
                // API response are: "ok", "message"
                toast.error(response.message ?? "Internal Server Error!")
            }

            console.log("django")
            console.log(response.data)
        })
    }

    const DeleteProduct = (item) =>{
        if(confirm(`Delete Product ${item.name}?`)){
            //method type for Delete: DELETE
            DMLProducts({id: item.id}, "DELETE")
            .then(()=>{
                // delete API has no responses
                toast.success(`Product ${item.name} Deleted!`)
                retrieve()
                closeModal()
              
            })
        }
    }
    
    return (
        <Box sx={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 2}}>
            <Box m={2} sx={{display: 'flex'}}>
                <Typography variant="h2" textAlign='center'>
                    Product management
                </Typography>
               
            </Box>
            <Box sx={{flex: 1,display: 'flex',flexDirection: 'column', gap: 2, alignItems: 'center',width: '100%'}}>

                <CustomModal
                    buttonText="Add Product" 
                    open={open} 
                    btnColor='success'
                    handleOpen={() => openModal("add",null)} 
                    handleClose={() => closeModal()}
                    buttonStyle={{width: '80%'}}
                >
                    {/* Header of modal */}
                    <Typography 
                        variant="h3" 
                        bgcolor="#3079e6"
                        sx={{flex: 1, textAlign:'center',color: 'white',p: 2, width: '100%'}}
                    >
                        {editMode ? `Update Product: ${selectedProduct.name}` : "Add a Product"}
                        
                    </Typography>
                    {/* Content of Modal */}

                    <Box component="form" sx={{flex: 1,width: '100%',display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center'}} onSubmit={e => editMode ? UpdateProduct(e) : AddProduct(e)}>
                        <Box sx={{flex: 1, display: 'flex',flexDirection: 'column', gap: 2, width: '80%', justifyContent: 'center',alignItems: 'center'}}>
                            <TextField
                                fullWidth
                                id="Price"
                                label="Price"
                                variant="outlined"
                                type="number"
                                sx={{flex: 1}}
                                defaultValue={selectedProduct.price ?? ''}
                                required
                            />

                            <TextField
                                fullWidth
                                id="Name"
                                label="Product Name"
                                variant="outlined"
                                sx={{flex: 1}}
                                defaultValue={selectedProduct.name ?? ''}
                                required
                            />

                            <TextField
                                fullWidth
                                id="Image"
                                label="Product Image"
                                variant="outlined"
                                sx={{flex: 1}}
                                defaultValue={selectedProduct.image_src ?? ''}
                                
                            />
                            <InputLabel>Product Type</InputLabel>
                            <Select
                                fullWidth
                                id="ProductType"
                                color="primary"
                                defaultValue={selectedProduct.product_type?.id ?? 1}
                                required
                                native
                            >
                                {
                                    types.map((item,index)=>(
                                        <option value={item.id} key={index}>
                                            {item.type}
                                        </option>
                                    ))
                                }

                            </Select>
                        

                            <TextField
                                fullWidth
                                id="Description"
                                label="Product Description"
                                variant="outlined"
                                sx={{flex: 1}}
                                multiline
                                rows={5}
                                defaultValue={selectedProduct.description ?? ''}
                            />
                        </Box>
                         {/* Footer of Modal */}
                         <Button 
                            sx={{flex: 1,color: 'white', p: 2, fontSize: '16pt'}} variant="contained" 
                            color={editMode ? "primary" : "success"}
                            fullWidth
                            type="submit"
                        >
                            {editMode ? "Update" : "Add"}
                            
                        </Button>
                    </Box>

                   
                </CustomModal>
                <DataGrid
                    sx={{ m:2, flex: 1, width: '90%', maxHeight: '650px'}}
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination:{
                            paginationModel:{
                                pageSize: 10
                            }
                        }
                    }}
                    getRowHeight={()=>'auto'}
                    pageSizeOptions={[10, 20, 30, 50, 100]}
                    disableRowSelectionOnClick
                    disableColumnResize
                    
                />
            </Box>
        </Box>
    )
}

export default Products