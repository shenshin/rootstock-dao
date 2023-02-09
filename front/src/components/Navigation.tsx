import { NavLink } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <ul className="nav-bar">
      <li>
        <NavLink to="enfranchisement">Enfranchisement</NavLink>
      </li>
    </ul>
  );
}

export default Navigation;
