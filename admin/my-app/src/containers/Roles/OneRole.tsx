import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { apiUsers } from "../Users/store/api";
import { permissionsSlice, type IOneRole } from "../../store/permissionsSlice";
import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import { Button, Checkbox } from "antd";
import { toast } from "sonner";

const { setPermissions } = permissionsSlice.actions;

export const OneRole = () => {
  const { roleId } = useParams();
  const [role, setRole] = useState<IOneRole>();
  const [rolePermissions, setRolePermissions] = useState<number[]>([]);
  const { permissions } = useSelector((state: RootState) => state.permissions);

  useEffect(() => {
    apiUsers.getOneRole(Number(roleId)).then((res: { data: IOneRole }) => {
      setRole(res.data);
      setRolePermissions(res.data.permissions.map((p) => p.id));
    });
    if (!permissions?.length) {
      apiUsers.getPermissions().then((res) => {
        setPermissions(res.data);
      });
    }
  }, []);

  return (
    <div>
      {role && (
        <div>
          {role.name}
          {permissions?.map((permission) => (
            <Checkbox
              key={permission.id}
              checked={rolePermissions.includes(permission.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setRolePermissions([...rolePermissions, permission.id]);
                } else {
                  setRolePermissions(
                    rolePermissions.filter((id) => id !== permission.id),
                  );
                }
              }}
            >
              {permission.name}
            </Checkbox>
          ))}
          <Button
            onClick={() => {
              apiUsers
                .setPermissions({
                  roleId: role.id,
                  permissionIds: rolePermissions,
                })
                .then(() => {
                  toast.success("Изменения сохранены");
                });
            }}
            type="primary"
          >
            Сохранить
          </Button>
        </div>
      )}
    </div>
  );
};
