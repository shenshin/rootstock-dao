import { NavLink } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <ul className="nav-bar">
      <li>
        <NavLink to="delegate">Delegate VP</NavLink>
      </li>
      <li>
        Create proposal
        <ul className="nav-bar-nested-1">
          <li>
            <NavLink to="propose-rbtc-transfer">RBTC transfer</NavLink>
          </li>
          <li>
            <NavLink to="propose-competition">Competition</NavLink>
          </li>
        </ul>
      </li>
      <li>
        <NavLink to="state">Proposal state</NavLink>
      </li>
      <li>
        <NavLink to="vote">Vote</NavLink>
      </li>
      <li>
        <NavLink to="execute">Execute</NavLink>
      </li>
    </ul>
  );
}

export default Navigation;
