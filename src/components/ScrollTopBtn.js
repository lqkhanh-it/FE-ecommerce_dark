import React, { useContext, useEffect, useRef, useState } from "react";
import "../Styles/Scroll.css";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faPaperPlane,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router-dom";
import $ from "jquery";

function ScrollTopBtn(props) {
  const [onHover, setOnHover] = useState(false);
  const location = props.history.location.pathname;
  return (
    <div
      className={
        location === "/admin" ? "scroll-top-btn displayNone" : "scroll-top-btn"
      }
      onMouseEnter={() => {
        setOnHover(true);
      }}
      onMouseLeave={() => {
        setOnHover(false);
      }}
    >
      <div
        className={
          onHover
            ? "scroll-top-btn-container"
            : "scroll-top-btn-container-hover"
        }
        onClick={() => {
          $("html, body").animate({ scrollTop: 0 }, "300");
        }}
      >
        <FontAwesomeIcon icon={faArrowUp} className="icon" />
      </div>
    </div>
  );
}

export default withRouter(ScrollTopBtn);
