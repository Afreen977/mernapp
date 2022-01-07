import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import { PostForm } from "../../components/forms/PostForm";
import { useRouter } from "next/router";
import axios, { Axios } from "axios";
import { toast } from "react-toastify";
import AdminRoute from "../../components/routes/AdminRoute";
import renderHTML from "react-render-html";

const Admin = () => {
  const router = useRouter();
  const [state, setState] = useContext(UserContext);

  const [posts, setPosts] = useState([]);

  const addComment = async (e) => {
    e.preventDefault();
    console.log("add comment to this post id", currentPost._id);
  };

  useEffect(() => {
    if (state && state.token) {
      newsFeed();
    }
  }, [state && state.token]);

  const newsFeed = async () => {
    try {
      const { data } = await axios.get(`/posts`);
      console.log("user posts=>", data);
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are you sure?");
      if (!answer) return;

      const { data } = await axios.delete(`/admin/delete-post/${post._id}`);
      toast.success("Post deleted");
      newsFeed();
    } catch (err) {
      toast.error("Post deletion failed" + err);
    }
  };
  console.log(`posts in dashboard is ${posts}`);
  return (
    <AdminRoute>
      <div className="container-fluid">
        <div className="row py-5 ">
          <div className="col text-center">
            <h1>ADMIN</h1>
          </div>
          <div className="row py-4">
            <div className="col-md-8 offset-md-2 ">
              {posts.length > 0 &&
                posts.map((post) => {
                  return (
                    <div
                      key={post._id}
                      className="d-flex justify-content-between"
                    >
                      <div>
                        {" "}
                        {renderHTML(post.content)} 
                      </div>
                      <div
                        className="text-danger"
                        onClick={() => {
                          handleDelete(post);
                        }}
                      >
                        Delete
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};
export default Admin;
