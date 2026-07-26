import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "./store/api";
import type { TCake } from "./store/types";
import styles from "./styles.module.css";

export const Cakes = () => {
  const [cakes, setCakes] = useState<TCake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getCakes()
      .then((res) => setCakes(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading" />;
  }

  return (
    <div className="wrapper">
      <Link to="/cakes/create" className="link_button">
        Добавить торт
      </Link>

      <div className={styles.grid}>
        {cakes.map((cake) => (
          <Link
            to={`/cakes/${cake.id}`}
            key={cake.id}
            className={styles.cakeCard}
          >
            {cake.image && (
              <img
                src={cake.image}
                alt={cake.name}
                className={styles.cakeImage}
              />
            )}
            <div className={styles.cakeInfo}>
              <h3 className={styles.cakeName}>{cake.name}</h3>
              {cake.prices.length > 0 && (
                <p className={styles.cakePrices}>
                  от {Math.min(...cake.prices.map((p) => p.price))} руб.
                </p>
              )}
              <p className={styles.cakeDate}>
                Обновлено: {new Date(cake.updatedAt).toLocaleDateString("ru-RU")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
