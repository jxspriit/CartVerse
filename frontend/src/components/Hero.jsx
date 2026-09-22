import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const heroImages = [
  {
    image:
      "https://www.whatmobile.com.pk/control/news/assets/28072026/bfde0920b867293b208184614a02511e.jpg",
    alt: "Latest smartphone",
  },
  {
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80",
    alt: "Modern electronics",
  },
  {
    image:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80",
    alt: "Electronic gadgets",
  },
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImage((previousImage) =>
        previousImage === heroImages.length - 1 ? 0 : previousImage + 1
      );
    }, 1500);

    return () => clearInterval(imageTimer);
  }, []);

  return (
    <section className=" mt-11 bg-gradient-to-r from-blue-600 to-purple-600 px-4 pb-12 pt-28 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="text-center md:text-left">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-100">
              CartVerse Electronics
            </p>

            <h1 className="mb-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Latest Electronics
              <span className="block text-blue-100">At Best Prices.</span>
            </h1>

            <p className="mx-auto mb-7 max-w-xl text-base leading-7 text-blue-50 sm:text-lg md:mx-0">
              Get the latest gadgets and electronics at amazing prices. Shop
              now and enjoy exclusive deals.
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              <Link to="/products">
                <Button className="bg-white px-6 text-blue-600 hover:bg-gray-100">
                  Shop Now
                </Button>
              </Link>

              <Link to="/products">
                <Button
                  variant="outline"
                  className="border-white bg-transparent px-6 text-white hover:bg-white hover:text-blue-600"
                >
                  View Deals
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="overflow-hidden rounded-2xl bg-white/10 p-3 shadow-2xl">
              <img
                key={heroImages[currentImage].image}
                src={heroImages[currentImage].image}
                alt={heroImages[currentImage].alt}
                className="h-64 w-full animate-in fade-in duration-700 object-cover sm:h-80 md:h-96"
              />
            </div>

            <div className="mt-4 flex justify-center gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImage(index)}
                  aria-label={`Show image ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    currentImage === index
                      ? "w-7 bg-white"
                      : "w-2 bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;