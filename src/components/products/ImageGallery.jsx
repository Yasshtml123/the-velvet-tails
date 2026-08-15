import { useState } from 'react';
import { optimizeCloudinaryUrl } from '@/utils/cloudinary.js'; // Adjust the import path as necessary

export default function ImageGallery({ images, activeIndex, onIndexChange }) {
    const [localIndex, setLocalIndex] = useState(0);

    const isControlled = activeIndex !== undefined && onIndexChange !== undefined;
    const selectedIndex = isControlled ? activeIndex : localIndex;
    const setSelectedIndex = isControlled ? onIndexChange : setLocalIndex;

    if (!images || images.length === 0) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No images available</p>
                </div>
            </div>
        );
    }

    const currentImageUrl = typeof images[selectedIndex] === 'string' 
        ? images[selectedIndex] 
        : images?.[selectedIndex]?.url || images?.[0]?.url;

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                    src={optimizeCloudinaryUrl(currentImageUrl, 800)}
                    alt={`Product image ${selectedIndex + 1}`}
                    className="h-full w-full object-cover object-center"
                    loading="eager"
                    decoding="async"
                    width="800"
                    height="800"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {images.map((image, index) => {
                        const imgUrl = typeof image === 'string' ? image : image?.url;
                        if (!imgUrl) return null;
                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedIndex(index)}
                                className={`relative aspect-w-1 aspect-h-1 overflow-hidden rounded-md ${
                                    selectedIndex === index
                                        ? 'ring-2 ring-velvet-purple'
                                        : 'ring-1 ring-gray-200 hover:ring-gray-300'
                                }`}
                            >
                                <img
                                    src={optimizeCloudinaryUrl(imgUrl, 150)}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="h-full w-full object-cover object-center"
                                    loading="lazy"
                                    decoding="async"
                                    width="150"
                                    height="150"
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}