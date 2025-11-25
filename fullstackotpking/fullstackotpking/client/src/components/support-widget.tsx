import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, X, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function SupportWidget() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sendMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/support-messages", { subject, message });
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Our support team will get back to you soon",
      });
      setSubject("");
      setMessage("");
      setIsOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg hover-elevate flex items-center justify-center transition-all"
        data-testid="button-support-widget"
        aria-label="Open support chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] bg-background border rounded-lg shadow-2xl flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent text-white p-4 rounded-t-lg">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Support & Feedback
            </h3>
            <p className="text-xs opacity-90 mt-1">Send us your questions or complaints</p>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="space-y-1">
              <Label htmlFor="support-subject" className="text-xs">
                Subject
              </Label>
              <Input
                id="support-subject"
                placeholder="e.g., Account issue, Payment problem..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-sm"
                data-testid="input-support-subject"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="support-message" className="text-xs">
                Message
              </Label>
              <Textarea
                id="support-message"
                placeholder="Describe your issue..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="text-sm resize-none"
                data-testid="textarea-support-message"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4 bg-muted/30 rounded-b-lg">
            <Button
              onClick={() => sendMutation.mutate()}
              disabled={sendMutation.isPending || !subject.trim() || !message.trim()}
              className="w-full"
              size="sm"
              data-testid="button-send-support"
            >
              <Send className="w-4 h-4 mr-2" />
              {sendMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
