import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  email?: string;
  credits: number;
  referralCode: string;
  successfulReferrals: number;
  createdAt: string;
  isModerator: boolean;
  isAdmin: boolean;
}

export default function Profile() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const referralUrl = user?.referralCode 
    ? `${window.location.origin}/signup?ref=${user.referralCode}`
    : "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="w-full px-4 py-6 sm:py-8 md:px-6">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          {/* Profile Header */}
          <Card className="border-0 sm:border shadow-sm sm:shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  <AvatarFallback className="text-xl sm:text-2xl bg-primary text-primary-foreground font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold" data-testid="text-username">
                    {user?.username}
                  </h1>
                  {user?.email && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{user.email}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card className="border-0 sm:border shadow-sm sm:shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-xl sm:text-2xl font-bold font-mono" data-testid="text-credits">
                    {user?.credits ?? 0}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">Referrals</p>
                  <p className="text-xl sm:text-2xl font-bold" data-testid="text-referrals">
                    {user?.successfulReferrals ?? 0}
                  </p>
                </div>

                <div className="space-y-1 col-span-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">Member Since</p>
                  <p className="text-sm sm:text-base font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Section */}
          <Card className="border-0 sm:border shadow-sm sm:shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Referral Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Share your code and earn bonus credits when friends sign up!
              </p>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-xs sm:text-sm font-medium mb-2">Your Referral Code</p>
                  <div className="flex gap-2">
                    <div className="flex-1 p-2 sm:p-3 rounded-lg bg-muted font-mono text-sm sm:text-lg font-bold text-center break-all">
                      {user?.referralCode}
                    </div>
                    <Button
                      onClick={copyReferralCode}
                      size="icon"
                      variant="outline"
                      className="flex-shrink-0"
                      data-testid="button-copy-code"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-medium mb-2">Referral Link</p>
                  <div className="flex gap-2">
                    <div className="flex-1 p-2 sm:p-3 rounded-lg bg-muted text-xs sm:text-sm break-all line-clamp-2 sm:line-clamp-none">
                      {referralUrl}
                    </div>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(referralUrl);
                        toast({
                          title: "Copied!",
                          description: "Referral link copied",
                        });
                      }}
                      size="icon"
                      variant="outline"
                      className="flex-shrink-0"
                      data-testid="button-copy-link"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
