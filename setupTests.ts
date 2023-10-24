import React from "react";
import { render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';

const setup = () => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  return {
    render,
    fireEvent,
  };
};

export default setup;