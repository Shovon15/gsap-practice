// import { cn } from "@/utils/cn.js";
import { cn } from "@/utils/cn";
import React from "react";
// import { cn } from "@/lib/utils"; // optional utility for class merging

// type Props = {
//   border?: "red" | "white";
//   size?: "lg" | "sm";
//   icon?: React.ReactNode;
//   iconPosition?: "left" | "right";
//   textPosition?: "left" | "right";
//   bgColor?: "red" | "green";
//   children?: React.ReactNode;
//   onClick?: () => void;
//   className?: string;
// };
// : React.FC<Props>

const PrimaryButton = ({
  border = "white",
  size = "lg",
  icon,
  iconPosition = "left",
  textPosition = "left",
  bgColor = "red",
  children,
  onClick,
  className,
}) => {
  // dynamic styles
  const sizeClasses = {
    lg: "py-4 px-4 text-lg rounded-[20px] ",
    sm: "py-3 px-2 text-sm rounded-[15px] ",
  };

  const borderClasses = {
    red: "border-red-500",
    white: "border-white",
  };

  const bgClasses = {
    red: "bg-red-500",
    green: "bg-green-500",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "border-[3px] flex items-center gap-2 font-semibold min-w-[10vw] cursor-pointer",
        "transition-all duration-150", // smooth animation
        "active:scale-95 active:opacity-80", // click effect
        "hover:scale-[1.02]", // subtle hover effect
        sizeClasses[size],
        borderClasses[border],
        bgClasses[bgColor],
        textPosition === "right" ? "justify-end" : "justify-start",
        className,
      )}
    >
      {/* Icon Left */}
      {icon && iconPosition === "left" && <span>{icon}</span>}

      {/* Text */}
      <span>{children}</span>

      {/* Icon Right */}
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
};

export default PrimaryButton;
