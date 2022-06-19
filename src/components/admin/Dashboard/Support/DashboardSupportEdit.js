import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import DashboardEditor from "../News/DashboardEditor";

export default function DashboardSupportEdit(props) {
  const createForm = useRef();

  const [Email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const email = props.support;
  useEffect(() => {
    if (email) {
      setEmail(email.email);
      setName(email.name);
      setSubject(email.subject);
      setContent(email.content);
      setStatus(email.status);
    }
  }, [email]);

  const onSubmit = (event) => {
    event.preventDefault();

    axios
      .post(`http://localhost:4000/support/update/${email._id}`, {
        status: status,
        name: name,
        content: content,
        subject: subject,
        email: Email,
        response: newsContent,
      })
      .then(() => {
        props.setCloseEditFunc(false);
        props.setToastFunc(true);
      });
  };

  return (
    <div className="DashboardProductInfo">
      <div className="create-box">
        <div className="create-box-title flex">
          <div className="create-box-title-text">Email infomation</div>
          <div
            className="create-box-title-close flex-center"
            onClick={() => {
              props.setCloseEditFunc(false);
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
        <form
          onSubmit={onSubmit}
          encType="multipart/form-data"
          ref={createForm}
        >
          <div className="create-box-row flex">
            <div className="dashboard-left flex">Name</div>
            <div className="dashboard-right">
              <input
                type="text"
                name="name"
                value={name || ""}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                required
              ></input>
            </div>
          </div>
          <div className="create-box-row flex">
            <div className="dashboard-left flex">Email</div>
            <div className="dashboard-right">
              <input
                type="text"
                name="email"
                value={Email || ""}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                required
              ></input>
            </div>
          </div>
          <div className="create-box-row flex">
            <div className="dashboard-left flex">Subject</div>
            <div className="dashboard-right">
              <input
                type="text"
                name="email"
                value={subject || ""}
                onChange={(event) => {
                  setSubject(event.target.value);
                }}
                required
              ></input>
            </div>
          </div>
          <div className="create-box-row flex">
            <div className="dashboard-left flex">Content</div>
            <div
              className="dashboard-right"
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          </div>

          <div className="create-box-row flex">
            <div className="dashboard-left flex">Response</div>
            <div className="dashboard-right">
              <DashboardEditor setNewsContent={setNewsContent} />
            </div>
          </div>
          <div className="create-box-row flex">
            <div className="dashboard-left flex">Status</div>
            <div className="dashboard-right">
              <select
                className="input"
                type="text"
                value={status || ""}
                onChange={(event) => {
                  setStatus(event.target.value);
                }}
                required
              >
                <option value="new">New</option>
                <option value="pending">Pending</option>
                <option value="solved">Solved</option>
              </select>
            </div>
          </div>
          <div className="flex-center" style={{ marginTop: "40px" }}>
            <button className="create-box-btn btn">Edit support</button>
          </div>
        </form>
      </div>
    </div>
  );
}
