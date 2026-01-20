import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Zoom } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Play } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
    videoUrl?: string | null;
}

export function ProductImageGallery({
    images,
    productName,
    videoUrl,
}: ProductImageGalleryProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [showVideo, setShowVideo] = useState(false);

    // Fallback if no images
    const displayImages = images.length > 0 ? images : ['/placeholder.svg'];

    // Extract YouTube/Vimeo ID from URL
    const getVideoEmbedUrl = (url: string) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes('vimeo.com')) {
            const videoId = url.split('/').pop();
            return `https://player.vimeo.com/video/${videoId}`;
        }
        return url;
    };

    return (
        <div className="w-full space-y-4">
            {/* Main Swiper */}
            <Swiper
                style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                } as React.CSSProperties}
                spaceBetween={10}
                navigation={displayImages.length > 1}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                zoom={true}
                modules={[FreeMode, Navigation, Thumbs, Zoom]}
                className="rounded-xl overflow-hidden bg-gray-100 aspect-square"
            >
                {showVideo && videoUrl ? (
                    <SwiperSlide>
                        <div className="swiper-zoom-container h-full w-full">
                            <iframe
                                src={getVideoEmbedUrl(videoUrl)}
                                title={`${productName} video`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </SwiperSlide>
                ) : (
                    displayImages.map((image, index) => (
                        <SwiperSlide key={index}>
                            <div className="swiper-zoom-container h-full w-full flex items-center justify-center">
                                <img
                                    src={image}
                                    alt={`${productName} - Image ${index + 1}`}
                                    className="object-contain w-full h-full"
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                />
                            </div>
                        </SwiperSlide>
                    ))
                )}
            </Swiper>

            {/* Thumbnails Swiper */}
            {(displayImages.length > 1 || videoUrl) && (
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="rounded-lg"
                    breakpoints={{
                        640: { slidesPerView: 5 },
                        768: { slidesPerView: 6 },
                    }}
                >
                    {videoUrl && (
                        <SwiperSlide>
                            <button
                                onClick={() => setShowVideo(true)}
                                className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer bg-gray-900 flex items-center justify-center"
                            >
                                <Play className="h-8 w-8 text-white" />
                                <div className="absolute inset-0 bg-black/40" />
                            </button>
                        </SwiperSlide>
                    )}
                    {displayImages.map((image, index) => (
                        <SwiperSlide key={index}>
                            <button
                                onClick={() => setShowVideo(false)}
                                className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer"
                            >
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="object-cover w-full h-full"
                                    loading="lazy"
                                />
                            </button>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {/* Instructions */}
            <p className="text-sm text-muted-foreground text-center">
                Cliquez sur l'image pour zoomer · Glissez pour naviguer
            </p>
        </div>
    );
}
