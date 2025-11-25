import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Trash2, Check } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SupportMessage {
  id: string;
  userId: string;
  senderType: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
}

export function SupportTab() {
  const { toast } = useToast();

  const { data: messages, refetch: refetchMessages } = useQuery<SupportMessage[]>({
    queryKey: ["/api/admin/support"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/admin/support", {});
        return response || [];
      } catch {
        return [];
      }
    },
  });

  const { data: usersMap } = useQuery<Record<string, User>>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/admin/users", {});
        const map: Record<string, User> = {};
        (response || []).forEach((user: User) => {
          map[user.id] = user;
        });
        return map;
      } catch {
        return {};
      }
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("PATCH", `/api/admin/support/${id}/read`, {});
    },
    onSuccess: () => {
      setTimeout(() => refetchMessages(), 100);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/support/${id}`, {});
    },
    onSuccess: () => {
      toast({ title: "Deleted", description: "Message removed" });
      setTimeout(() => refetchMessages(), 100);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Support Messages</h2>
        <p className="text-muted-foreground">User support requests and messages</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Recent Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 border rounded-lg space-y-2 ${!msg.isRead ? "bg-muted/50" : ""}`}
                  data-testid={`support-message-${msg.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {usersMap?.[msg.userId]?.username || `User ${msg.userId.slice(0, 8)}`}
                      </p>
                      <p className="text-sm mt-2">{msg.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!msg.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markReadMutation.mutate(msg.id)}
                          disabled={markReadMutation.isPending}
                          data-testid={`button-mark-read-${msg.id}`}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
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
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No support messages</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
