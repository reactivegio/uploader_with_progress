import React, { useReducer, useState } from "react";
import Upload from "./components/upload";
import CheckedSvg from "./assets/img/checked.svg";
import CloseSvg from "./assets/img/close.svg";
import FileSvg from "./assets/img/file.svg";
import { formatBytes } from "./utils/index";
import { uploadDocuments } from "./actions/upload";
import "./App.css";

function App() {
  const [isConfirm, setIsConfirm] = useState(false);

  const reducer = (state, action) => {
    switch (action.type) {
      case "IS_IN_DROP_ZONE":
        return { ...state, inDropZone: action.inDropZone };
      case "ADD_FILE_TO_LIST":
        return { ...state, filesList: state.filesList.concat(action.files) };
      case "REMOVE_FILE_TO_LIST":
        return {
          ...state,
          filesList: state.filesList.filter((el) => {
            return el.name !== action.toRemove.name;
          }),
        };
      case "CLEAR_FILES":
        return { inDropZone: false, filesList: [] };
      case "SINGLE_DOCUMENT_UPLOAD_START":
        let currentFile = state.filesList.find((el) => {
          return el.name === action.payload.fileName;
        });
        if (currentFile) currentFile.progress = action.payload.progress;
        return { ...state };
      default:
        return state;
    }
  };
  const [data, dispatch] = useReducer(reducer, {
    inDropZone: false,
    filesList: [],
  });

  const renderFooter = (props) => {
    return isConfirm ? (
      <div className="footer">
        <div
          className="btn secondary"
          onClick={(e) => {
            dispatch({ type: "CLEAR_FILES" });
          }}
        >
          Cancel
        </div>
        <div
          className="btn primary"
          onClick={(e) => uploadDocuments(data.filesList, dispatch)}
        >
          Confirm
        </div>
      </div>
    ) : null;
  };

  return (
    <div>
      <a
        href="https://github.com/reactivegio/uploader_with_progress"
        style={{ position: "fixed", top: 0, right: 0 }}
      >
        <img
          width="149"
          height="149"
          src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149"
          className="attachment-full size-full"
          alt="Fork me on GitHub"
          data-recalc-dims="1"
        />
      </a>
      <div className="titlePage">Upload file</div>
      <Upload data={data} dispatch={dispatch} setIsConfirm={setIsConfirm} />

      <div className="dropped-files">
        {data.filesList.map((f) => {
          const file = new Blob([f], { type: f.type });
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);

          return (
            <div key={f.name} className="fileContainer">
              <img
                src={fileURL}
                alt="file uploaded"
                style={{
                  width: "50px",
                  height: "50px",
                  verticalAlign: "middle",
                  marginRight: "16px",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FileSvg;
                }}
              />
              <div
                style={{
                  display: "inline-block",
                  verticalAlign: "middle",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "calc(100% - 66px)",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 600 }}>
                  {f.name}
                </span>
                <br />
                <span style={{ fontSize: "13px", color: "rgb(69, 141, 189)" }}>
                  {f.progress
                    ? formatBytes((f.size * f.progress) / 100, 2) +
                      " di " +
                      formatBytes(f.size, 2)
                    : formatBytes(f.size, 2)}
                </span>
              </div>
              {f.progress && f.progress === 100 ? (
                <div className="topIcon">
                  <img src={CheckedSvg} alt="close icon" />
                </div>
              ) : (
                <div
                  className="topIcon close"
                  onClick={(e) => {
                    dispatch({ type: "REMOVE_FILE_TO_LIST", toRemove: f });
                  }}
                >
                  <img src={CloseSvg} alt="close icon" />
                </div>
              )}
              <div className="progressBar ">
                <div
                  className="progressColored"
                  style={{
                    width: f.progress ? f.progress + "%" : 0,
                    backgroundImage:
                      "linear-gradient(274deg, #00c3ea, #0090d1)",
                    height: "100%",
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      {data.filesList.length > 0 ? renderFooter() : null}
    </div>
  );
}

export default App;
