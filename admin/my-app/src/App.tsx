import { Link } from "react-router";
import "./App.css";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import { clearUser } from "./store/userSlice";

export const App = () => {
  const dispatch = useDispatch();
  return (
    <div className="app_wrapper">
      <Link to="/users">Пользователи</Link>
      <Link to="/users/roles">Роли</Link>
      <Link to="/users/permissions">Разрешения</Link>
      <Link to="/account">Мой профиль</Link>
      <Link to="/cakes">Медовики</Link>
      <Link to="/orders">Заказы</Link>
      <Button className="exit" type="primary" onClick={() => {
        localStorage.removeItem("token");
        dispatch(clearUser());
      }}>
        Выход
      </Button>
    </div>
  );
};
