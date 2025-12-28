'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function ConstellationConnect() {
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    const initial: Node[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
    }));
    setNodes(initial);

    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        x: ((node.x + node.vx) % 100 + 100) % 100,
        y: ((node.y + node.vy) % 100 + 100) % 100,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const connections = nodes.flatMap((a, i) =>
    nodes.slice(i + 1).filter(b => {
      const dist = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
      return dist < 25;
    }).map(b => ({ from: a, to: b, dist: Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)) }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full">
        {connections.map(({ from, to, dist }, i) => (
          <motion.line
            key={`line-${i}`}
            x1={`${from.x}%`}
            y1={`${from.y}%`}
            x2={`${to.x}%`}
            y2={`${to.y}%`}
            stroke="currentColor"
            className="text-primary"
            strokeOpacity={0.15 * (1 - dist / 25)}
            strokeWidth={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          />
        ))}
      </svg>

      {nodes.map(node => (
        <motion.div
          key={node.id}
          className="absolute w-2 h-2 rounded-full bg-primary/40"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            delay: node.id * 0.2,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}
