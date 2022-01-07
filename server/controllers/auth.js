import User from '../models/user'
import { hashPassword,comparePassword } from '../helpers/auth'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'


export const register=async(req,res,next)=>{
    console.log('REGISTER ENDPOINT=>',req.body)
    const {name,email,password,secret}=req.body

    if(!name) return res.status(400).json({error:'Name is required'})
    if(!password ||password.length<6) return res.status(400).send('Password is required and should be 6 characters long')
    if(!secret) return res.status(400).json({error:'Answer is required'})

    const exist =await User.findOne({email})
    if(exist)
      return res.status(400).json({error:"Email is taken"})
    const hashedPassword=await hashPassword(password)
     console.log(`name is ${name}`)
    const user=new User({name,email,password:hashedPassword,secret,username:nanoid(6)})
    try{
      await user.save()
      console.log("REGISTERED USER=>",user)
      return res.json({ok:true})
    }
    catch(e){
        console.log('REGISTER FAILED =>',e)
        return res.status(400).send("Error,Try again")
    }
}

export const login=async(req,res,next)=>{
  console.log(`req method is ${req.method}`)
 
try{
  const {email,password}=req.body;
  console.log(req.body)
  const user=await User.findOne({email})
  if(!user)
  return res.status(400).json({error:'No user found'})
  const match=await comparePassword(password,user.password)
  if(!match)
    return res.status(400).json({error:'Wrong password'})
    const token=jwt.sign({_id:user._id,name:user.name},process.env.JWT_SECRET,{expiresIn:'7d'})
    user.password=undefined;
    user.secret=undefined;
    console.log(`user is ${user}`)
    res.json({token,user,})
}
  catch(err){
    console.log(err)
    
    return res.status(400).send('Error..Try again')
  }
}
export const currentUser=async(req,res,next)=>{
  console.log(req.user)
  try{
    const user=User.findById(req.user._id)
    res.json({ok:true})
  }
  catch(err){
    console.log(err)
    res.sendStatus(400)
  }
}

export const forgotPassword=async(req,res)=>{
  console.log(req.body)
  const {email,newPassword,secret}=req.body
  if(!newPassword || newPassword.length<6){
    return res.json({error:"New password is required and should be min 6 characters lonh"})
  }
  if(!secret){
    return res.json({error:"Secret is required"})
  }
  const user=await User.findOne({email:email,secret:secret})
  console.log("user is "+user)
  if(!user)
    return res.json({error:"We cannot verify you without these details"})
    try{
        const hashed=await hashPassword(newPassword)
        await User.findByIdAndUpdate(user._id,{password:hashed})
        return res.json({success:"Congrats now you can login with your new password"})
        console.log("password is reset")
    }
    catch(err){
      console.log(err)
      return res.json({error:"Something wrong try again"})
    }
}
export const profileUpdate=async(req,res)=>{
  try{
    console.log('profile update req.body',req.body)
    const data={}
    if(req.body.username){
      data.username=req.body.username
    }
    if(req.body.about){
      data.about=req.body.about
    }
    if(req.body.name){
      data.name=req.body.name
    }
    if(req.body.password){
      if(req.body.password.length<6){

        return res.json({error:'Password is required and should be min 6 characters long'})
      }
      
      data.password=await hashPassword(req.body.password)
    }
    if(req.body.secret){
      data.secret=req.body.secret
    }
    if(req.body.image){
      data.image=req.body.image
    }
   let user=await User.findByIdAndUpdate(req.user._id,data,{new:true})
   user.password=undefined
   user.secret=undefined
   
   console.log('updated user',user)
   res.json(user)
  }catch(err){
    if(err.code==11000){
      return res.json({error:"Duplicate username"})
    }
    console.log(err)
  }
}
export const findPeople=async(req,res)=>{
  try{
    const user=await User.findById(req.user._id)
    let following=user.following
    following.push(req.user._id)
    console.log(`following are ${following}`)
    const people=await User.find({_id:{$nin:following}}).select('-password -secret').limit(10)
    console.log(`people are ${people.length}`)
    res.json(people)
  }
  catch(err){
    console.log(err)
  }
}
export const addFollower=async(req,res,next)=>{
  let id=req.user._id
  try{
    const user=await User.findByIdAndUpdate(req.body._id,
      {
        $addToSet:{followers:id}
      }
    )
    next()

  }
  catch(err){
    console.log(err)
  }

}
export const userFollow=async(req,res,next)=>{
  let id=req.body._id
  try{
      const user=await User.findByIdAndUpdate(req.user._id,{
        $addToSet:{following:id}
      },{new:true}).select('-password -secret')
      console.log(`now user is ${user}`)
      res.json(user)
  }
  catch(err){
    console.log(err)
  }
}
export const userFollowing=async(req,res)=>{
  try{
    const user=await User.findById(req.user._id)
    const following=await User.find({_id:user.following}).limit(10)
    res.json(following)
  }
  catch(err){
    console.log(err)
    res.json({error:err})
  }
}
export const removeFollower=async(req,res,next)=>{
  let id=req.user._id
  try{
     const user=await User.findByIdAndUpdate(req.body.id,{
       $pull:{followers:id}
     },)
     next()
  }
  catch(err){
    console.log(err)
  }
}
export const userUnFollow=async(req,res,next)=>{
  let id=req.body.id
  console.log(`unfollowing ${id} by ${req.user._id}`)
  try{
      const user=await User.findByIdAndUpdate(req.user._id,{
        $pull:{following:id}
      },{new:true})
      res.json(user)
  }
  catch(err){
    console.log(err)
  }
}
export const searchUser=async(req,res,next)=>{
  const {query}=req.params;
  if(!query) return
  try{
    const user=await User.find({
      $or:[{name:{$regex:query,$options:'i'}}||{username:{$regex:query,$options:'i'}}]
    }).select('_id name username image following followers')
    res.json(user)
  }
  catch(err){

  }
}
export const getUser=async(req,res,next)=>{
  try{
      const user=await User.findOne({username:req.params.username}).select("-password -secret")
      res.json(user)
  }
  catch(err){
    console.log(er)
  }
}