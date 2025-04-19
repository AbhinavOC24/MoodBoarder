import { Button } from "@repo/ui/button";
import { Github } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">Excalidraw Echo</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm hover:text-primary transition-colors"
          >
            Features
          </a>
          <a
            href="#about"
            className="text-sm hover:text-primary transition-colors"
          >
            About
          </a>
          <Button variant="outline" className="flex items-center gap-2">
            <Github size={20} />
            <span>GitHub</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
