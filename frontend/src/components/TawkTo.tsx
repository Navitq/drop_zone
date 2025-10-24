'use client';
import Script from 'next/script';

export default function TawkTo() {
    return (
        <Script
            id="tawkto"
            strategy="afterInteractive"
            src="https://embed.tawk.to/68faa189f3b89d194cff5d7c/1j89ge151"
        />
    );
}
