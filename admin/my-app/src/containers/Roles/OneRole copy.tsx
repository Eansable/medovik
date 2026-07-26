import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { apiUsers } from "../Users/store/api";
import type { IOneRole } from "../../store/permissionsSlice";

export const OneRole = () => {
  const { roleId } = useParams();
  const [role, setRole] = useState<IOneRole>();
  useEffect(() => {
    apiUsers.getOneRole(Number(roleId)).then((res) => {
      setRole(res.data)
    });
  }, []);

  return (
    <div>
      {role && <div>
        {role.name}
        <ul>
          {role.permissions && role.permissions.map((permission) => (
            <li key={permission.id}>{permission.name}</li>
          ))}
        </ul>
      </div>}
    </div>
  );
}
