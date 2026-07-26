import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Button,
  Card,
  ColorPicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Typography,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { api } from "./store/api";
import type { TCake } from "./store/types";
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

export const OneCake = () => {
  const { cakeId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm<CakeFormValues>();
  const [cake, setCake] = useState<TCake | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const id = Number(cakeId);

  useEffect(() => {
    if (Number.isNaN(id)) {
      navigate("/cakes");
      return;
    }

    api
      .getCake(id)
      .then((res) => {
        setCake(res.data);
        form.setFieldsValue({
          ...res.data,
          color: res.data.color || undefined,
        });
      })
      .catch(() => {
        toast.error("Не удалось загрузить торт");
        navigate("/cakes");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (values: CakeFormValues) => {
    if (Number.isNaN(id)) return;

    setSaving(true);
    try {
      const color =
        typeof values.color === "string"
          ? values.color
          : (values.color?.toHexString?.() ?? undefined);

      const payload = {
        name: values.name,
        image: values.image,
        color,
        prices:
          values.prices?.map((p) => ({
            weight: Number(p.weight),
            price: Number(p.price),
          })) ?? [],
      };

      await api.updateCakes(id, payload);
      toast.success("Торт успешно обновлён");
    } catch (error) {
      toast.error("Не удалось обновить торт");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (Number.isNaN(id)) return;

    Modal.confirm({
      title: "Удалить торт?",
      content: `Вы уверены, что хотите удалить «${cake?.name}»?`,
      okText: "Удалить",
      okButtonProps: { danger: true, loading: deleting },
      cancelText: "Отмена",
      onOk: async () => {
        setDeleting(true);
        try {
          await api.deleteCakes(id);
          toast.success("Торт удалён");
          navigate("/cakes");
        } catch (error) {
          toast.error("Не удалось удалить торт");
          console.error(error);
          setDeleting(false);
        }
      },
    });
  };

  if (loading) {
    return <div className="loading" />;
  }

  return (
    <div className="wrapper">
      <Card className={styles.card}>
        <Title level={3} className={styles.title}>
          {cake?.name}
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
              { required: true, message: "Укажите ссылку на изображение" },
            ]}
          >
            <Input placeholder="https://example.com/cake.jpg" />
          </Form.Item>

          <Form.Item name="color" label="Цвет фона">
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
                          { required: true, message: "Введите вес" },
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
                          { required: true, message: "Введите цену" },
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
              loading={saving}
              className={styles.submitButton}
            >
              Сохранить изменения
            </Button>
          </Form.Item>

          <Button
            danger
            size="large"
            loading={deleting}
            onClick={handleDelete}
            className={styles.submitButton}
          >
            Удалить торт
          </Button>
        </Form>
      </Card>
    </div>
  );
};
