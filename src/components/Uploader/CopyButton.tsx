interface CopyButtonProps {
  text: string;
  children?: React.ReactNode;
  onCopy?: () => void;
}

export default function CopyButton({
  text,
  children,
  onCopy,
}: CopyButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      onCopy?.();
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button title={text} onClick={handleCopy}>
      {children || 'Copy'}
    </button>
  );
}
