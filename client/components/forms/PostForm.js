import {Avatar} from 'antd'
import dynamic from 'next/dynamic'


const ReactQuill = dynamic(() => import ("react-quill"), {ssr: false})
import 'react-quill/dist/quill.snow.css';
import { CameraOutlined,LoadingOutlined } from '@ant-design/icons';


import {useEffect, useState, useContext} from "react";
const PostForm = ({content, setContent, postSubmit,handleImage,uploading,image}) => {
    if(image) console.log(`img is ${image.url}`)
    return (
        <>
            <div className="card">
                <div className="card-body pb-3">
                    <form className="form-group">
                        <ReactQuill theme="snow"
                            value={content}
                            onChange={
                                e => setContent(e)
                            }
                            className="form-control"
                            placeholder="Write Something.."></ReactQuill>

                    </form>
                </div>

                <div className="card-footer d-flex justify-content-between">
                    <button onClick={postSubmit}
                        className="btn btn-primary mt-1"
                        disabled={
                            !content
                    }>Post</button>
                    <label>
                        {image && image.url ?(<Avatar size={30} src={`http://localhost:8000/${image.url}`} className="mt-1"/>):uploading? (  <LoadingOutlined className="mt-2"/>):  <CameraOutlined className="mt-2"/>}
                      
                        <input type="file" accept="images/*" hidden onChange={handleImage}/>
                    </label>
                </div>
            </div>
        </>
    );
}
export {
    PostForm
};
