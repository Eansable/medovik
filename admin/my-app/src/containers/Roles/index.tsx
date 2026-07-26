import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useEffect } from "react";
import { apiUsers } from "../Users/store/api";
import { permissionsSlice, type IRole } from "../../store/permissionsSlice";
import { Link } from "react-router";
import "./styles.css";

const { setRoles } = permissionsSlice.actions;

export const RolesList = () => {
  const dispatch = useDispatch();
  const { roles } = useSelector((state: RootState) => state.permissions);

  useEffect(() => {
    if (!roles.length) {
      apiUsers.getRoles().then((res: { data: IRole[] }) => {
        dispatch(setRoles(res.data));
      });
    }
  }, []);

  return (
    <div className="wrapper roles_wrapper">
      <header>
        <Link to="/users/roles/create" className="link_button">
          Создать роль
        </Link>
      </header>
      {roles?.map((role) => (
        <Link to={`/users/roles/${role.id}`} key={role.id}>
          <h3>{role.name}</h3>
          <p>{role.description}</p>
        </Link>
      ))}
    </div>
  );
};
