import { useState,useEffect } from "react"
import { useRouter } from "next/router"
import axios, { Axios } from "axios"
import UserRoute from "../../components/routes/UserRoute"
import { toast } from "react-toastify"
import Post from "../../components/cards/Post"
import Link from "next/link"
import { RollbackOutlined } from "@ant-design/icons"
const PostComments=()=>{
    const [post,setPost]=useState([])
    const router=useRouter()
    const _id=router.query._id
    const removeComment=async(postId,comment)=>{
     console.log(postId,comment)
     let answer=window.confirm("Are you sure?")
     if(!answer)
        return
     try{
        const {data}=await axios.put("/remove-comment",{
            postId,
            comment
        })
        console.log("response=>",data)
        fetchPost()
     }
     catch(err){
         console.log(err)
     }
    
    }
    useEffect(()=>{
         if(_id) fetchPost()

    },[_id])
    const handleLike=async(_id)=>{
        console.log("entered in handleLike")
      try{
        const {data}=await axios.put(`/like-post`,{_id:_id})
        console.log("liked",data)
       // newsFeed()
      }
      catch(err){
         console.log(err)
      }
    }
    const handleUnLike=async(_id)=>{
        debugger
        console.log("entered in handleUnLike")
        try{
            const {data}=await axios.put(`/unlike-post`,{_id:_id})
            console.log("unliked",data)
          //  newsFeed()
          }
          catch(err){
             console.log(err)
          }
    }
    const handleComment=async(post)=>{
        console.log(`entered in handleComment`)
        setCurrentPost(post)
        setVisible(true)
         try{
           const {data}=await axios.put('/add-comment',{
               postId:currentPost._id,
               comment,
           })
           console.log('add comment',data)
           setComment('')
           setVisible(false)
           //newsFeed()
         }
         catch(err){

         }

    }
    const handleDelete=async(post)=>{
        try{
           const answer=window.confirm('Are you sure?')
           if(!answer)
             return
         const {data}=await axios.delete(`delete-post/${post._id}`)
         toast.success('Post deleted')
         //newsFeed()
        }
        catch(err){
            toast.error('Post deletion failed'+err)
        }
     }
    const fetchPost=async()=>{
        try{
           const {data}=await axios.get(`/user-post/${_id}`)
           setPost(data)
        }
        catch(err){
            console.log(err)
        }
    }
    return (
        <div className="container-fluid">
            <div className="row py-5 text-light bg-default-image">
                <div className="col text-center">
                    <h1>MERN CAMP</h1>
                </div>
            </div>
            <div className="container col-md-8 offset-md-2 pt-5">
                       <Post post={post} commentsCount={100} removeComment={removeComment} handleDelete={handleDelete} handleLike={handleLike} handleUnlike={handleUnLike} />
            </div>
            <Link href="/user/dashboard">
                <a className="d-flex justify-center pt-5"><RollbackOutlined/></a>
            </Link>
        </div>
    )
}
export default PostComments