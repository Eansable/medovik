import { useEffect, useState } from "react";
import {  apiUsers } from "./store/api";
import type { IUserShort } from "./store/types";

import "./styles.css";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const Users = () => {
  const [users, setUsers] = useState<IUserShort[]>([]);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    apiUsers.getUsers().then((res) => {
      setUsers(res.data);
    });
  }, []);

  return (
    <div>
      <h2>Пользователи</h2>
      <section className="users_wrapper">
        <header>
          {user ? <Link to="/registration" className="link_button">Добавить пользователя</Link> : null}
        </header>
        {users?.map((user: IUserShort) => (
          <div key={user?.id} className="user_item">
            <p>{user?.firstName || "__"}</p>
            <p>{user?.lastName || "__"}</p>
            <p>{user?.email || "__"}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Users;
