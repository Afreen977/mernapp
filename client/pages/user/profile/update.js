import {useContext, useState, useEffect} from 'react'
import axios from 'axios'
import {toast} from "react-toastify"
import "antd/dist/antd.css"
import Link from 'next/link'
import {Modal,Avatar} from "antd"
import {SyncOutlined} from "@ant-design/icons"
import AuthForm from '../../../components/forms/AuthForm'
import {UserContext} from '../../../context'
import {useRouter} from 'next/router'
import {LoadingOutlined, CameraOutlined} from '@ant-design/icons'


const ProfileUpdate = () => {
    const [username, setUsername] = useState('')
    const [about, setAbout] = useState('')
    const [state, setState] = useContext(UserContext)
    const router = useRouter()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [secret, setSecret] = useState('')
    const [ok, setOk] = useState(false)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState({})
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (state && state.user) { // console.log(state,state.user)
            setUsername(state.user.username)
            setAbout(state.user.about)
            setName(state.user.name)
            setEmail(state.user.email)
            setImage(state.user.image)
        }
    }, [state && state.user])


    const handleImage = async (e) => {
        const file = e.target.files[0]
        let formData = new FormData()
        formData.append('image', file)
        console.log([... formData])
        setUploading(true)
        try {
            const {data} = await axios.post("/upload-image", formData)
            setImage({url: data.url, public_id: data.public_id})
            setUploading(false)
        } catch (err) {
            console.log(err)
            setUploading(false)
        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log(name, email, password, secret)
        try {
            setLoading(true)
            const {data} = await axios.put(`/profile-update`, {
                name,
                email,
                about,
                password,
                secret,
                image
            })
            console.log("updated response =>", data)
            if (data.error) {
                toast.error(data.error)
                setLoading(false)
            } else {

                setOk(true)
                setLoading(false)
                let auth = JSON.parse(localStorage.getItem("auth"))
                auth.user = data
                localStorage.setItem("auth", JSON.stringify(auth))
                setState({
                    ...state,
                    user: data
                })


            }
        } catch (err) {
            toast.error(err.response.data)
        }

    }

    return (
        <div className="container-fluid">
            <div className="row py-5 text-light bg-defualt-image">
                <div className="col text-center">
                    <h1>Profile</h1>
                </div>
            </div>
            {
            loading && <h1>Loading...</h1>
        }
            <div className="row py-5">
                <div className="col md-6 offset-md-3">
                    <label className="d-flex justify-content-center h5"> {
                        image && image.url ? (
                            <Avatar size={30}
                                src={
                                    `http://localhost:8000/${image.url}`
                                }
                                className="mt-1"/>
                        ) : uploading ? (
                            <LoadingOutlined className="mt-2"/>
                        ) : (<CameraOutlined className="mt-2"/>)
                        }
                          
                        <input type="file" accept="images/*" hidden
                            onChange={handleImage}/>
                    </label>
                    <AuthForm handleSubmit={handleSubmit}
                        username={name}
                        setName={setName}
                        profileUpdate={true}
                        setusername={setUsername}
                        about={about}
                        setabout={setAbout}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        secret={secret}
                        setSecret={setSecret}
                        loading={loading}
                        setLoading={setLoading}
                        handleSubmit={handleSubmit}
                        page="register"/>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Modal title="Conratulations"
                        visible={ok}
                        onChange={
                            () => setOk(false)
                        }
                        footer={null}>You have successfully updated your profile.

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
export default ProfileUpdate
