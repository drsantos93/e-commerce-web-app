import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {reset, setUser} from '../../redux/slice'
import { jwtDecode } from 'jwt-decode'
import { verify } from '../../api/auth'


export default function AdminAuth(WrappedComponent){
    return () =>{
        const nav = useNavigate()
        const dispatch = useDispatch()
        const user = sessionStorage.getItem('user') // access token

        useEffect(()=>{
            // no token
            if(!user){
                nav('../')
            }else{
                verify(user)
                .then(res=>{
                    if(res){
                        const userm = jwtDecode(user)

                        if(userm.user_id === 1){
                            dispatch(setUser(userm)) //redux
                            nav('../admin')
                        }else{
                            nav('../')
                        }
                    }else{
                        dispatch(reset())
                        sessionStorage.clear()
                        nav("../")
                    }
                })
            }
        },[])
        return <WrappedComponent/>
    }
}