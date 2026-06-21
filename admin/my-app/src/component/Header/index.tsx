import { Link } from "react-router";
import "./styles.css";

export const Header = () => {
  return (
    <header className="main-header">
      <Link to="/">Medovik</Link>
    </header>
  );
};
