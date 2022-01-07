import {UserContext} from "../context";
import {useContext,useEffect,useState} from "react";
import ParallaxBG from "../components/cards/ParallaxBG";
import axios from "axios";
import Post from "../../server/models/post";
import PostPublic from "../components/cards/PostPublic";
import Link from "next/link";
import Head from "next/head";
import io from 'socket.io-client'


const socket=io(process.env.NEXT_PUBLIC_SOCKETIO,{path:"/socket.io"},{
    reconnection:true,

})
const Home = (props) => {
    const state = useContext(UserContext);
    const [newsFeed,setNewsFeed]=useState([])
    
    console.log(`posts is ${props}`);
    let {posts} = props;
    function head(){
        return (
        <Head>
            <title>A social network by devs for devs</title>
        </Head>
       );
    };

 
    useEffect(()=>{
        socket.on('new-post',(newPost)=>{
           setNewsFeed([newPost,...posts])
        }) 
    })
    const collection=newsFeed.length>0?newsFeed:posts
    return (
        <>
          {head()}
            <ParallaxBG url="/images/cloudy.jpg"></ParallaxBG>
            <div className="container">
             
            <div className="row pt-5">
                {
                collection.length>0 && collection.map((post) => {
                    {
                        console.log(`post is ${
                            post.postedBy
                        }`);
                    }
                    return (
                        <div key={post._id} className="col-md-4">
                            <Link href={
                                `/post/${
                                    post._id
                                }`
                            }>
                                <a>
                                    <PostPublic post={post}
                                        key={
                                            post._id
                                        }/>
                                </a>
                            </Link>
                        </div>
                    );
                })
            } </div>
            </div>
        </>
    );
};
export const getServerSideProps=async(ctx)=>{

    //let posts=await Post.find().populate("postedBy","_id name image").populate('comments.postedBy','_id name image').sort({createdAt:-1}).limit(12)
   const res = await fetch("http://[::1]:8000/api/posts", {method: "GET"});
    const data = await res.json()
    console.log(`data is ${data}`);
    return {
        props: {
            posts: data
        }
    };
}
export default Home;
