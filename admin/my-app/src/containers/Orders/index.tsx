import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "./store/api";
import type { TOrder } from "./store/types";
import styles from "./styles.module.css";

const statusLabels: Record<TOrder["status"], string> = {
  new: "Новый",
  confirmed: "Подтверждён",
  completed: "Выполнен",
  cancelled: "Отменён",
};

const deliveryLabels: Record<TOrder["deliveryType"], string> = {
  delivery: "Доставка",
  pickup: "Самовывоз",
};

export const Orders = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getOrders()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading" />;
  }

  return (
    <div className="wrapper">
      <h2 className={styles.title}>Заказы</h2>

      <div className={styles.grid}>
        {orders.map((order) => (
          <Link
            to={`/orders/${order.id}`}
            key={order.id}
            className={styles.orderCard}
          >
            <div className={styles.orderHeader}>
              <span className={styles.orderId}>#{order.id}</span>
              <span className={styles.orderStatus}>{statusLabels[order.status]}</span>
            </div>

            <div className={styles.orderInfo}>
              <p className={styles.orderName}>{order.customerName}</p>
              <p className={styles.orderPhone}>+375{order.phone}</p>
              <p className={styles.orderDelivery}>
                {deliveryLabels[order.deliveryType]}
                {order.deliveryType === "pickup" && order.pickupPlace
                  ? ` — ${order.pickupPlace}`
                  : null}
                {order.deliveryType === "delivery" && order.address
                  ? ` — ${order.address}`
                  : null}
              </p>
              <p className={styles.orderDateTime}>
                {order.deliveryDate} в {order.deliveryTime}
              </p>
              <p className={styles.orderPrice}>{order.totalPrice.toFixed(2)} руб.</p>
              <p className={styles.orderItemsCount}>
                Позиций: {order.items?.length ?? 0}
              </p>
              <p className={styles.orderCreated}>
                Создан: {new Date(order.createdAt).toLocaleDateString("ru-RU")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
