import { useMemo } from 'react';

/**
 * Animated paw prints walking across the background
 * Usage: <PawBackground /> - place behind content
 */
export default function PawBackground({ opacity = 0.03, count = 15 }) {
    // Generate random paw positions and delays
    const paws = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 20,
            duration: 15 + Math.random() * 15,
            size: 20 + Math.random() * 30,
            rotation: Math.random() * 360
        }));
    }, [count]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
            {paws.map((paw) => (
                <div
                    key={paw.id}
                    className="absolute animate-paw-walk"
                    style={{
                        left: `${paw.left}%`,
                        animationDuration: `${paw.duration}s`,
                        animationDelay: `${paw.delay}s`,
                        opacity: opacity,
                    }}
                >
                    {/* Paw Print SVG */}
                    <svg
                        width={paw.size}
                        height={paw.size}
                        viewBox="0 0 100 100"
                        style={{ transform: `rotate(${paw.rotation}deg)` }}
                        className="text-velvet-purple"
                    >
                        {/* Main pad */}
                        <ellipse cx="50" cy="65" rx="25" ry="22" fill="currentColor" />
                        {/* Toe pads */}
                        <ellipse cx="28" cy="35" rx="12" ry="14" fill="currentColor" />
                        <ellipse cx="50" cy="25" rx="12" ry="14" fill="currentColor" />
                        <ellipse cx="72" cy="35" rx="12" ry="14" fill="currentColor" />
                    </svg>
                </div>
            ))}

            {/* CSS Animation */}
            <style>{`
        @keyframes paw-walk {
          0% {
            transform: translateY(100vh) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(15deg) scale(1);
            opacity: 0;
          }
        }
        
        .animate-paw-walk {
          animation: paw-walk linear infinite;
        }
      `}</style>
        </div>
    );
}
