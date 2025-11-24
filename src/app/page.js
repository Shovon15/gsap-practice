import Image from "next/image";
import Basic from "./components/Basic";
import TickerBox from "./components/TickerBox";
import GsapFromToExample from "./components/GsapFromToExample";
import Scroll from "./components/ScrollTrigger";
import SlideInSection from "./components/SlideInSection";
import PinnedSection from "./components/PinnedSection";
import TimelineScroll from "./components/TimelineScroll";
import StaggerList from "./components/StaggerList";
import SplitTextReveal from "./components/SplitText/SplitTextReveal";
import SplitTextWordsChars from "./components/SplitText/SplitTextWordsChars";
import ParallaxSection from "./components/parallax/ParallaxSection";
import Link from "next/link";

export default function Home() {
  const products = [
    {
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      heading: "Wireless Headphones",
      price: "$299.99",
    },
    {
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      heading: "Smart Watch",
      price: "$199.99",
    },
    {
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
      heading: "Sunglasses",
      price: "$89.99",
    },
  ];
  return (
    <div>
      <Link href="/about">
        <button className="border rounded-md px-4 py-2 m-4 cursor-pointer">
          about
        </button>
      </Link>
      {/* <p className="text-center text-[clamp(30px,3.125vw,60px)]">
        lorem imsum loler discover
      </p> */}
      <p className="text-center text-[calc(30/375*100vw)] md:text-[calc(40/768*100vw)] lg:text-[calc(60/1920*100vw)] border py-[2vw] px-[30vw]">
        lorem imsum loler discover
      </p>

      <div className="bg-green-200 h-[4400px]"></div>
      {/* <Basic />
      <TickerBox />
      <GsapFromToExample />

      <Scroll />

      <div className="min-h-[200vh] bg-gray-100 p-20">
        <SlideInSection direction="left">
          <h2 className="text-2xl font-bold">Slide In from Left</h2>
        </SlideInSection>

        <SlideInSection direction="right">
          <h2 className="text-2xl font-bold">Slide In from Right</h2>
        </SlideInSection>

        <SlideInSection direction="top">
          <h2 className="text-2xl font-bold">Slide In from Top</h2>
        </SlideInSection>

        <SlideInSection direction="bottom">
          <h2 className="text-2xl font-bold">Slide In from Bottom</h2>
        </SlideInSection>
      </div>

      <div>
        <div className="h-[100vh] bg-pink-200 flex justify-center items-center">
          Scroll down to pin!
        </div>

        <PinnedSection />

        <div className="h-[100vh] bg-green-200 flex justify-center items-center">
          Done pinning!
        </div>
      </div>

      <TimelineScroll />
      <StaggerList /> */}

      {/* <SplitTextReveal />
      <SplitTextWordsChars /> */}
      {/* <ParallaxSection />
      <div className="h-[2100px]"></div> */}

      {/* <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Product Collection
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              image={product.image}
              heading={product.heading}
              price={product.price}
            />
          ))}
        </div>
      </div>

      <div className="h-[500px] w-full border border-blue-500 relative overflow-hidden">
        <div className="bg-green-500 size-20 absolute inset-0 m-auto"></div>
      </div> */}
    </div>
  );
}

const ProductCard = ({ image, heading, price, alt = "Product image" }) => {
  return (
    <div className="product-card">
      <div className="image-container">
        <Image src={image} alt={alt} className="product-image" fill />
        <div className="hover-overlay"></div>
      </div>
      <div className="card-content">
        <h2 className="product-heading">{heading}</h2>
        <p className="product-price">{price}</p>
      </div>
    </div>
  );
};
