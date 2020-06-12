import React, { useReducer } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import App from "./App";
global.window.URL.createObjectURL = function () {};

test("Should render drag&drop area without files box", () => {
  const { container } = render(<App />);
  const textDrop = screen.getByText(/Drop your document here/i);
  expect(textDrop.textContent).toBe("Drop your document here");

  const dragDropContainer = container.querySelector("div.containerDrop");
  expect(dragDropContainer).toBeInTheDocument();

  const droppedFiles = container.querySelector("div.dropped-files");
  expect(droppedFiles.firstChild).toBe(null);
  expect(droppedFiles.childNodes.length).toBe(0);
});

test("Should render drag&drop area with files box", () => {
  const { container } = render(<App />);
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

  const droppedFiles = container.querySelector("div.dropped-files");
  expect(droppedFiles.childNodes.length).toBe(4);
});

test("reducer", () => {
  let partsFile1 = [
    new Blob([""], { type: "image/png" }),
    " Same way as you do with blob",
    new Uint16Array([33]),
  ];

  let file1 = new File(partsFile1, "sample1.png", {
    lastModified: new Date(0), // optional - default = now
    type: "image/png", // optional - default = ''
  });

  const { result } = renderHook(() =>
    useReducer(App, { inDropZone: false, filesList: [file1] })
  );

  const [data, dispatch] = result.current;
  expect(data.filesList.length).toEqual(1);
});
/*
import React, { useReducer, useState } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import App from "./App";

test("should renders drag&drop div", async () => {
  const { result } = renderHook(() =>
    useReducer(App, { inDropZone: false, filesList: [] })
  );
  const [data, dispatch] = result.current;
  expect(data.inDropZone).toEqual(false);

  //act(() => {
  dispatch({ type: "IS_IN_DROP_ZONE", inDropZone: true });
  // });

  expect(data.inDropZone).toEqual(true);  
});*/
