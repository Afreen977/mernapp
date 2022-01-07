import { SyncOutlined } from "@ant-design/icons";
const ForgotPasswordForm = ({
  handleSubmit,

  email,
  setEmail,
  newPassword,
  setNewPassword,
  secret,
  setSecret,
  loading,
  setLoading,
  page,
}) => {
  console.log("page is "+page)
  return (
    <form onSubmit={handleSubmit}>
     
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
        />
      </div>
      <div className="form-group p-2">
        <small>
          <label className="text-muted">New Password</label>
        </small>
        <input
          onChange={(e) => setNewPassword(e.target.value)}
          type="text"
          value={newPassword}
          className="form-control"
          placeholder="Enter new password"
        />
      </div>
  
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
 
      <div className="form-group p-2">
        <button
          className="btn btn-primary col-12"
          disabled={
           !email||!newPassword||!secret
          }
        >
          {loading ? <SyncOutlined spin className="py-1" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
