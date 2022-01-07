import { Avatar, List } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import { useContext } from "react";
import { imageSource } from "../../functions/index";
import Link from "next/link";
const People = ({ people, handleFollow,handleUnfollow }) => {
  console.log(`people length is ${people.length}`);
  const [state] = useContext(UserContext);

  const router = useRouter();
  return (
    <List
      itemLayout="horizontal"
      dataSource={people}
      renderItem={(user) => {
       return user && (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={imageSource(user)} />}
              title={
                <div
                  className="d-flex justify-content-between"
                 
                >
               <Link href={`/user/${user.username}`}><a>{user.username}</a></Link>
                  {state && state.user && 
                  user.followers.includes(state.user._id) ? (
                    <span
                      onClick={() => {handleUnfollow(user)}}
                      className="text-primary pointer"
                    >
                      Unfollow
                    </span>
                  ) : (
                    <span
                      onClick={() => handleFollow(user)}
                      className="text-primary pointer"
                    >
                      Follow
                    </span>
                  )}
                </div>
              }
              description={user.about}
            />
          </List.Item>
        );
      }}
    ></List>
  );
};
export default People;
