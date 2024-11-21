import React, {useState, useRef, useEffect} from 'react'
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom'
import CustomModal from '../Modal'
import CustomInput from '../Input'
import {AppBar, Box, Toolbar, Typography, Button, InputAdornment, IconButton, Card} from '@mui/material'
import { AccountCircle, Badge, Lock, Mail, ShoppingCart, Visibility, VisibilityOff } from '@mui/icons-material'
import Loading from '../Loading'
import {login, register} from '../../api/auth'
import { toast } from 'react-toastify'
import { reset, setUser } from '../../redux/slice'
import { useDispatch, useSelector } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import MainAuth from '../hoc/mainAuth'




function MainLayout(){
    const [openLogin, setOpenLogin] = useState(false)
    const [openReg, setOpenReg] = useState(false)
    const [showLogPassword, setShowLogPassword] = useState(false)
    const [showRegPassword, setShowRegPassword] = useState(false)
    const [showConfRegPassword, setShowConfRegPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const loginRef = useRef([])
    const regRef = useRef([])
    const dispatch = useDispatch()
    const user = useSelector(state=>state.auth.user)
    const nav = useNavigate()

    

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
    const handleRegShowPassword = () => setShowRegPassword(!showRegPassword)
    const handleRegConfShowPassword = () => setShowConfRegPassword(!showConfRegPassword)


    const handleLogin = (e) =>{
        e.preventDefault()
        console.log("hello")
        const user = loginRef.current[0].value
        const pass = loginRef.current[1].value

        login({username: user, password: pass})
        .then(res=>{
            console.log('hello')
            if(res.detail){
                toast.error("Incorrect Username or Password", {position: 'top-center'})
            }else{
                toast.success("Login Successful",{position: 'top-center'})
                sessionStorage.setItem("user", res.access)
                dispatch(setUser(jwtDecode(res.access)))
                setOpenLogin(false)
            }
            // console.log(res)
        })
    }

    const gotopanel = () =>{
        nav('../admin')
    }

    const handleLogout = () =>{
        sessionStorage.clear()
        dispatch(reset())
        nav('../')
    }

    const handleRegister = (e) =>{
        e.preventDefault()
        
        setLoading(true)
        const regData = {
            username: regRef.current[0].value,
            password: regRef.current[1].value,
            password_confirmation: regRef.current[2].value,
            email: regRef.current[3].value,
            first_name: regRef.current[4].value,
            last_name: regRef.current[5].value
        }

        if(regData.password === regData.password_confirmation){
            
            register(regData)
            .then(res=>{
                if(res.ok){
                    //login the newly registered user
                    login({username: regData.username, password: regData.password})
                    .then(res=>{
                        if(res.detail){
                            toast.error("Incorrect Username or Password", {position: 'top-center'})
                        }else{
                            toast.success("Login Successful",{position: 'top-center'})
                            sessionStorage.setItem("user", res.access)
                            dispatch(setUser(jwtDecode(res.access)))
                            setOpenReg(false)
                        }
                        // console.log(res)
                    })
                }else{
                    for(const [test,value] of Object.entries(res.data)){
                        toast.error(value[0],{position: 'top-center'})
                    }
                }
                setLoading(false)
            }).catch(e=>{
                setLoading(false)
                toast.error(e,{position: 'top-center'})
            }).finally(()=>{
                setLoading(false)
            })
        }else{
            setLoading(false)
            toast.error('Password and Confirm Password does not match',{position: 'top-center'})
        }
    }

    const gotocart = () =>{
        nav('../cart')
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
                        <Typography sx={{flex: 1, textDecoration:'none'}} variant='h6' component='div'>
                            <Link to="../" style={{textDecoration: 'none', color: 'white'}}>
                                E-Commerce Website na Bulok
                            </Link>
                        </Typography>

                        {
                            user ? 
                            window.location.pathname == '/cart' ?
                            <Button variant='contained' color='error' onClick={() =>nav('../')}>
                                Go Back
                            </Button>
                            :
                            <Button variant='contained' onClick={gotocart}
                            >
                                <ShoppingCart/> Cart
                            </Button>
                            :null
                        }

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
                                 <Typography 
                                    variant="h4" 
                                    bgcolor="#3079e6"
                                    sx={{flex: 1, textAlign:'center',color: 'white',p: 2, width: '100%'}}
                                >
                                    Register as a new user
                                    
                                </Typography>
                                {/* Box for login */}
                                <Box component='form' onSubmit={handleRegister} sx={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', width: '70%', mb: 2}}>
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

                                        inputRef={element => regRef.current[0] = element}
                                    />
                                    
                                    <CustomInput
                                        required
                                        fullWidth
                                        variant="outlined"
                                        label="Password"
                                        type={showRegPassword ? 'text' : 'password'}
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
                                                            onClick={handleRegShowPassword}
                                                            onMouseDown={e => e.preventDefault()}
                                                            onMouseUp={e => e.preventDefault()}
                                                        >
                                                            {showRegPassword ? <VisibilityOff/> : <Visibility/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                        inputRef={element => regRef.current[1] = element}
                                    />
                                     <CustomInput
                                        required
                                        fullWidth
                                        variant="outlined"
                                        label="Confirm Password"
                                        type={showConfRegPassword ? 'text' : 'password'}
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
                                                            onClick={handleRegConfShowPassword}
                                                            onMouseDown={e => e.preventDefault()}
                                                            onMouseUp={e => e.preventDefault()}
                                                        >
                                                            {showConfRegPassword ? <VisibilityOff/> : <Visibility/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                        inputRef={element => regRef.current[2] = element}
                                    />
                                     <CustomInput
                                        required
                                        fullWidth
                                        variant="outlined"
                                        label="E-mail"
                                        type="email"
                                        slotProps={{
                                            input: {
                                                startAdornment:(
                                                    <InputAdornment position='start'>
                                                        <Mail/>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}

                                        inputRef={element => regRef.current[3] = element}
                                    />
                                    <CustomInput
                                        required
                                        fullWidth
                                        variant="outlined"
                                        label="First Name"
                                        slotProps={{
                                            input: {
                                                startAdornment:(
                                                    <InputAdornment position='start'>
                                                        <Badge/>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}

                                        inputRef={element => regRef.current[4] = element}
                                    />
                                    <CustomInput
                                        required
                                        fullWidth
                                        variant="outlined"
                                        label="Last Name"
                                        slotProps={{
                                            input: {
                                                startAdornment:(
                                                    <InputAdornment position='start'>
                                                        <Badge/>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}

                                        inputRef={element => regRef.current[5] = element}
                                    />

                                    <Button fullWidth type="submit">Register</Button>
                                </Box>
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