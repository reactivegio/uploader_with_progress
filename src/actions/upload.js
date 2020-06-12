import axios from "axios";

export const DOCUMENT_UPLOAD_START = "DOCUMENT_UPLOAD_START";
export const DOCUMENT_UPLOAD_ERROR = "DOCUMENT_UPLOAD_ERROR";
export const DOCUMENT_UPLOAD_SUCCESS = "DOCUMENT_UPLOAD_SUCCESS";
export const DOCUMENT_UPLOAD_RESET = "DOCUMENT_UPLOAD_RESET";

export const SINGLE_DOCUMENT_UPLOAD_SUCCESS = "SINGLE_DOCUMENT_UPLOAD_SUCCESS";
export const SINGLE_DOCUMENT_UPLOAD_START = "SINGLE_DOCUMENT_UPLOAD_START";
export const SINGLE_DOCUMENT_UPLOAD_ERROR = "SINGLE_DOCUMENT_UPLOAD_ERROR";

function getFileContent(file) {
  if (file.content && typeof file.content === "string") {
    return new Promise((resolve, reject) => {
      resolve(file.content);
    });
  } else {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          resolve(reader.result);
        },
        false
      );
      reader.readAsDataURL(file);
    });
  }
}

const myUploadProgress = (currentFile, dispatch) => (progressEvent) => {
  if (progressEvent.lengthComputable) {
    currentFile.uploadPercentage = parseInt(
      Math.round((progressEvent.loaded * 100) / progressEvent.total)
    );
    dispatch({
      type: SINGLE_DOCUMENT_UPLOAD_START,
      payload: {
        fileName: currentFile.name,
        progress: currentFile.uploadPercentage,
      },
    });
  }
};

export function uploadDocuments(files, dispatch) {
  // return function () {
  dispatch({
    type: DOCUMENT_UPLOAD_START,
  });

  let errorsUpload = 0;
  let promiseArray = files.map((file) => {
    return getFileContent(file).then((content) => {
      dispatch({
        type: SINGLE_DOCUMENT_UPLOAD_START,
        payload: { fileName: file.name },
      });
      const url = "/";
      let config = {};
      config["onUploadProgress"] = myUploadProgress(file, dispatch);
      config["onDownloadProgress"] = myUploadProgress(file, dispatch);
      return axios
        .post(
          url,
          {
            content: content,
            filename: file.name,
            size: file.size,
          },
          config
        )
        .then((result, error) => {
          if (result.status === 201 || result.status === 202) {
            dispatch({
              type: SINGLE_DOCUMENT_UPLOAD_SUCCESS,
              payload: {
                fileName: file.name,
                fileProgress: file.uploadPercentage,
              },
            });
          } else {
            errorsUpload++;
            dispatch({
              type: SINGLE_DOCUMENT_UPLOAD_ERROR,
              payload: {
                status: result.status,
                fileName: file.name,
                message:
                  "Si è verificato un errore durante caricamento del file",
              },
            });
          }
        })
        .catch((response) => {
          let statusMessage =
            file.size > 16000000
              ? "Dimensione del file troppo grande"
              : "Si è verificato un errore durante caricamento del file";
          errorsUpload++;
          dispatch({
            type: SINGLE_DOCUMENT_UPLOAD_ERROR,
            payload: {
              fileName: file.name,
              message: statusMessage,
              status: 500,
            },
          });
        });
    });
  });
  return axios.all(promiseArray).then((result) => {
    if (errorsUpload < 1) {
      dispatch({
        type: DOCUMENT_UPLOAD_SUCCESS,
      });
    } else {
      // mi servono i documenti totali e gli errori per visualizzare un warning (alcui doc caricati) o un errore(nessun doc caricato)
      dispatch({
        type: DOCUMENT_UPLOAD_ERROR,
        error: {
          numberFiles: files.length,
          errorFiles: errorsUpload,
        },
      });
    }
  });
  //};
}
