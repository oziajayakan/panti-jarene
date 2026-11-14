import { useEffect, useState } from 'react';

export default function IntroVideoOverlay({ onClose }) {
    const [isPortrait, setIsPortrait] = useState(
        typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false
    );

    useEffect(() => {
        const handleResize = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const videoSrc = isPortrait
        ? `${import.meta.env.BASE_URL}gallery/video/potrait.mp4`
        : `${import.meta.env.BASE_URL}gallery/video/lanskap.mp4`;

    return (
        <div className="fixed inset-0 z-[9999] w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
            <video
                key={videoSrc}
                src={videoSrc}
                autoPlay
                muted
                playsInline
                onEnded={onClose}
                className="w-full h-full object-cover"
            />
        </div>
    );
}
