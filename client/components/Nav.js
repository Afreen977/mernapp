import Link from "next/link";
import {useEffect, useState, useContext} from "react";
import {UserContext} from "../context";
import {useRouter} from "next/router";


const Nav = () => {
    const [current, setCurrent] = useState('')
    const router = useRouter()
    const [state, setState] = useContext(UserContext)

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname)
    }, [process.browser])
    const logout = () => {
        window.localStorage.removeItem('auth')
        setState(null)
        router.push('/login')
    }
    return (
        <nav className="nav  d-flex justify-content-between"
            style={
                {backgroundColor: "blue"}
        }>
            <Link href="/">
                <a className={
                    `nav-link text-light logo ${
                        current === '/' && 'active'
                    }`
                }>Home</a>
            </Link>
    
            {
            state === null ? <>
                <Link href="/login">
                    <a className={
                        `nav-link text-light ${
                            current === '/login' && 'active'
                        } `
                    }>Login</a>
                </Link>
                <Link href="/register">
                    <a className={
                        `nav-link text-light ${
                            current === '/register' && 'active'
                        }`
                    }>Register</a>
                </Link>
            </> : <>
            <div className="dropdown">
                <button className="btn dropdown-toggle" role="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    {
                    state && state.user && state.user.name
                } </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li>
                       
                            <Link href="/user/dashboard">
                                <a className={
                                    `nav-link dropdown-item  ${
                                        current === '/user/dashboard' && 'active'
                                    }`
                                }>
                                  Dashboard </a>
                            </Link>
                     
                    </li>
                    <li>
                       
                       <Link href="/user/profile/update">
                           <a className={
                               `nav-link dropdown-item  ${
                                   current === '/user/profile/update' && 'active'
                               }`
                           }>
                             Profile </a>
                       </Link>
                
               </li>
                    <li>
                      
                            <a onClick={logout}
                                className="nav-link ">Logout</a>
                     
                    </li>
                {state.user.role==='admin' && 
                <li>
                    <Link href="/admin">
                        <a className={`nav-link dropdown-item ${current==="/admin" && 'active'}`}>Admin</a>
                    </Link>
                    
                    </li>}
                </ul>
            </div>
            </>
        } </nav>
    );
};

export {
    Nav
};
