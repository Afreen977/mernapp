import renderHTML from 'react-render-html'
import moment from 'moment'
import {Avatar} from 'antd'
import {useContext} from 'react'
import {useRouter} from 'next/router'
import {
    HeartOutlined,
    HeartFilled,
    EditOutlined,
    DeleteOutlined,
    CommentOutlined
} from '@ant-design/icons'
import {imageSource} from '../../functions/index'
import PostImage from '../images/PostImage'
import {UserContext} from '../../context'
import post from '../../../server/models/post'
import Link from 'next/link'
const PostPublic = ({
    post,
    handleDelete,
    handleLike,
    handleUnlike,
    handleComment,
    commentsCount=2,
    removeComment
}) => {
    const router = useRouter()
    const [state] = useContext(UserContext)
    console.log("posts is " + post);

    return(
        <>
            {post && post.postedBy && <>
                <div key={
                        post._id
                    }
                    className="card mb-5">

                    <div className="card-header">
                        <div>
                            <Avatar size={40}
                                src={
                                    imageSource(post.postedBy)
                                }/>
                            <span className="pt-2 ml-3"
                                style={
                                    {marginLeft: "1rem"}
                            }>
                                {
                                post.postedBy.name
                            }</span>
                            <span className="pt-2 ml-3"
                                style={
                                    {marginLeft: "1rem"}
                            }>
                                {
                                moment(post.createdAt).fromNow()
                            }</span>
                        </div>
                    </div>
                    <div className="card-body">
                        {
                        renderHTML(post.content)
                    } </div>
                    <div className="card-footer">
                        {
                        post.image && <PostImage url={
                            post.image.url
                        }/>
                    }
                        <div className="d-flex pt-2">
                            {
                            state && state.user && post.likes && post.likes.includes(state.user._id) ? <HeartFilled className="text-anger pt-2 h5 px-2"
                               /> : <HeartOutlined className="text-danger pt-2 h5 px-2"
                             />
                        }
                            <div className="pt-3 px-3"
                                style={
                                    {marginRight: "1rem"}
                            }>
                                {
                                post.likes.length
                            }
                                likes</div>
                        </div>
                        <CommentOutlined className="text-danger pt-2 h5 px-5"
                         />
                        <div className="pt-3 px-3">
                        
                              {
                                    post.comments.length
                                }
                                    comments
                      
                        </div>
            </div>


                </div>
                 {console.log(`post.comments is ${post.comments}`)}
                {
                post.comments && post.comments.length > 0 && <ol className="list-group" style={{maxHeight:'125px',overflow:'scroll'}}>
                    {
                    post.comments.slice(0,commentsCount).map((c) => {
                        return (<li key={c._id} className="list-group-item d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                                <div><Avatar size={20}
                                        className="mb-1 mr-3"
                                        src={
                                            imageSource(c.postedBy)
                                        }/></div>
                                <div>{
                                    c.text
                                }</div>

                            </div>
                            <span className="badge rounded-pill text-muted">
                                {
                                moment(c.created).fromNow()
                            } 
                            </span>
                        </li>)})
                } </ol>
            } </>
    }
    </>);

    }
    export default PostPublic