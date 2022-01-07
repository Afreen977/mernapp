
import { useContext } from "react";
import ParallaxBG from "../../../components/cards/ParallaxBG";
import axios from "axios";

import PostPublic from "../../../components/cards/PostPublic";
import Link from "next/link";
import Head from "next";
const SinglePost = (props) => {
  
  console.log(`posts is ${props}`);
  let { post } = props;
  const head = () => {
    return (
      <Head>
        <title>MERN CAMP - A social network by devs for devs</title>
        <meta
          name="description"
          content={post.content}
        />
        <meta
          property="og:description"
          content="A social network by developers for other web developers"
        />
        <meta property="og:url" content={`http://merncamp.com/post/view/${post.id}`} />
        <meta
          property="og:image:secure_url"
          content={imageSource(post)}
        />
      </Head>
    );
  };
 const imageSource=(post)=>{
   
   if(post.image){
       return post.image.url
   }else{
       console.log("entered in else of imageSource")
       return "/images/cloudy.jpg"
   }
}
  return (
    <>
      head()
      <ParallaxBG url="/images/cloudy.jpg"></ParallaxBG>
      <div className="row pt-5">
        {post &&
      
          
           (
              <div className="col-md-8 offset-md-2">
              
                    <PostPublic post={post} key={post._id} />
               
              </div>
            
          )}
      </div>
    </>
  );
};
export async function getServerSideProps(context) {
  let posts;
  /* try{
        posts=await post.find().populate("postedBy","_id name image").populate('comments.postedBy','_id name image').sort({createdAt:-1}).limit(12)
       
      }
      catch(err){
          console.log(err)
      }
    if(posts){
    return {
        props:{
            posts:posts
        }
    }
} */

  const res = await fetch(`http://localhost:8000/api/post/${context.params._id}`, {
    method: "GET",
  });
  const data=await res.json()
  console.log(`data is ${data}`);
  return {
    props: {
      post: data,
    },
  };
}
export default SinglePost;
