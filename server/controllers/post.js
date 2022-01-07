import Post from '../models/post'
var cloudinary = require('cloudinary').v2;
import User from '../models/user'

require('dotenv').config()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})
export const createPost=async(req,res)=>{
    console.log("post =>",req.body)
    const {content,image}=req.body
    if(!content.length){
        return res.json({error:"Content is required"})
    }
    try{
        const post=new Post({content,image,postedBy:req.user._id})
        await post.save()
        const postWithUser=await Post.findById(post._id).populate('postedBy','-password -secret')   
        res.json(post)
    }
    catch(err){
        console.log(err)
        res.sendStatus(400)
    }

}
export const uploadImage=async(req,res)=>{
    console.log("req files=>",req.files.image.path)
    req.files.image.path=req.files.image.path.replace('\\','\/')
    try{
      /*   const result=await cloudinary.uploader.upload(req.files.image.path);
        console.log("uploaded image url =>",result) */
       // res.json({url:result.secure_url,public_id:result.punlic_id})
       res.json({url:req.files.image.path})
    }
    catch(err){
        console.log(err)
    }
}
export const postsByUser=async(req,res)=>{
    try{
      const posts=await Post.find().populate('postedBy','_id name image').sort({createdAt:-1}).limit(10)
      console.log(posts)
      res.json(posts)
    }
    catch(err){
        console.log(err)
    }
}
export const userPost=async(req,res)=>{
    try{
         const post=await Post.findById(req.params._id).populate('postedBy','_id name image')
         .populate('comments.postedBy','_id name image')
         res.json(post)
    }catch(err){
        console.log(err)
    }
}

export const updatePost=async(req,res)=>{
    console.log('post update controller',req.body)
    try{
        const post=await Post.findByIdAndUpdate(req.params._id,req.body,{
            new:true //returns the updated response
        })
        console.log(`updated post is ${post}`)
        res.json(post)
    }
    catch(err){
        console.log(err)
    }
}
export const deletePost=async(req,res)=>{
    try{
       const post=await Post.findByIdAndDelete(req.params._id)
       if(post.image && post.image.public_id){
           const image=await cloudinary.uploader.destroy(post.image.public_id);

       }
       res.json({ok:true})
    }
    catch(err){

    }
}
export const newsFeed=async(req,res)=>{

    try{
      const user=await User.findById(req.user._id)
      let following=user.following
      following.push(req.user._id)
      const currentPage=req.params.page||1
      const perPage=3
      const posts=await Post.find({postedBy:{$in:following}}).sort({createdAt:-1}).limit(10).populate('postedBy','_id name image').populate('comments.postedBy','_id name image').skip((currentPage-1)*perPage).limit(perPage)
      res.json(posts)


    }
    catch(err){
        console.log(err)
    }
}
export const likePost=async(req,res,next)=>{
    console.log(req.user._id)
    console.log(req.body._id)
    let id=req.user._id
  try{
      
     let foundedPost=await Post.findById(req.body._id)
     console.log(`founded post is ${foundedPost}`)
       let post=await Post.findByIdAndUpdate(req.body._id,{
           $addToSet:{likes:id}
       },{new:true})
       console.log(`post is ${post}`)
       res.json(post)
  }
  catch(err){
      console.log(err)
  }
}
export const unlikePost=async(req,res,next)=>{
    let id=req.user._id
    try{
        let post=await Post.findByIdAndUpdate(req.body._id,{
            $pull:{likes:id},
        },{new:true})
        res.json(post)
   }
   catch(err){
       console.log(err)
   }
}
export const addComment=async(req,res)=>{

    try{
        const {postId,comment}=req.body
        const result=await Post.findByIdAndUpdate(postId,{
            $push:{
                comments: {text:comment,postedBy:req.user._id}
            }
        },{new:true}).populate('postedBy','_id name image')
        .populate('comments.postedBy','_id name image')
        res.json(result)
    }
    catch(err){
        console.log(err)
    }
}
export const removeComment=async(req,res)=>{

    try{
        const {postId,comment}=req.body
        let id=req.user._id
        let foundedDocument=await Post.findById(postId)
        console.log(`foundedDocument is ${foundedDocument}`)
        const result=await Post.findByIdAndUpdate(postId,{
            $pull:{
                comments: {text:comment.text,postedBy:id}
            }
        },{new:true}).populate('postedBy','_id name image')
        .populate('comments.postedBy','_id name image')
        console.log("After deletion=>",result)
        res.json(result)
    }
    catch(err){
        console.log(err)
    }
}
export const totalPosts=async(req,res)=>{
    try{
        const total=await Post.find().estimatedDocumentCount()
        res.json(total)
    }
    catch(err){
        console.log(err)
    }
}
export const posts=async(req,res,next)=>{
    console.log("entered in posts")
    try{
      const posts=await Post.find().populate("postedBy","_id name image").populate('comments.postedBy','_id name image').sort({createdAt:-1}).limit(12)
      res.json(posts)
    }
    catch(err){
        console.log(err)
    }

}

export const getPost=async(req,res)=>{
    try{
        const post=await Post.findById(req.params._id).populate('postedBy','_id name image')
        .populate('comments.postedBy','_id name image')
        res.json(post)
    }
    catch(err){
        console.log(err)
    }
}