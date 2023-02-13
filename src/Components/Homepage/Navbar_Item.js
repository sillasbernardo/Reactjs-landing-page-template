import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Navbar_Item.scss';

const NavbarItem = (props) => {

  return (
    <li className={props.onModal ? "navbar-item-modal" : "navbar-item"} >
      <FontAwesomeIcon icon={props.iconName} />
      <span>{props.navItemTitle}</span>
    </li>
  );
};

export default NavbarItem;
