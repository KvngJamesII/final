import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ThemeToggle } from "@/components/theme-toggle";
import logoImage from "/otp-king-logo.png";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    try {
      setIsLoading(true);
      const result = await apiRequest<{ isAdmin: boolean }>("POST", "/api/auth/login", data);
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });

      if (result.isAdmin) {
        setLocation("/admin");
      } else {
        setLocation("/");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
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
              <p className="text-sm sm:text-base text-muted-foreground">
                Welcome back! Login to access your account.
              </p>
            </div>
          </div>

          {/* Login Form Card */}
          <Card className="border-0 sm:border shadow-sm sm:shadow-lg">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-xl sm:text-2xl">Login</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Enter your credentials to continue
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
                            placeholder="Enter your username" 
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter your password"
                            data-testid="input-password"
                            className="h-10 text-base"
                            {...field} 
                          />
                        </FormControl>
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
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>

              <div className="mt-4 text-center text-sm">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Don't have an account?{" "}
                  <Link 
                    href="/signup" 
                    className="text-primary font-semibold hover:underline" 
                    data-testid="link-signup"
                  >
                    Sign up now
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="text-center text-xs text-muted-foreground px-4">
            <p>Free virtual numbers. 5 credits charged only when SMS received.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
