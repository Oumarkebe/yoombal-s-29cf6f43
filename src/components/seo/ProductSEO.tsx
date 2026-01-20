import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ProductSEOProps {
    title: string;
    description: string;
    image?: string;
    price?: number;
    currency?: string;
    url?: string;
}

export function ProductSEO({
    title,
    description,
    image,
    price,
    currency = 'XOF',
    url
}: ProductSEOProps) {
    const currentUrl = url || window.location.href;
    const siteName = 'Yoombal'; // Could be from env

    // Schema.org Product data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: title,
        description: description,
        image: image ? [image] : [],
        offers: price ? {
            '@type': 'Offer',
            price: price,
            priceCurrency: currency,
            availability: 'https://schema.org/InStock', // Dynamic if stock passed
        } : undefined,
    };

    return (
        <Helmet>
            {/* Standard tags */}
            <title>{title} | {siteName}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="product" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={currentUrl} />
            {image && <meta property="og:image" content={image} />}
            <meta property="og:site_name" content={siteName} />
            {price && <meta property="product:price:amount" content={price.toString()} />}
            {price && <meta property="product:price:currency" content={currency} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}

            {/* JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </script>
        </Helmet>
    );
}
