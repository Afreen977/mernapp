import {UserContext} from '../../context/index'
import { useContext } from 'react'

const ParallaxBG=({url,children="MERN CAMP"})=>{
    const state=useContext(UserContext)
    return (
        <div className="container-fluid text-center" style={{backgroundImage:"url( "+ url +")",backgroundAttachment:"fixed",padding:"100px 0px 75px 0px",backgroundRepeat:"no-repeat",backgroundSize:"cover",backgroundPosition:"center center",display:"block"}} >
          
          <h1 className="display-1 font-weight-bold text-center">{children}</h1>
                 
        </div>
    )
}
export default ParallaxBG