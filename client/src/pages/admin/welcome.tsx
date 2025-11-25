import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, MessageSquare } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WelcomeMessage {
  id: string;
  title: string;
  message: string;
  isActive: boolean;
}

export function WelcomeTab() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    isActive: true,
  });

  const { data: welcomeData } = useQuery<WelcomeMessage | null>({
    queryKey: ["/api/welcome-message"],
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/welcome-message", {
        title: formData.title || welcomeData?.title,
        message: formData.message || welcomeData?.message,
        isActive: formData.isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/welcome-message"] });
      toast({
        title: "Success",
        description: "Welcome message updated",
      });
    },
  });

  // Initialize form with existing data
  if (welcomeData && !formData.title) {
    setFormData({
      title: welcomeData.title,
      message: welcomeData.message,
      isActive: welcomeData.isActive,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome Message</h2>
        <p className="text-muted-foreground">Configure the welcome message for new users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Welcome Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="welcome-title">Title</Label>
            <Input
              id="welcome-title"
              placeholder="Welcome to OTP King..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              data-testid="input-welcome-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome-message">Message</Label>
            <Textarea
              id="welcome-message"
              placeholder="Enter the welcome message for new users..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              data-testid="textarea-welcome-message"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="welcome-active"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
              data-testid="checkbox-welcome-active"
            />
            <Label htmlFor="welcome-active" className="mb-0">
              Show welcome message to new users
            </Label>
          </div>

          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !formData.title || !formData.message}
            className="w-full"
            data-testid="button-save-welcome"
          >
            <Save className="mr-2 h-4 w-4" />
            {saveMutation.isPending ? "Saving..." : "Save Welcome Message"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.title && formData.message ? (
            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="font-semibold text-lg mb-2">{formData.title}</h3>
              <p className="text-sm whitespace-pre-wrap">{formData.message}</p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Fill in title and message to see preview</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
