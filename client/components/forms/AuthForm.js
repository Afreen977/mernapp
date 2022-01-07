import { SyncOutlined } from "@ant-design/icons";
const AuthForm = ({
  handleSubmit,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  secret,
  setSecret,
  loading,
  setLoading,
  page,
  username,
  setusername,
  about,
  setabout,
  profileUpdate
}) => {
  console.log("page is "+page)
  return (
    <form onSubmit={handleSubmit}>
    {page!='login' &&  <div className="form-group p-2">
          <small>
            <label className="text-muted">Name</label>
          </small>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
            className="form-control"
            placeholder="Enter name"
          />
        </div>}
        {profileUpdate &&  <div className="form-group p-2">
          <small>
            <label className="text-muted">Username</label>
          </small>
          <input
            onChange={(e) => setusername(e.target.value)}
            type="text"
            value={username}
            className="form-control"
            placeholder="Enter username"
          />
        </div>}
        {profileUpdate && <div className="form-group p-2">
          <small>
            <label className="text-muted">About</label>
          </small>
          <input
            onChange={(e) => setabout(e.target.value)}
            type="text"
            value={about}
            className="form-control"
            placeholder="Enter about you"
          />
        </div>}
    <div className="form-group p-2">
        <small>
          <label className="text-muted">Your Email</label>
        </small>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          value={email}
          className="form-control"
          placeholder="Enter Email"
          disabled={profileUpdate}
        />
      </div>
      <div className="form-group p-2">
        <small>
          <label className="text-muted">Your Password</label>
        </small>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="text"
          value={password}
          className="form-control"
          placeholder="Enter password"
        />
      </div>
      {page != 'login' && (
        <>
          <div className="form-group p-2">
            <small>
              <label className="text-muted">Pick a question</label>
            </small>
            <select className="form-control">
              <option>What is your favourite color?</option>
              <option>What is your best friend's name?</option>
              <option>What is your favourite color?</option>
            </select>
            <small className="form-text text-muted">
              You can use this to reset your password if forgotten
            </small>
          </div>
          <div className="form-group p-2">
            <input
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Write your answer here"
            />
          </div>
        </>
      )}
      <div className="form-group p-2">
        <button
          className="btn btn-primary col-12"
          disabled={
          profileUpdate ?loading:
            page === "login"
              ? !email || !password
              : !name|| !email || !password || !secret ||loading
          }
        >
          {loading ? <SyncOutlined spin className="py-1" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
