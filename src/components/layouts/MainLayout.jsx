import React, {useState, useRef, useEffect} from 'react'
import {Link, Outlet, useNavigate} from 'react-router-dom'
import CustomModal from '../Modal'
import CustomInput from '../Input'
import {AppBar, Box, Toolbar, Typography, Button, InputAdornment, IconButton, Card} from '@mui/material'
import { AccountCircle, Lock, Visibility, VisibilityOff } from '@mui/icons-material'
import Loading from '../Loading'
import {login} from '../../api/auth'
import { toast } from 'react-toastify'
import { reset, setUser } from '../../redux/slice'
import { useDispatch, useSelector } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import MainAuth from '../hoc/mainAuth'




function MainLayout(){
    const [openLogin, setOpenLogin] = useState(false)
    const [openReg, setOpenReg] = useState(false)
    const [showLogPassword, setShowLogPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const loginRef = useRef([])
    const dispatch = useDispatch()
    const user = useSelector(state=>state.auth.user)
    const nav = useNavigate()

    useEffect(()=>{
        console.log(user)
    },[user])

    const openRegModal = () =>{
        setOpenReg(true)
    }
 
    const closeRegModal = () =>{
        setOpenReg(false)
    }

    const openLoginModal = () =>{
        setOpenLogin(true)
    }
 
    const closeLoginModal = () =>{
        setOpenLogin(false)
    }

    const handleLoginShowPassword = () => setShowLogPassword(!showLogPassword)

    const handleLogin = (e) =>{
        e.preventDefault()
        const user = loginRef.current[0].value
        const pass = loginRef.current[1].value

        login({username: user, password: pass})
        .then(res=>{
            if(res.detail){
                toast.error("Incorrect Username or Password", {position: 'top-center'})
            }else{
                toast.success("Login Successful",{position: 'top-center'})
                sessionStorage.setItem("user", res.access)
                dispatch(setUser(jwtDecode(res.access)))
                setOpenLogin(false)
            }
            console.log(res)
        })
    }

    const gotopanel = () =>{
        nav('../admin')
    }

    const handleLogout = () =>{
        sessionStorage.clear()
        dispatch(reset())
    }
    return (
        // parent
      <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Loading open={loading}/>
        {/* children */}
        <Box sx={{flex: 1, display: 'flex',minHeight: 0}}>
            {/* header and nav */}
            <Box>
                <AppBar sx={{zIndex: theme => theme.zIndex.drawer + 1}}>
                    <Toolbar sx={{display: 'flex', flexDirection: 'row' ,gap: 2}}>
                        <Typography sx={{flex: 1}} variant='h6' component='div'>
                            E-Commerce Website na Bulok
                        </Typography>

                        {/* admin panel button */}
                        {
                            user?.user_id === 1 ?
                            <Button variant='contained' onClick={gotopanel} color='success'>Admin Panel</Button>
                            : null
                        }
                        
                        {/* register */}
                        {
                            user ?
                            <Card sx={{p:2}}>
                                Hello, {user.full_name}
                            </Card>
                            :
                            <CustomModal
                                btnColor='warning'
                                buttonText='Sign Up'
                                open={openReg}
                                handleOpen={openRegModal}
                                handleClose={closeRegModal}
                            >
                                
                            </CustomModal>
                        }
                        

                        
                        {/* login */}
                        {
                            user ?
                            <Button variant='contained' color='error' onClick={handleLogout}>
                                Logout
                            </Button>
                            :
                            <CustomModal
                                btnColor='secondary'
                                buttonText='Login'
                                open={openLogin}
                                handleOpen={openLoginModal}
                                handleClose={closeLoginModal}
                            >
                                <Typography 
                                    variant="h4" 
                                    bgcolor="#3079e6"
                                    sx={{flex: 1, textAlign:'center',color: 'white',p: 2, width: '100%'}}
                                >
                                    Login NOW!!!!!!!@!@112123
                                    
                                </Typography>
                                {/* Box for login */}
                                <Box component='form' onSubmit={handleLogin} sx={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', width: '70%', mb: 2}}>
                                    <CustomInput
                                        required
                                        fullWidth
                                        variant="outlined"
                                        label="Username"
                                        slotProps={{
                                            input: {
                                                startAdornment:(
                                                    <InputAdornment position='start'>
                                                        <AccountCircle/>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}

                                        inputRef={element => loginRef.current[0] = element}
                                    />
                                    
                                    <CustomInput
                                        required
                                        fullWidth
                                        variant="outlined"
                                        label="Password"
                                        type={showLogPassword ? 'text' : 'password'}
                                        slotProps={{
                                            input: {
                                                startAdornment:(
                                                    <InputAdornment position='start'>
                                                        <Lock/>
                                                    </InputAdornment>
                                                ),
                                                endAdornment:(
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={handleLoginShowPassword}
                                                            onMouseDown={e => e.preventDefault()}
                                                            onMouseUp={e => e.preventDefault()}
                                                        >
                                                            {showLogPassword ? <VisibilityOff/> : <Visibility/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                        inputRef={element => loginRef.current[1] = element}
                                    />
                                    <Button fullWidth type="submit">Login</Button>
                                </Box>
                            </CustomModal>
                        }
                        
                        
                    </Toolbar>
                </AppBar>
            </Box>
            {/* content */}
            <Box pt={8} sx={{width: '100%', height: '100%',display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                <Outlet/>
            </Box>
        </Box>
      </Box>
    )
}

export default MainAuth(MainLayout)