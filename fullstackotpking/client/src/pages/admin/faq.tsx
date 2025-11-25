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

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export function FaqTab() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ question: "", answer: "", displayOrder: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: faqItems, refetch } = useQuery<FaqItem[]>({
    queryKey: ["/api/admin/faq"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/admin/faq", {});
        return (response || []).sort((a: FaqItem, b: FaqItem) => a.displayOrder - b.displayOrder);
      } catch {
        return [];
      }
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return await apiRequest("PUT", `/api/admin/faq/${editingId}`, formData);
      } else {
        return await apiRequest("POST", "/api/admin/faq", formData);
      }
    },
    onSuccess: () => {
      toast({
        title: editingId ? "Updated" : "Created",
        description: "FAQ item saved successfully",
      });
      setFormData({ question: "", answer: "", displayOrder: 0 });
      setEditingId(null);
      setTimeout(() => refetch(), 100);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/faq/${id}`, {});
    },
    onSuccess: () => {
      toast({ title: "Deleted", description: "FAQ item removed" });
      setTimeout(() => refetch(), 100);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await apiRequest("PATCH", `/api/admin/faq/${id}/toggle`, { isActive });
    },
    onSuccess: () => {
      setTimeout(() => refetch(), 100);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">FAQ</h2>
        <p className="text-muted-foreground">Manage frequently asked questions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit FAQ Item" : "Create FAQ Item"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              placeholder="FAQ question..."
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              data-testid="input-faq-question"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              placeholder="FAQ answer..."
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              rows={4}
              data-testid="textarea-faq-answer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              placeholder="0"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
              data-testid="input-faq-order"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !formData.question || !formData.answer}
              data-testid="button-save-faq"
            >
              <Plus className="mr-2 h-4 w-4" />
              {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ question: "", answer: "", displayOrder: 0 });
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
          <CardTitle>FAQ Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {faqItems && faqItems.length > 0 ? (
              faqItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-3 border rounded-lg"
                  data-testid={`faq-item-${item.id}`}
                >
                  <div className="flex-1 mr-4">
                    <p className="font-semibold text-sm">{item.question}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.answer}</p>
                    <p className="text-xs text-muted-foreground mt-1">Order: {item.displayOrder}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.isActive}
                        onCheckedChange={(checked) =>
                          toggleMutation.mutate({ id: item.id, isActive: checked })
                        }
                        data-testid={`switch-faq-${item.id}`}
                      />
                      <Label className="text-xs">Active</Label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(item.id);
                        setFormData({ question: item.question, answer: item.answer, displayOrder: item.displayOrder });
                      }}
                      data-testid={`button-edit-${item.id}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(item.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No FAQ items yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
