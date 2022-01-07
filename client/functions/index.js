export const imageSource=(user)=>{
    console.log(`user in imageSource is ${user}`)
   if(user.image){
       return user.image.url
   }else{
       console.log("entered in else of imageSource")
       return "/images/cloudy.jpg"
   }
}