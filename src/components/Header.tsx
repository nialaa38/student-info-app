import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <h1>Student Info App</h1>
        </div>
        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/students" className="nav-link">
                Students
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;