import { Avatar, List } from "antd";

import { useRouter } from "next/router";
import { UserContext } from "../../context";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { RollbackOutlined } from "@ant-design/icons";
import  Link  from "next/link";

import { toast } from "react-toastify";
const Following = () => {
  const [state, setState] = useContext(UserContext);
  const [people, setPeople] = useState([]);
  const router = useRouter();
  const imageSource = (user) => {
    console.log(`user in imageSource is ${user}`);
    if (user.image) {
      return user.image.url;
    } else {
      console.log("entered in else of imageSource");
      return "/images/cloudy.jpg";
    }
  };
  useEffect(() => {
    console.log(`state in following is ${state.token}`);
    if (state) {
      fetchFollowing();
    }
  }, []);
  const fetchFollowing = async () => {
    try {
      const { data } = await axios.get("/user-following");
      console.log("following=>", data);
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleUnfollow = async (user) => {
    try {
      const { data } = await axios.put("/user-unfollow", { id: user._id });
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });
      console.log("handle unfollow response", data);
      let filtered = people.filter((p) => {
        p._id !== user._id;
      });
      setPeople(filtered);

      toast.error(`UnFollowing ${user.name}`);
    } catch (err) {}
  };
  return (
    <>
      {console.log(`people are ${people.length}`)}
     
        <div className="row col-md-6 offset-md-3">
          <List
            itemLayout="horizontal"
            dataSource={people}
            renderItem={(user) => {
              return(<List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={imageSource(user)} />}
                  title={
                    <div
                      className="d-flex justify-content-between"
                      onClick={() => handleUnfollow(user)}
                    >
                      {user.username}
                      <span className="pointer">Unfollow</span>
                    </div>
                  }
                  description={user.about}
                />
              </List.Item>);
            }}
          />
          <Link href="/user/dashboard">
            <a className="flex justify-content-center pt-5">
              <RollbackOutlined />
            </a>
          </Link>
        </div>

    </>
  );
};
export default Following;
