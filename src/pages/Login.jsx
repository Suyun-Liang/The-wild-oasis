import LoginForm from "../features/authentication/LoginForm";

function Login({ onCloseModal }) {
  return (
    <div>
      Log-in <LoginForm from="user" onCloseModal={onCloseModal} />
    </div>
  );
}

export default Login;
