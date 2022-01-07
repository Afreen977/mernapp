import { useState,createContext,useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Router } from "next/router";

export const UserContext=createContext()

export const UserProvider=(props)=>{
    const router=useRouter()
   axios.defaults.baseURL=`${process.env.NEXT_PUBLIC_API}`

    const [state,setState]=useState({user:{},token:""})
    const token=state && state.token? state.token:""
    axios.defaults.headers.common["Authorization"]=`Bearer ${token}`
    useEffect(()=>{
        setState(JSON.parse(window.localStorage.getItem('auth')))
    },[])
    axios.interceptors.response.use(function(response){
        return response
    },
    function(error){
        let res=error.response;
        if(res.status===401 && res.config && !res.config.__isRetryRequest){
            setState(null)
            window.localStorage.removeItem("auth")
            router.push("/login")
        }
    })
    return(
        <UserContext.Provider value={[state,setState]}>{props.children}</UserContext.Provider>
    )
}