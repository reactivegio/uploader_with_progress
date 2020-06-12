import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Upload from "./upload";

test("allows you to undo and redo", () => {
  const { container } = render(
    <Upload
      data={{ filesList: [], inDropZone: true }}
      dispatch={() => {}}
      setIsConfirm={() => {}}
    />
  );
  const textDrop = screen.getByText(/Drop your document here/i);
  expect(textDrop.textContent).toBe("Drop your document here");

  const dragDropContainer = container.querySelector("div.containerDrop");
  expect(dragDropContainer).toBeInTheDocument();

  let partsFile1 = [
    new Blob([""], { type: "image/png" }),
    " Same way as you do with blob",
    new Uint16Array([33]),
  ];
  let partsFile2 = [
    new Blob([""], { type: "image/png" }),
    " Different way as you do with blob",
    new Uint16Array([33]),
  ];
  let partsFile3 = [
    new Blob([""], { type: "application/vnd.openxmlformats-officedocument" }),
    " Same way as you do with blob openOffice",
    new Uint16Array([33]),
  ];
  let partsFile4 = [
    new Blob([""], { type: "application/msoffice" }),
    " Different way as you do with blob msoffice",
    new Uint16Array([33]),
  ];

  // Construct a file
  let file1 = new File(partsFile1, "sample1.png", {
    lastModified: new Date(0), // optional - default = now
    type: "image/png", // optional - default = ''
  });

  let file2 = new File(partsFile2, "sample2.png", {
    lastModified: new Date(0), // optional - default = now
    type: "image/png", // optional - default = ''
  });

  // Construct a file
  let file3 = new File(partsFile3, "sample3.docx", {
    lastModified: new Date(0), // optional - default = now
    type: "application/vnd.openxmlformats-officedocument", // optional - default = ''
  });

  let file4 = new File(partsFile4, "sample4.xls", {
    lastModified: new Date(0), // optional - default = now
    type: "application/msoffice", // optional - default = ''
  });

  fireEvent.drop(dragDropContainer, {
    target: { files: [file1, file2, file3, file4], clearData: () => {} },
  });

  /*
  fireEvent.drop(dragDropContainer, {
    dataTransfer: {
      files: [file1, file2, file3, file4],
      clearData: () => {},
    },
  });*/
});
