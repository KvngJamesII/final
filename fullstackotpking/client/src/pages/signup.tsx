import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gift, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ThemeToggle } from "@/components/theme-toggle";
import logoImage from "/otp-king-logo.png";

const signupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  password: z.string().min(1, "Password is required"),
  referralCode: z.string().optional().or(z.literal("")),
});

type SignupInput = z.infer<typeof signupSchema>;

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      referralCode: "",
    },
  });

  async function onSubmit(data: SignupInput) {
    try {
      setIsLoading(true);
      await apiRequest("POST", "/api/auth/signup", data);
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      toast({
        title: "Account created!",
        description: "Welcome to OTP King! You've received 100 credits.",
      });

      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="fixed top-10 left-5 w-48 h-48 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-10 right-5 w-48 h-48 md:w-80 md:h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 items-center justify-center px-4 py-8 sm:py-12 relative z-10">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img 
                src={logoImage} 
                alt="OTP King Logo" 
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg object-cover shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
                OTP King
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Create your account and get started instantly
              </p>
              {/* Free Credits Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-full text-xs sm:text-sm font-medium">
                <Gift className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-primary font-semibold">100 free credits!</span>
              </div>
            </div>
          </div>

          {/* Signup Form Card */}
          <Card className="border-0 sm:border shadow-sm sm:shadow-lg">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-xl sm:text-2xl">Sign Up</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Create account to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Choose a username" 
                            data-testid="input-username"
                            className="h-10 text-base"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="your@email.com"
                            data-testid="input-email"
                            className="h-10 text-base"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Create a strong password"
                              data-testid="input-password"
                              className="h-10 text-base pr-10"
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              data-testid="button-toggle-password"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="referralCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Referral Code (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter referral code"
                            data-testid="input-referral"
                            className="h-10 text-base"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Get bonus credits with a friend's referral code
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit" 
                    className="w-full h-10 text-base font-medium" 
                    disabled={isLoading}
                    data-testid="button-submit"
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </Form>

              <div className="mt-4 text-center text-sm">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Already have an account?{" "}
                  <Link 
                    href="/login" 
                    className="text-primary font-semibold hover:underline" 
                    data-testid="link-login"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="text-center text-xs text-muted-foreground px-4">
            <p>Get started instantly with 100 free credits on signup!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
