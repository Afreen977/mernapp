import {useContext,useState} from 'react'
import axios from 'axios'
import {toast} from "react-toastify"
import "antd/dist/antd.css"
import Link from 'next/link'
import {Modal} from "antd"
import {SyncOutlined} from "@ant-design/icons"
import ForgotPasswordForm from '../components/forms/ForgotPasswordForm'
import { UserContext } from '../context'
import { useRouter } from 'next/router'

const ForgotPassword=()=>{
    const [state,setState]=useContext(UserContext)
    const router=useRouter()

   
    const [email,setEmail]=useState('')
    const [newPassword,setnewPassword]=useState('')
    const [secret,setSecret]=useState('')
    const [ok,setOk]=useState(false)
    const [loading,setLoading]=useState(false)



    const handleSubmit=async(event)=>{
        event.preventDefault();
        try {
          // console.log(name, email, password, secret);
          setLoading(true);
          const { data } = await axios.post(`/forgot-password`, {
            email,
            newPassword,
            secret,
          });
       
          console.log("forgot password res => ", data);
       
          if (data.error) {
            toast.error(data.error);
            setLoading(false);
          }
       
          if (data.success) {
            setEmail("");
            setnewPassword("");
            setSecret("");
            setOk(true);
            setLoading(false);
          }
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
 
    }
    if(state && state.token) router.push('/')
    return (
        <div className="container-fluid">
            <div className="row py-5 text-light bg-defualt-image">
                <div className="col text-center">
                    <h1>Forgot Password</h1>
                </div>
            </div>
            {loading && <h1>Loading...</h1>}
            <div className="row py-5">
                <div className="col md-6 offset-md-3">
                   <ForgotPasswordForm handleSubmit={handleSubmit}
                  
                   email={email}
                   setEmail={setEmail}
                   newPassword={newPassword}
                   setNewPassword={setnewPassword}
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
                  >Congrats!You can now login with new password
                  <Link href="/login">
                      <a className="btn btn-primary btn-sm">Login</a>
                  </Link>
                  </Modal>
              </div>
          </div>
    
        </div>
    )
}
export default ForgotPassword