import Image, { StaticImageData } from "next/image";

const CarouselCard: React.FC<{
  title: string;
  description: string;
  content: string;
  imageSrc: StaticImageData;
  imagePosition: "left" | "right";
}> = ({ title, description, content, imageSrc, imagePosition }) => (
  <div className="flex bg-white bg-opacity-10 backdrop-blur-md rounded-lg overflow-hidden w-full max-w-6xl mx-auto h-64">
    {imagePosition === "left" && (
      <div className="w-1/3">
        <Image
          src={imageSrc}
          alt={title}
          width={300}
          height={256}
          className="object-cover w-full h-full"
        />
      </div>
    )}
    <div className="flex flex-col justify-center p-6 flex-1">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-lg text-gray-200 mb-2">{description}</p>
      <p className="text-white">{content}</p>
    </div>
    {imagePosition === "right" && (
      <div className="w-1/3">
        <Image
          src={imageSrc}
          alt={title}
          width={300}
          height={256}
          className="object-cover w-full h-full"
        />
      </div>
    )}
  </div>
);

export default CarouselCard;
