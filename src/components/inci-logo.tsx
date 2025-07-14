
"use client";

const InciLogo = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full object-cover">
         <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#glow)">
            <path 
                d="M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 M50,18 A32,32 0 1,0 50,82 A32,32 0 1,0 50,18" 
                fill="url(#logoGradient)"
            />
            <path 
                d="M50,30 C66,30 75,40 75,50 C75,65 60,70 50,70 C35,70 25,60 25,50 C25,35 40,30 50,30 Z M50,38 C45,38 33,42 33,50 C33,58 42,62 50,62 C58,62 67,57 67,50 C67,43 55,38 50,38 Z" 
                fill="hsl(var(--background))"
            />
            <circle cx="50" cy="22" r="4" fill="hsl(var(--background))" />
        </g>
    </svg>
);

export default InciLogo;
