import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface WelcomeMessage {
  id: string;
  title: string;
  message: string;
  isActive: boolean;
}

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: welcomeData } = useQuery<WelcomeMessage | null>({
    queryKey: ["/api/welcome-message"],
  });

  useEffect(() => {
    if (welcomeData && welcomeData.isActive) {
      // Check if user has already seen the welcome
      const hasSeenWelcome = localStorage.getItem("welcome-seen");
      if (!hasSeenWelcome) {
        setIsOpen(true);
        localStorage.setItem("welcome-seen", "true");
      }
    }
  }, [welcomeData]);

  if (!isOpen || !welcomeData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background border rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-accent to-secondary p-6 text-white relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
            data-testid="button-close-welcome"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">{welcomeData.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
            {welcomeData.message}
          </p>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-muted/30 flex justify-end">
          <Button
            onClick={() => setIsOpen(false)}
            className="bg-gradient-to-r from-primary to-accent"
            data-testid="button-dismiss-welcome"
          >
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
}
