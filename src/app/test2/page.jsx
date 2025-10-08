`use client`;

import React from "react";

const page = () => {
  const arr = [1, 2, 3, 4, 5];
  const items = [arr, arr, arr, arr];
  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      {items.map((arr, index) => (
        <Grid
          key={arr}
          arr={[...arr]}
          containsBorderBottom={index === items.length - 1}
        />
      ))}
    </div>
  );
};

const Grid = ({ arr, containsBorderBottom = true }) => {
  return (
    <div className="w-[800px]">
      <div className="flex  w-full h-20">
        <Col
          item={arr[0]}
          className="border-b-0 border-r-0 flex justify-center items-center w-[50%]"
        />
        <Col
          item={arr[1]}
          className="border-b-0 border-r-0 flex justify-center items-center "
        />
        <Col
          item={arr[2]}
          className="border-b-0 flex justify-center items-center"
        />
      </div>
      <div className="flex  h-20">
        <Col
          item={arr[3]}
          className={`border-r-0 flex justify-center items-center w-[100px] ${
            containsBorderBottom ? "border-b" : "border-b-0"
          }`}
        />
        <Col
          item={"adfasd"}
          className={` flex justify-center items-center w-2/3 ${
            containsBorderBottom ? "border-b" : "border-b-0"
          }`}
        />
      </div>
    </div>
  );
};

const Col = ({ item, className }) => {
  return (
    <div className={`border-2 border-red-500 h-full w-full ${className}`}>
      {item}
    </div>
  );
};

export default page;
