'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

export function NeuralPulseGrid() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const gridRef = useRef<HTMLDivElement>(null);

  const COLS = 20;
  const ROWS = 12;

  return (
    <div
      ref={gridRef}
      className="absolute inset-0 overflow-hidden pointer-events-auto"
      onMouseMove={(e) => {
        const rect = gridRef.current?.getBoundingClientRect();
        if (rect) {
          setMousePos({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
          });
        }
      }}
    >
      {Array.from({ length: ROWS }).map((_, row) =>
        Array.from({ length: COLS }).map((_, col) => {
          const distance = Math.sqrt(
            Math.pow((col / COLS) - mousePos.x, 2) +
            Math.pow((row / ROWS) - mousePos.y, 2)
          );

          return (
            <motion.div
              key={`${row}-${col}`}
              className="absolute w-1 h-1 rounded-full bg-primary/30"
              style={{
                left: `${(col / COLS) * 100}%`,
                top: `${(row / ROWS) * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 2,
                delay: distance * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })
      )}
    </div>
  );
}
