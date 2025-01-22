interface CopyButtonProps {
  text: string;
  children?: React.ReactNode;
  onCopy?: () => void;
  title?: string;
}

export default function CopyButton({
  text,
  children,
  onCopy,
  title,
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
    <button title={title} onClick={handleCopy}>
      {children || 'Copy'}
    </button>
  );
}
