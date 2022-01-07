import {useContext,useState} from 'react'
import axios from 'axios'
import {toast} from "react-toastify"
import "antd/dist/antd.css"
import Link from 'next/link'
import {Modal} from "antd"
import {SyncOutlined} from "@ant-design/icons"
import AuthForm from '../components/forms/AuthForm'
import { UserContext } from '../context'
import { useRouter } from 'next/router'

const Register=()=>{
    const [state,setState]=useContext(UserContext)
    const router=useRouter()

    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [secret,setSecret]=useState('')
    const [ok,setOk]=useState(false)
    const [loading,setLoading]=useState(false)



    const handleSubmit=async(event)=>{
        event.preventDefault()
        console.log(name,email,password,secret)
     try{
         setLoading(true)
        const {data}=await axios.post(`/register`,{
            name,
            email,
            password,
            secret
        })
       if(data.error){
           toast.error(data.error)
           setLoading(false)
       }
       else{
        setEmail('')
        setPassword('')
        setName("")
        setOk(data.ok)
        setLoading(false)
       }
     }

    catch(err){
        toast.error(err.response.data)
    }
 
    }
    if(state && state.token) router.push('/')
    return (
        <div className="container-fluid">
            <div className="row py-5 text-light bg-defualt-image">
                <div className="col text-center">
                    <h1>Register Page</h1>
                </div>
            </div>
            {loading && <h1>Loading...</h1>}
            <div className="row py-5">
                <div className="col md-6 offset-md-3">
                   <AuthForm handleSubmit={handleSubmit}
                   name={name}
                   setName={setName}
                   email={email}
                   setEmail={setEmail}
                   password={password}
                   setPassword={setPassword}
                   secret={secret}
                   setSecret={setSecret}
                   loading={loading}
                   setLoading={setLoading}
                   page="register"/>
                </div>
            </div>
          <div className="row">
              <div className="col">
                  <Modal title="Conratulations"
                  visible={ok}
                  onChange={()=>setOk(false)}
                  footer={null}
                  >You have successfully registered.
                  <Link href="/login">
                      <a className="btn btn-primary btn-sm">Login</a>
                  </Link>
                  </Modal>
              </div>
          </div>
          <div className="row">
              <div className="col">
                  <p className="text-center">
                  Already registered?{" "}
                  <Link href="/login">
                      <a>Login</a>
                  </Link>
                  </p>
              </div>
          </div>
        </div>
    )
}
export default Register