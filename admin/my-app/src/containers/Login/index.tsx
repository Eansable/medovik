import { useEffect, useState } from "react";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { setUser, type User, setLoginLoading } from "../../store/userSlice";
import { api } from "./store/api";
import type { RootState } from "../../store";
export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => state.user);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    api
      .login({ login, password })
      .then((res: { data: User }) => {
        const { token } = res.data;
        localStorage.setItem("token", token);
        dispatch(setUser(res.data));
        toast.success("Вход выполнен успешно!");
        navigate("/");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message ?? "Ошибка входа");
      })
      .finally(() => {
        setLoginLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token)
      api.me().then((res: {data: User}) => {
        dispatch(setUser(res.data));
      }).catch(() => {
        localStorage.removeItem("token");
      });
  }, []);

  return !isLoading ? (
    <div className="login_wrapper">
      <form className="login_form" onSubmit={handleSubmit}>
        <h1>Вход</h1>
        <input
          placeholder="Email"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Войти</button>
      </form>
    </div>
  ) : (
    <div className="loading"></div>
  );
};
