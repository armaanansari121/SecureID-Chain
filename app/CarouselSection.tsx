"use client";
import { animated, useTransition } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import secure from "../public/secure.jpg";
import decentralized from "../public/decentralized.jpg";
import efficient from "../public/efficient.jpg";
import CarouselCard from "@/components/CarouselCard";

const CarouselSection: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const cards = [
    {
      title: "Secure",
      description: "Blockchain-powered security",
      content:
        "Our ID system leverages the immutability and cryptographic security of blockchain technology.",
      imageSrc: secure,
      imagePosition: "left" as const,
    },
    {
      title: "Decentralized",
      description: "No single point of failure",
      content:
        "Distributed ledger technology ensures your identity is not controlled by a single entity.",
      imageSrc: decentralized,
      imagePosition: "right" as const,
    },
    {
      title: "Efficient",
      description: "Quick and easy verification",
      content:
        "Instant identity verification without compromising on security or privacy.",
      imageSrc: efficient,
      imagePosition: "left" as const,
    },
  ];

  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        setCurrentCard((prev) => (prev + 1) % cards.length);
      }, 5000); // Change card every 5 seconds
      return () => clearInterval(interval);
    }
  }, [inView, cards.length]);

  const transitions = useTransition(currentCard, {
    from: { opacity: 0, transform: "translate3d(100%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(-50%,0,0)" },
  });

  return (
    <div
      ref={ref}
      className="min-h-screen w-full flex flex-col items-center justify-center py-16 relative px-4"
    >
      <div className="w-full max-w-6xl mx-auto relative h-64">
        {transitions((style, index) => (
          <animated.div style={style} className="absolute w-full">
            <CarouselCard {...cards[index]} />
          </animated.div>
        ))}
      </div>
      <div className="flex mt-6">
        {cards.map((_, index) => (
          <div
            key={index}
            className={`w-4 h-[1px] m-[1px] ${
              currentCard === index ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselSection;
