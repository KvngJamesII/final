import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SavedNumber {
  id: string;
  userId: string;
  countryId: string;
  phoneNumber: string;
  savedAt: string;
  country?: {
    id: string;
    name: string;
    code: string;
  };
}

export default function SavedNumbers() {
  const { toast } = useToast();

  const { data: savedNumbers, isLoading } = useQuery<SavedNumber[]>({
    queryKey: ["/api/saved-numbers"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/saved-numbers/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-numbers"] });
      toast({
        title: "Deleted",
        description: "Saved number removed",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="w-full px-4 py-6 sm:py-8 md:px-6">
        <div className="flex items-center mb-6 max-w-5xl mx-auto">
          <Link href="/">
            <Button variant="outline" size="sm" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Saved Numbers</h1>
            <p className="text-muted-foreground">Your saved virtual phone numbers</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-32 animate-pulse bg-muted" />
              ))}
            </div>
          ) : savedNumbers && savedNumbers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedNumbers.map((saved) => (
                <Link key={saved.id} href={`/country/${saved.countryId}`}>
                  <Card
                    className="p-6 cursor-pointer hover-elevate transition-all h-full"
                    data-testid={`card-saved-${saved.id}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">
                          {saved.country?.name || "Unknown Country"}
                        </p>
                        <p className="text-2xl font-mono font-bold text-primary mb-2">
                          {saved.phoneNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Saved {new Date(saved.savedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        data-testid={`button-open-${saved.id}`}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteMutation.mutate(saved.id);
                        }}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${saved.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-muted rounded-full">
                  <Phone className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
              <p className="text-muted-foreground mb-4">No saved numbers yet</p>
              <Link href="/">
                <Button data-testid="button-browse">Browse Countries</Button>
              </Link>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
