import React, { useRef } from "react";
import UploadSvg from "../assets/img/upload.svg";
import "./style.css";
const Upload = (props) => {
  const { data, dispatch } = props;
  const refHiddenInput = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    //dispatch({ type: "SET_DROP_DEPTH" });
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "IS_IN_DROP_ZONE", inDropZone: false });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";

    dispatch({ type: "IS_IN_DROP_ZONE", inDropZone: true });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let files = e.dataTransfer
      ? [...e.dataTransfer.files]
      : [...e.target.files];

    if (files && files.length > 0) {
      const existingFiles = data.filesList.map((f) => f.name);
      files = files.filter((f) => !existingFiles.includes(f.name));

      dispatch({ type: "ADD_FILE_TO_LIST", files });
      dispatch({ type: "IS_IN_DROP_ZONE", inDropZone: false });
      props.setIsConfirm(true);
    }
  };

  return (
    <div className="containerUploader">
      <div
        className={
          data.inDropZone ? "containerDrop inside-drag-area" : "containerDrop"
        }
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragLeave={(e) => handleDragLeave(e)}
      >
        <img src={UploadSvg} alt="drag and drop" />

        <div
          style={{
            marginBottom: "32px",
          }}
        >
          <b>Drop your document here</b> or
          <input
            ref={refHiddenInput}
            type="file"
            name="filesMultiple"
            id="fileUpload"
            style={{ display: "none" }}
            aria-label="Carica documenti"
            multiple
            onChange={(e) => handleDrop(e)}
            onClick={(event) =>
              /** serve ad gestire una pulizia e conseguente caricamento dello stesso file */
              (event.target.value = "")
            }
          />
          <span
            onClick={(e) => {
              refHiddenInput.current.click();
            }}
            style={{ color: "#458DBD", fontSize: "20px", cursor: "pointer" }}
          >
            {" "}
            browse
          </span>
        </div>
      </div>
    </div>
  );
};

export default Upload;
