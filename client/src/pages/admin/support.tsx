import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send, CheckCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SupportMessage {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: "open" | "replied" | "closed";
  adminReply?: string;
  createdAt: string;
}

export function SupportTab() {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const { data: messages = [] } = useQuery<SupportMessage[]>({
    queryKey: ["/api/admin/support-messages"],
  });

  const replyMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("PATCH", `/api/admin/support-messages/${selectedId}`, {
        status: selectedStatus || "replied",
        adminReply: replyText,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/support-messages"] });
      toast({
        title: "Success",
        description: "Reply sent to user",
      });
      setReplyText("");
      setSelectedStatus("");
      setSelectedId(null);
    },
  });

  const selectedMessage = messages.find((m) => m.id === selectedId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">User Support Messages</h2>
        <p className="text-muted-foreground">View and reply to user inquiries and complaints</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Messages ({messages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No support messages yet</p>
                ) : (
                  messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => {
                        setSelectedId(msg.id);
                        setSelectedStatus(msg.status);
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedId === msg.id
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted border-muted"
                      }`}
                      data-testid={`button-support-message-${msg.id}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm truncate">{msg.subject}</p>
                          <p className="text-xs text-muted-foreground truncate">{msg.message.substring(0, 40)}</p>
                        </div>
                        {msg.status === "replied" && (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Message Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Subject</Label>
                    <p className="font-semibold">{selectedMessage.subject}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Message</Label>
                    <p className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded-lg">
                      {selectedMessage.message}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full" data-testid="select-message-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedMessage.adminReply && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Previous Reply</Label>
                      <p className="text-sm whitespace-pre-wrap bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-900">
                        {selectedMessage.adminReply}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Send Reply</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reply-text">Your Reply</Label>
                    <Textarea
                      id="reply-text"
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                      data-testid="textarea-support-reply"
                    />
                  </div>
                  <Button
                    onClick={() => replyMutation.mutate()}
                    disabled={replyMutation.isPending || !replyText.trim()}
                    className="w-full"
                    data-testid="button-send-reply"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {replyMutation.isPending ? "Sending..." : "Send Reply"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Select a message to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
