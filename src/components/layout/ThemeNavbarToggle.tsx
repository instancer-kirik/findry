
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function ThemeNavbarToggle() {
  return (
    <div className="relative mr-4 flex items-center justify-center">
      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative rounded-full p-1">
        <ThemeToggle />
      </div>
    </div>
  );
}
