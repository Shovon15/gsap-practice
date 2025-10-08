"use client";
import Image from "next/image";
import React from "react";
import "./card.css";

const Page = () => {
  const columns = 3;
  const groupedData = [];
  for (let i = 0; i < TestData.length; i += columns) {
    groupedData.push(TestData.slice(i, i + columns));
  }
  console.log(groupedData, "groupedData");
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 -z-[2]">
      {TestData.map((item, index) => {
        const isLargeCard = (index - 4) % 5 === 0 && index >= 4;

        const col = index % 3;
        const row = Math.floor(index / 3);

        let borderClass = "border-red-500 ";

        if (row === 0 && col === 0) {
          borderClass += "border-t border-r border-b  ";
        } else {
          borderClass += " md:border-t border-r  border-b border-l ";
        }

        // if (row === 1) {
        //   borderClass += " md:border-l border-t-0";
        // }

        if (col === 0) borderClass += " border-l";
        if (col < 2) borderClass += " border-r ";

        if (row < Math.ceil(TestData.length / 3)) borderClass += " border-b";

        return (
          <Card
            key={index}
            item={item}
            isLargeCard={isLargeCard}
            borderClass={borderClass}
          />
        );
      })}
    </div>
  );
};

export default Page;

const Card = ({ item, isLargeCard = false, borderClass = "" }) => {
  return (
    <div
      className={`relative group ${
        isLargeCard
          ? "col-span-1 md:col-span-2 aspect-[6/3.5] md:p-[64px] p-3"
          : "aspect-[3/1.5] md:aspect-[3/2.5] lg:p-[64px] p-3"
      } ${borderClass}`}
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        className={`object-cover w-full h-full absolute top-0 left-0 -z-[1] ${
          isLargeCard ? "" : "hidden"
        }`}
      />
      <p
        className={`transition-colors duration-300 ease-in-out ${
          isLargeCard
            ? "text-[#FFFFFF] dark:text-[#F4F4F4] md:text-[20px] text-[18px] font-[500] md:font-semibold leading-[1.6] max-w-[300px] group-hover:text-[#FF4306]"
            : "text-[#414042] dark:text-[#F4F4F4] md:text-[20px] text-[18px] max-w-[300px] font-[500] md:font-semibold sm:text-[20px] leading-[150%] tracking-[0] capitalize group-hover:text-[#FF4306]"
        }`}
      >
        {item.title}
      </p>
    </div>
  );
};

const TestData = [
  {
    title: "test title",
    description: "lorem ipsum",
    image: "https://picsum.photos/200/300",
  },
  {
    title: "test title",
    description: "lorem ipsum",
    image: "https://picsum.photos/id/237/200/300",
  },
  {
    title: "test title",
    description: "lorem ipsum",
    image: "https://picsum.photos/id/235/200/300",
  },
  {
    title: "test title",
    description: "lorem ipsum",
    image: "https://picsum.photos/seed/picsum/200/300",
  },
  {
    title: "test title",
    description: "lorem ipsum",
    image: "https://picsum.photos/id/235/200/300",
  },
  {
    title: "test title",
    description: "lorem ipsum",
    image: "https://picsum.photos/id/235/200/300",
  },
  {
    title: "test title",
    description: "lorem ipsum",
    image: "https://picsum.photos/id/235/200/300",
  },
  {
    title: "test title",
    description: "lorem ipsum",
    image: "https://picsum.photos/id/235/200/300",
  },
  {
    title: "test title",
    description: "lorem ipsum",
    image: "https://picsum.photos/id/235/200/300",
  },
];
