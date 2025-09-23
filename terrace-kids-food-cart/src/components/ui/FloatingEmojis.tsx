'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { emojiCategories } from '@/lib/theme';

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
  y: number;
  delay: number;
}

interface FloatingEmojisProps {
  category?: keyof typeof emojiCategories;
  count?: number;
  duration?: number;
  className?: string;
}

const FloatingEmojis: React.FC<FloatingEmojisProps> = ({
  category = 'celebration',
  count = 6,
  duration = 10000,
  className = '',
}) => {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);

  useEffect(() => {
    const generateEmojis = () => {
      const emojiList = emojiCategories[category];
      const newEmojis: FloatingEmoji[] = [];

      for (let i = 0; i < count; i++) {
        newEmojis.push({
          id: `emoji-${i}-${Date.now()}`,
          emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 2,
        });
      }

      setEmojis(newEmojis);
    };

    generateEmojis();
    const interval = setInterval(generateEmojis, duration);

    return () => clearInterval(interval);
  }, [category, count, duration]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`} style={{ zIndex: 1 }}>
      <AnimatePresence>
        {emojis.map((emoji) => (
          <motion.div
            key={emoji.id}
            className="absolute text-2xl"
            initial={{
              opacity: 0,
              scale: 0,
              x: `${emoji.x}vw`,
              y: `${emoji.y}vh`,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1.2, 1, 0.8],
              y: [`${emoji.y}vh`, `${emoji.y - 20}vh`, `${emoji.y - 40}vh`],
              rotate: [0, 180, 360],
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 4,
              delay: emoji.delay,
              ease: [0.4, 0.0, 0.2, 1],
              times: [0, 0.2, 0.8, 1],
            }}
            style={{
              left: 0,
              top: 0,
            }}
          >
            {emoji.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingEmojis;