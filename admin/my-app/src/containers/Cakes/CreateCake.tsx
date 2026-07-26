import { useState } from "react";
import {
  Button,
  Card,
  ColorPicker,
  Form,
  Input,
  InputNumber,
  Space,
  Typography,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import apiClient from "../../api";
import styles from "./styles.module.css";

const { Title } = Typography;

type CakePrice = {
  weight?: number | null;
  price?: number | null;
};

type CakeFormValues = {
  name: string;
  image?: string;
  color?: string | { toHexString?: () => string };
  prices?: CakePrice[];
};

export const CreateCake = () => {
  const [form] = Form.useForm<CakeFormValues>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: CakeFormValues) => {
    setLoading(true);
    try {
      const color =
        typeof values.color === "string"
          ? values.color
          : (values.color?.toHexString?.() ?? undefined);

      const image = values.image ?? undefined;

      const payload = {
        name: values.name,
        image,
        color,
        prices:
          values.prices?.map((p) => ({
            weight: Number(p.weight),
            price: Number(p.price),
          })) ?? [],
      };

      await apiClient.post("/cakes", payload);
      toast.success("Торт успешно создан");
      form.resetFields();
    } catch (error) {
      toast.error("Не удалось создать торт");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <Card className={styles.card}>
        <Title level={3} className={styles.title}>
          Новый торт
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          className={styles.form}
        >
          <Form.Item
            name="name"
            label="Наименование"
            rules={[
              { required: true, message: "Введите наименование торта" },
              { max: 255, message: "Максимум 255 символов" },
            ]}
          >
            <Input placeholder="Например, Медовик классический" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Ссылка на картинку"
            rules={[
              { required: true, message: "Укажите ссылку на изображение" }
            ]}
          >
            <Input placeholder="https://example.com/cake.jpg" />
          </Form.Item>

          <Form.Item
            name="color"
            label="Цвет фона"
          >
            <ColorPicker format="hex" showText />
          </Form.Item>

          <div className={styles.pricesSection}>
            <Title level={5} className={styles.pricesTitle}>
              Цены на торт
            </Title>

            <Form.List name="prices">
              {(fields, { add, remove }) => (
                <div className={styles.pricesList}>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      align="baseline"
                      className={styles.priceRow}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "weight"]}
                        rules={[
                          {
                            required: true,
                            message: "Введите вес",
                          },
                          {
                            type: "number",
                            min: 0.1,
                            message: "Минимальный вес 0.1 кг",
                          },
                        ]}
                        className={styles.priceField}
                      >
                        <InputNumber
                          min={0.1}
                          step={0.1}
                          placeholder="Вес, кг"
                          className={styles.number}
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "price"]}
                        rules={[
                          {
                            required: true,
                            message: "Введите цену",
                          },
                          {
                            type: "number",
                            min: 0,
                            message: "Цена не может быть отрицательной",
                          },
                        ]}
                        className={styles.priceField}
                      >
                        <InputNumber
                          min={0}
                          placeholder="Цена"
                          className={styles.number}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                          }
                        />
                      </Form.Item>

                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Space>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    className={styles.addButton}
                  >
                    Добавить цену
                  </Button>
                </div>
              )}
            </Form.List>
          </div>

          <Form.Item className={styles.submit}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className={styles.submitButton}
            >
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
