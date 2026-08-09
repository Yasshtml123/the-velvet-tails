import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/formatters.js";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary.js";

export default function FeaturedProducts({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);
  const scrollRef = useRef(null);

  // Get featured products (first 6 only)
  const featuredProducts = products.slice(0, 6);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1); // Mobile: 1 item
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2); // Tablet: 2 items
      } else {
        setItemsPerView(3); // Desktop: 3 items
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset current index when itemsPerView changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerView]);

  useEffect(() => {
    if (!isAutoPlaying || featuredProducts.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev >= featuredProducts.length - itemsPerView ? 0 : prev + 1,
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, featuredProducts.length, itemsPerView]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) =>
      prev === 0
        ? Math.max(0, featuredProducts.length - itemsPerView)
        : prev - 1,
    );
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) =>
      prev >= featuredProducts.length - itemsPerView ? 0 : prev + 1,
    );
  };

  if (featuredProducts.length === 0) return null;

  // Calculate card width based on items per view
  const cardWidth = 100 / itemsPerView;

  return (
    <div className="py-12 bg-gradient-to-b from-purple-100 via-purple-50 to-violet-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 relative">
          {/* Decorative star icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-velvet-golden to-amber-500 rounded-full mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-velvet-purple via-purple-600 to-velvet-purple bg-clip-text text-transparent mb-3">
            Featured Products
          </h2>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-velvet-purple"></div>
            <div className="w-2 h-2 bg-velvet-purple rounded-full"></div>
            <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-velvet-purple"></div>
          </div>

          <p className="text-lg text-gray-600">
            Handpicked favorites for your furry friends
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative px-8 sm:px-12">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-velvet-purple hover:text-white p-2 sm:p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
            aria-label="Previous products"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-velvet-purple hover:text-white p-2 sm:p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
            aria-label="Next products"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Products Carousel */}
          <div className="overflow-hidden">
            <div
              ref={scrollRef}
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * cardWidth}%)`,
              }}
            >
              {featuredProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex-shrink-0 px-2 sm:px-3"
                  style={{ width: `${cardWidth}%` }}
                >
                  <Link
                    to={`/products/${product._id}`}
                    className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-[0_25px_50px_-12px_rgba(107,51,129,0.35)] hover:ring-2 hover:ring-velvet-purple/30 transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] group"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 sm:h-56 md:h-64 bg-gray-100 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={optimizeCloudinaryUrl(
                            product.images[0].url || product.images[0],
                            500,
                          )}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                          width="500"
                          height="500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          No Image
                        </div>
                      )}
                      {product.inventory === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 sm:p-5">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-velvet-purple transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="text-xl sm:text-2xl font-bold text-velvet-purple">
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice &&
                          product.compareAtPrice > product.price && (
                            <span className="text-xs sm:text-sm text-gray-500 line-through">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({
              length: Math.max(1, featuredProducts.length - itemsPerView + 1),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index
                    ? "bg-velvet-purple w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
