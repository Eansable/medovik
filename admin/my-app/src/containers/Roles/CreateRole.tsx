import { Button, Form, Input } from "antd";
import { apiUsers } from "../Users/store/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export const CreateRole = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  return (
    <div>
      <Form form={form} onFinish={(values) => {
        apiUsers.createRole(values).then(() => {
          form.resetFields();
          toast.success("Роль успешно создана");
          navigate("/users/roles/");
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
