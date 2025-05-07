
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface EmojiButtonProps {
  emoji: string;
  label: string;
  selected?: boolean;
  onClick: () => void;
}

const EmojiButton = ({ emoji, label, selected = false, onClick }: EmojiButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200",
        selected 
          ? "bg-bloomwell-purple/20 ring-2 ring-bloomwell-purple" 
          : "hover:bg-bloomwell-purple/10"
      )}
      onClick={onClick}
      aria-label={label}
    >
      <span className="text-3xl mb-1">{emoji}</span>
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  );
};

export default EmojiButton;
