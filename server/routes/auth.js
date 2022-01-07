import express from 'express'
import {register,login,addFollower,getUser,userFollow,userFollowing,currentUser,forgotPassword,profileUpdate,findPeople,removeFollower,userUnFollow,searchUser} from '../controllers/auth'
import { isAdmin, requireSignin } from '../middlewares'

const router=express.Router()


router.post('/register',register)
router.post('/login',login)
router.get('/current-user',requireSignin,currentUser)
router.post('/forgot-password',forgotPassword)
router.put('/profile-update',requireSignin,profileUpdate)
router.get('/find-people',requireSignin,findPeople)
router.put('/user-follow',requireSignin,addFollower,userFollow)
router.put('/user-unfollow',requireSignin,removeFollower,userUnFollow)
router.get('/user-following',requireSignin,userFollowing)
router.get('/search-user/:query',searchUser)
router.get('/user/:username',getUser)
router.get('/current-admin',requireSignin,isAdmin,currentUser)

module.exports=router
