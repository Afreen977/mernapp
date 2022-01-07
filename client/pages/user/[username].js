import { Avatar, Card } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";
import { toast } from "react-toastify";
const Username = () => {
  const [state, setState] = useContext(UserContext);
  const [user, setUser] = useState({});
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

    fetchUser();
  }, [router.query.username]);
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`/user/${router.query.username}`);
      console.log("following=>", data);
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };
  const { Meta } = Card;
  return (
    <>
      <div className="row col-md-6 offset-md-3">
        <div className="pt-5 pb-5">
          {" "}
          <Card
            hoverable
            cover={<img src={imageSource(user)} alt={user.name} />}
          >
            <Meta title={user.name} description={user.about} />
            <p className="pt-2 text-muted">
              Joined {moment(user.createdAt).fromNow()}
            </p>
            <div className="d-flex justify-content-between">
              <span className="btn btn-sm">
                {user.followers && user.followers.length} Followers
              </span>
              <span className="btn btn-sm">
                {user.following && user.following.length} Following
              </span>
            </div>
          </Card>
        </div>

        <Link href="/user/dashboard">
          <a className="flex justify-content-center pt-5">
            <RollbackOutlined />
          </a>
        </Link>
      </div>
    </>
  );
};
export default Username;
