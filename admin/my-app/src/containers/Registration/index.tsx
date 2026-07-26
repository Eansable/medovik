import { useEffect } from "react";
import { toast } from "sonner";
import { Form, Input, Button, Select } from "antd";
import { api } from "./store/api";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { apiUsers } from "../Users/store/api";
import { permissionsSlice, type IRole } from "../../store/permissionsSlice";
import type { RegisterData } from "./store/types";

const { setRoles } = permissionsSlice.actions;

export const Registration = () => {
  const dispatch = useDispatch();
  const { roles } = useSelector((state: RootState) => state.permissions);
  const [form]  = Form.useForm();

  const handleSubmit = ({
    confirmPassword,
    ...values
  }: RegisterData & { confirmPassword: string }) => {
    if (confirmPassword !== values.password) {
      toast.error("Пароли не совпадают");
      return;
    }

    api
      .register(values)
      .then(() => {
        toast.success("Регистрация прошла успешно!");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message ?? "Ошибка регистрации");
      });
  };

  useEffect(() => {
    if (!roles.length) {
      apiUsers
        .getRoles()
        .then((roles: { data: IRole[] }) => {
          dispatch(setRoles(roles.data));
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message ?? "Ошибка получения прав");
        });
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <Form
        className={styles.form}
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <h1>Регистрация</h1>

        <Form.Item
          label="Логин"
          name="login"
          rules={[{ required: true, message: "Введите логин" }]}
        >
          <Input placeholder="Логин" />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: "Введите пароль" }]}
        >
          <Input.Password placeholder="Пароль" />
        </Form.Item>
        <Form.Item
          label="Подтверждение пароля"
          name="confirmPassword"
          rules={[
            { required: true, message: "Подтвердите пароль" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Повторите пароль" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input placeholder="example@mail.com" />
        </Form.Item>
        <Form.Item label="Имя" name="firstName">
          <Input placeholder="Введите имя" />
        </Form.Item>
        <Form.Item label="Фамилия" name="lastName">
          <Input placeholder="Введите фамилию" />
        </Form.Item>
        <Form.Item label="Телефон" name="phone">
          <Input placeholder="Введите телефон" />
        </Form.Item>
        <Form.Item label="Роли" name="roles">
          <Select
            mode="multiple"
            placeholder="Выберите роль"
            options={roles?.map((role) => ({
              value: role.id,
              label: role.name,
            }))}
          />
        </Form.Item>

        <div className={styles.actions}>
          <Button type="primary" htmlType="submit">
            Зарегистрировать
          </Button>
        </div>
      </Form>
    </div>
  );
};
