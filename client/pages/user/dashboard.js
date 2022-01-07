import {useState, useContext, useEffect} from "react";
import {UserContext} from "../../context";
import UserRoute from '../../components/routes/UserRoute'
import {PostForm} from '../../components/forms/PostForm'
import {useRouter} from "next/router"
import axios, {Axios} from "axios";
import {toast} from "react-toastify"
import People from '../../components/cards/People'
import PostList from "../../components/cards/PostList";
import Link from "next/link";
import CommentForm from "../../components/forms/CommentForm";
import Modal from "antd/lib/modal/Modal";
import {Pagination} from "antd";
import {imageSource} from '../../functions/index'
import Search from "../../components/Search";
import io from 'socket.io-client'


const socket=io(process.env.NEXT_PUBLIC_SOCKETIO,{path:"/socket.io"},{
    reconnection:true,

})
const Dashboard = () => {
    const [image, setImage] = useState("")
    const [content, setContent] = useState("")
    const [state, setState] = useContext(UserContext)
    const router = useRouter()
    const [people, setPeople] = useState([])
    const [uploading, setUploading] = useState(false)
    const [posts, setPosts] = useState([])
    const [comment, setComment] = useState('')
    const [visible, setVisible] = useState(false)
    const [totalPosts, setTotalPosts] = useState(0)
    const [currentPost, setCurrentPost] = useState({})
    const [page, setPage] = useState(1)

    const handleComment = async (post) => {
        console.log(`entered in handleComment`)
        setCurrentPost(post)
        setVisible(true)
        try {
            if (comment) {
                const {data} = await axios.put('/add-comment', {
                    postId: currentPost._id,
                    comment
                })
                console.log('add comment', data)
                setComment('')
                setVisible(false)
                newsFeed()
            }
        } catch (err) {}


    }
    const addComment = async (e) => {
        e.preventDefault()
        console.log("add comment to this post id", currentPost._id)

    }

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

    const handleLike = async (_id) => {
        console.log("entered in handleLike")
        try {
            const {data} = await axios.put(`/like-post`, {_id: _id})
            console.log("liked", data)
            newsFeed()
        } catch (err) {
            console.log(err)
        }
    }
    const handleUnLike = async (_id) => {
        debugger
        console.log("entered in handleUnLike")
        try {
            const {data} = await axios.put(`/unlike-post`, {_id: _id})
            console.log("unliked", data)
            newsFeed()
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
            let filtered = people.filter((p) => {
                p._id !== user._id
            })
            setPeople(filtered)
            newsFeed()
            toast.success(`Following ${
                user.name
            }`)

        } catch (err) {}
    }
    useEffect(() => {
        if (state && state.token) {
            newsFeed()
            findPeople()
        }

    }, [state && state.token,page])
    useEffect(() => {
        try {
            axios.get('/total-posts').then(({data}) => {
                setTotalPosts(data)
            })
        } catch (err) {
            console.log(err)
        }
    })
    const findPeople = async () => {
        try {
            const {data} = await axios.get('/find-people')
            setPeople(data)
            console.log(`data is ${
                data.post
            }`)
        } catch (err) {}
    }
    const newsFeed = (async () => {
        console.log(`page in newsFeed is ${page}`)
        try {
            const {data} = await axios.get(`/news-feed/${page}`)
            console.log("user posts=>", data)
            setPosts(data)
        } catch (err) {
            console.log(err)
        }
    })
    const postSubmit = async (e) => {
        e.preventDefault()
        console.log("post=>", content)
        try {
            const {data} = await axios.post('/create-post', {content, image})

            if (data.error) {
                toast.error(data.error)
            } else {
                newsFeed()
                toast.success('Post created')
                setContent('')
                setImage('')
                setPage(1)
                newsFeed()
                socket.emit('new-post',data)
            }
        } catch (err) {
            console.log(err)
        }
    }
    const removeComment = async (postId, comment) => {
        console.log(postId, comment)
        let answer = window.confirm("Are you sure?")
        if (! answer) 
            return
        
        try {
            const {data} = await axios.put("/remove-comment", {postId, comment})
            console.log("response=>", data)
            fetchPost()
        } catch (err) {
            console.log(err)
        }

    }
    const handleDelete = async (post) => {
        try {
            const answer = window.confirm('Are you sure?')
            if (! answer) 
                return
            
            const {data} = await axios.delete(`delete-post/${
                post._id
            }`)
            toast.success('Post deleted')
            newsFeed()
        } catch (err) {
            toast.error('Post deletion failed' + err)
        }
    }
    console.log(`posts in dashboard is ${posts}`)
    return (
        <UserRoute>
            <div className="container">
                <div className="row py-5 text-light bg-default-image">
                    <div className="col text-center">
                        <h1>News Feed</h1>
                    </div>
                </div>
                <div className="row py-3">
                    <div className="col-md-8">
                        <PostForm content={content}
                            setContent={setContent}
                            postSubmit={postSubmit}
                            handleImage={handleImage}
                            uploading={uploading}
                            image={image}/>

                        <PostList posts={posts}
                            handleDelete={handleDelete}
                            handleLike={handleLike}
                            handleUnLike={handleUnLike}
                            handleComment={handleComment}
                            removeComment={removeComment}/>
                        <Pagination className="pb-5"
                            current={page}
                            total={
                                (totalPosts / 3) * 10
                            }
                            onChange={
                                (value) => {setPage(value)}
                            }/>
                    </div>

                    <div className="col-md-4">
                        <Search/>
                        <br/> {
                        state && state.user && state.user.following && <Link href={`/user/following`}>
                            <a className="h6">
                                {
                                state.user.following.length
                            }</a>
                        </Link>
                    }
                        <People people={people}
                            handleFollow={handleFollow}/>

                    </div>
                </div>
                <Modal visible={visible}
                    onCancel={
                        () => setVisible(false)
                    }
                    title="Comment"
                    footer={null}>
                    <CommentForm comment={comment}
                        setComment={setComment}
                        addComment={handleComment}/>
                </Modal>
            </div>
        </UserRoute>
    )
}
export default Dashboard
