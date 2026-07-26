import { App } from "./App";
import { Login } from "./containers/Login";
import { Registration } from "./containers/Registration";
import { Routes } from "react-router";
import { Route } from "react-router";
import Users from "./containers/Users";
import { RolesList } from "./containers/Roles";
import { CreateRole } from "./containers/Roles/CreateRole";
import { OneRole } from "./containers/Roles/OneRole";
import { NotFound } from "./containers/NotFound";
import { Permissions } from "./containers/Permissions";
import { CreatePermission } from "./containers/Permissions/CreatePermission";
import { Account } from "./containers/Account";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import { Cakes } from "./containers/Cakes";
import { CreateCake } from "./containers/Cakes/CreateCake";
import { OneCake } from "./containers/Cakes/OneCake";
import { Orders } from "./containers/Orders";

export const AppRoutes = () => {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <Routes>
      {!user ? <Route path="*" element={<Login />} /> : null}
      {user ? (
        <>
          <Route path="/" element={<App />} />
          <Route path="/account" element={<Account />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/cakes" element={<Cakes />} />
          <Route path="/cakes/create" element={<CreateCake />} />
          <Route path="/cakes/:cakeId" element={<OneCake />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/roles" element={<RolesList />} />
          <Route path="/users/roles/create" element={<CreateRole />} />
          <Route path="/users/roles/:roleId" element={<OneRole />} />
          <Route path="/users/permissions" element={<Permissions />} />
          <Route
            path="/users/permissions/create"
            element={<CreatePermission />}
          />
          <Route path="*" element={<NotFound />} />
        </>
      ) : null}
    </Routes>
  );
};
