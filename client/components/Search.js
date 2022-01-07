import {useState, useContext} from "react"
import {UserContext} from "../context"
import axios from "axios"
import People from "./cards/People"
import { toast } from "react-toastify"
const Search = () => {
    const [state,setState] = useContext(UserContext)
    const [query, setQuery] = useState("")
    const [result,setResult]=useState('')

    const searchUser = async (e) => {
        e.preventDefault()
        
         console.log(`Find "${query}" from db`)
        try {
            const {data} = await axios.get(`/search-user/${query}`)
            console.log(`search user response=>`, data)
            setResult(data)
           
        } catch (err) {
            console.log(err)
        }
    }
    const handleFollow = async (user) => {
        console.log('add this user to following list', user)
        try {
            const {data} = await axios.put('/user-follow', {_id: user._id})
            let auth = JSON.parse(localStorage.getItem("auth"))
            auth.user = data
            localStorage.setItem('auth', JSON.stringify(auth))
            setState({
                ...state,
                user: data
            })
            console.log("handle follow response", data)
            let filtered = result.filter((p) => {
                p._id !== user._id
            })
            setResult(filtered)
          
            toast.success(`Following ${
                user.name
            }`)

        } catch (err) {}
    }
    const handleUnfollow=async(user)=>{
        try{
           const {data}=await axios.put("/user-unfollow",{id:user._id})
           let auth=JSON.parse(localStorage.getItem("auth"))
           auth.user=data
           localStorage.setItem('auth',JSON.stringify(auth))
           setState({...state,user:data})
           console.log("handle unfollow response",data)
           let filtered=result.filter((p)=>{
               p._id!==user._id
           })
           setResult(filtered)
        
           toast.error(`UnFollowed ${user.name}`)
        }
        catch(err){

        }
    }
    return (
        <>
            <form className="form-inline row"
                onSubmit={searchUser}>
                <div className="col-8"><input onChange={
                            (e) =>{ setQuery(e.target.value);setResult("")}
                        }
                        value={query}
                        className="form-control "
                        type="search"
                        placeholder="search"/></div>
                <div className="col-4">
                    <button className="btn btn-outline-primary col-12" type="submit">Search</button>
                </div>
            </form>
            {result && result.map((r)=>{
                {console.log(`result is ${result.length}`)}
               return <People people={result} key={r._id} handleFollow={handleFollow} handleUnfollow={handleUnfollow}/>
            })}
        </>
    )
}
export default Search
