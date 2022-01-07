import express from 'express'
import { requireSignin,canEditDeletePost, isAdmin } from '../middlewares'
import  {posts,createPost,newsFeed,getPost,totalPosts,postsByUser,userPost,updatePost,deletePost,likePost,unlikePost,addComment,removeComment,uploadImage}  from '../controllers/post'
import formidable from 'express-formidable'


const router=express.Router()
router.post('/create-post',requireSignin,createPost)
router.post('/upload-image',requireSignin,formidable({maxFileSize:5*1024*1024,uploadDir: 'uploads//', encoding: 'utf-8',type:'multipart',keepExtensions:'jpg,png'
}),uploadImage)
//posts
router.get('/user-posts',requireSignin,postsByUser)
router.get('/user-post/:_id',requireSignin,userPost)
router.put('/update-post/:_id',requireSignin,canEditDeletePost,updatePost)
router.delete('/delete-post/:_id',requireSignin,canEditDeletePost,deletePost)
router.get('/news-feed/:page',requireSignin,newsFeed)
router.put('/like-post',requireSignin,likePost)
router.put('/unlike-post',requireSignin,unlikePost)
router.put('/add-comment',requireSignin,addComment)
router.put('/remove-comment',requireSignin,removeComment)
router.get('/total-posts',totalPosts)
router.get('/posts',posts)
router.get('/post/:id',getPost)

//admin
router.delete('/admin/delete-post/:_id',requireSignin,isAdmin,deletePost)
module.exports=router