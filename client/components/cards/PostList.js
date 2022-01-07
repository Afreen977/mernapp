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
import Post from '../../components/cards/Post'
const PostList = ({
    posts,
    handleDelete,
    handleLike,
    handleUnLike,
    handleComment,
    removeComment
}) => {
    const router = useRouter()
    const [state] = useContext(UserContext)
    console.log("posts is " + posts);

    return (


        <> {
            posts.length > 0 && posts.map((post) => {
             
                if (post.postedBy) {
                    console.log(`post is ${
                        post.postedBy.name
                    }`);
                    return (
                     <Post key={post._id} post={post} handleDelete={handleDelete} handleLike={handleLike} handleUnlike={handleUnLike} handleComment={handleComment} removeComment={removeComment}/>
                    );
                }
})
        } </>
    );
}
export default PostList
