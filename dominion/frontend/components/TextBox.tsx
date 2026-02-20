export default function TextBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`pkmn-textbox ${className || ''}`}>
      {children}
    </div>
  );
}
