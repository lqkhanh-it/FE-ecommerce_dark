import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateFromHTML } from "draft-js-import-html";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { Table } from "@material-ui/core";

export default function DashboardSpecifications(props) {
  let html =
    "<p>Display: </p> <p>OS: </p> <p>Main Camera: </p> <p>Selfie Camera: </p> <p>CPU: </p> <p>Memory: </p> <p>Card Slot: </p> <p>SIM: </p> <p>Battery: </p> ";

  const contentBlock = htmlToDraft(html);

  const contentState = ContentState.createFromBlockArray(
    contentBlock.contentBlocks
  );
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(contentState)
  );

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    props.setNewsContent(
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
  };

  useEffect(() => {
    if (props.newsContent) {
      let contentState = stateFromHTML(props.newsContent);
      let test = EditorState.createWithContent(contentState);
      setEditorState(EditorState.moveFocusToEnd(test));
    }
  }, [props.newsContent]);

  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
      />
    </div>
  );
}
