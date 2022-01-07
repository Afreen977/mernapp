const PostImage=({url})=>{
    url=`http://localhost:8000/${url}`
    console.log(`url is ${url} url(${url})`)
    return  <div style={{backgroundImage:"url("+url+")" ,backgroundRepeat:"no-repeat",backgroundPosition:"center center",height:"300px"}}/>
}
export default PostImage