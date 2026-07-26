import { Link } from "react-router";
import "./styles.css";

export const NotFound = () => {
  return (
    <div className="not_found_wrapper">
      <h2>404</h2>
      <p>Старница не найдена или не хватает прав на просмотр</p>
      <Link to="/">Вернуться на главную</Link>
    </div>
  );
};
