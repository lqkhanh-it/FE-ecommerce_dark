import React from "react";
import classNames from "classnames";
import { Link, withRouter } from "react-router-dom";
import Dropdown from "./Dropdown";
import Axios from "axios";
function MenuItemDropdown(props) {
  const arrImgPhone = [];
  // Axios.get(`http://localhost:4000/products`).then((res) => {
  //   if (res.data.length > 0) {
  //     res.data.map((item) => {
  //       if (arrImgPhone.length <= 3) {
  //         if (item.productType == "Phone") {
  //           arrImgPhone.push(item.productImg[0]);
  //         }
  //       }
  //     });
  //   }
  // });
  const dropdownHover = props.dropdownHover;
  const location = props.location.pathname;

  return (
    <li
      className="menu-item"
      onClick={props.handleClick}
      onMouseEnter={props.handleHover}
      onMouseLeave={props.handleLeaveHover}
    >
      <Link
        to={props.url}
        className={classNames({
          active: location === props.url,
          whitelink_header: props.whiteText === true,
        })}
      >
        {props.label}
      </Link>

      {dropdownHover === true && props.dropdownContent.length > 0 && (
        <Dropdown
          className="dropdown-display"
          dropdownContent={props.dropdownContent}
          label={props.label}
          scrolled={props.scrolled}
          handleLeaveHover={props.handleLeaveHover}
        />
      )}
    </li>
  );
}
export default withRouter(MenuItemDropdown);
