import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiUsers } from "../Users/store/api";
import {
  permissionsSlice,
  type IPermission,
} from "../../store/permissionsSlice";
import type { RootState } from "../../store";
import { Link } from "react-router";
import "./styles.css";

const { setPermissions } = permissionsSlice.actions;

export const Permissions = () => {
  const dispatch = useDispatch();
  const { permissions } = useSelector((state: RootState) => state.permissions);

  useEffect(() => {
    if (!permissions.length) {
      apiUsers.getPermissions().then((res: { data: IPermission[] }) => {
        dispatch(setPermissions(res.data));
      });
    }
  }, []);
  return (
    <div className="wrapper permissions_wrapper">
      <header>
        <Link to="/users/permissions/create" className="link_button">
          Создать разрешение
        </Link>
      </header>
      {permissions.map((permission, index) => (
        <div key={permission.id}>
          {index + 1}. {permission.description} | {permission.name}
        </div>
      ))}
    </div>
  );
};
