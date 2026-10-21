import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TypewriterSimpleProps {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function TypewriterSimple({
  words,
  className = "",
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 1500,
}: TypewriterSimpleProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const word = words[wordIndex];
    const speed = deleting ? deletingSpeed : typingSpeed;

    const timeout = setTimeout(() => {
      if (!deleting) {
        // Digitando
        const nextText = word.slice(0, text.length + 1);
        setText(nextText);

        if (nextText.length === word.length) {
          // Espera um pouco antes de começar a apagar
          setTimeout(() => setDeleting(true), pauseDuration);
        }
      } else {
        // Apagando
        const nextText = word.slice(0, text.length - 1);
        setText(nextText);

        if (nextText.length === 0) {
          setDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {text}
      <motion.span
        className="ml-0.5 inline-block h-[1em] w-[2px] bg-current"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      />
    </span>
  );
}