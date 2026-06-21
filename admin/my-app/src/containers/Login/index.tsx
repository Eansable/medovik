import "./styles.css";

export const Login = () => {
  return (
    <div className="login_wrapper">
      <h1>Login</h1>
      <form
        className="login_form"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <input type="text" placeholder="Username" />
        <br />
        <input type="password" placeholder="Password" />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
