import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function FaqPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: faqItems, isLoading } = useQuery<FaqItem[]>({
    queryKey: ["/api/faq"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="w-full px-4 py-6 sm:py-8 md:px-6">
        <div className="flex items-center mb-6 max-w-3xl mx-auto">
          <Link href="/">
            <Button variant="outline" size="sm" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about OTP King
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-16 animate-pulse bg-muted" />
              ))}
            </div>
          ) : faqItems && faqItems.length > 0 ? (
            <div className="space-y-3">
              {faqItems.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover-elevate transition-all"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  data-testid={`faq-item-${item.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-4">
                      <CardTitle className="text-base">{item.question}</CardTitle>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                          expandedId === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                  {expandedId === item.id && (
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No FAQ items available yet</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
