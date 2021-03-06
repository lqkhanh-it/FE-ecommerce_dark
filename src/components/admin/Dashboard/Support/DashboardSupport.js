import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import DashboardProductTable from "./DashboardSupportTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function DashboardSupport(props) {
  const table = ["Name", "Email", "Subject", "Status", "Action"];

  return (
    <div className="dashboard-product">
      <div
        className={props.toast ? "toast toast-show" : "toast"}
        style={{ top: "20px" }}
      >
        <FontAwesomeIcon icon={faCheckCircle} className="icon" />
        Update products successfully
      </div>
      <DashboardProductTable
        icon={faEnvelope}
        title="Supports"
        color="lightblue"
        table={table}
        setOpenCreateFunc={props.setOpenCreateFunc}
        setCloseCreateFunc={props.setCloseCreateFunc}
        setOpenEditFunc={props.setOpenEditFunc}
        setCloseEditFunc={props.setCloseEditFunc}
        isChange={props.isChange}
      />
    </div>
  );
}
