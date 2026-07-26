import { Button, Form, Input } from "antd";
import { apiUsers } from "../Users/store/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export const CreatePermission = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  return (
    <div>
      <Form form={form} onFinish={(values) => {
        apiUsers.createPermissions(values).then(() => {
          form.resetFields();
          toast.success("Разрешение успешно создано");
          navigate("/users/permissions/");
        });
      }}>
        <Form.Item name="name" label="Название">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Описание">
          <Input />
        </Form.Item>
        <Button htmlType="submit">Сохранить</Button>
      </Form>
    </div>
  );
}
