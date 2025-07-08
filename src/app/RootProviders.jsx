import SmoothScroll from "./components/SmoothScroll";

const RootProviders = ({ children }) => {
  return (
    <>
      <SmoothScroll>{children}</SmoothScroll>
    </>
  );
};

export default RootProviders;
