import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import styles from "./styles.module.css";
import { Link } from "react-router";
import { Form, Input, Button } from "antd";
import { api } from "../Login/store/api";
import { toast } from "sonner";

export const Account = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [form] = Form.useForm();
  const onSubmit = (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    api.changePassword(values).then(() => {
      form.resetFields();
      toast.success("Пароль успешно изменен");
    });
  };
  return (
    <div className={styles.account_wrapper}>
      <Link to="/"> На главную </Link>
      {user && (
        <div>
          <p>Логин: {user.user.login}</p>
          <p>
            Имя: {user.user.firstName} {user.user.lastName}
          </p>
          <p>Email: {user.user.email}</p>
          <p>Телефон: {user.user.phone}</p>
          <p>Роли: {user.user.roles.join(", ")}</p>
        </div>
      )}
      <Form form={form} onFinish={onSubmit}>
        <Form.Item
          label="Старый пароль"
          name="currentPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Новый пароль"
          name="newPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Подтверждение пароля"
          name="confirmPassword"
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Сохранить
        </Button>
      </Form>
    </div>
  );
};
