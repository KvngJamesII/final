import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WelcomeMessage {
  id: string;
  title: string;
  message: string;
  isActive: boolean;
  createdAt: string;
}

export function WelcomeTab() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: welcomeMessages } = useQuery<WelcomeMessage[]>({
    queryKey: ["/api/admin/welcome"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/admin/welcome", {});
        return response || [];
      } catch {
        return [];
      }
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return await apiRequest("PUT", `/api/admin/welcome/${editingId}`, formData);
      } else {
        return await apiRequest("POST", "/api/admin/welcome", formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/welcome"] });
      toast({
        title: editingId ? "Updated" : "Created",
        description: "Welcome message saved successfully",
      });
      setFormData({ title: "", message: "" });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/welcome/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/welcome"] });
      toast({ title: "Deleted", description: "Welcome message removed" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await apiRequest("PATCH", `/api/admin/welcome/${id}/toggle`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/welcome"] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome Messages</h2>
        <p className="text-muted-foreground">Set welcome messages for new users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Welcome Message" : "Create Welcome Message"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Welcome title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              data-testid="input-welcome-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Welcome message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              data-testid="textarea-welcome-message"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !formData.title || !formData.message}
              data-testid="button-save-welcome"
            >
              <Plus className="mr-2 h-4 w-4" />
              {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: "", message: "" });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Welcome Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {welcomeMessages && welcomeMessages.length > 0 ? (
              welcomeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                  data-testid={`welcome-item-${msg.id}`}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{msg.title}</p>
                    <p className="text-sm text-muted-foreground">{msg.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={msg.isActive}
                        onCheckedChange={(checked) =>
                          toggleMutation.mutate({ id: msg.id, isActive: checked })
                        }
                        data-testid={`switch-welcome-${msg.id}`}
                      />
                      <Label className="text-xs">Active</Label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(msg.id);
                        setFormData({ title: msg.title, message: msg.message });
                      }}
                      data-testid={`button-edit-${msg.id}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(msg.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${msg.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No welcome messages yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
