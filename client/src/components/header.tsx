import { Bell, User, Smartphone, Gem, Wallet, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface UserType {
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

interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  isRead: boolean;
  isBroadcast: boolean;
  createdAt: string;
}

export function Header() {
  const [, setLocation] = useLocation();
  const { data: user } = useQuery<UserType>({ 
    queryKey: ["/api/auth/me"],
    retry: false,
  });
  const { data: notifications } = useQuery<Notification[]>({ 
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });

  const markReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return apiRequest("POST", `/api/notifications/${notificationId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/login");
    },
  });

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Mobile: Two-row layout / Desktop: Single row */}
      <div className="w-full px-4 py-3 sm:py-0 md:px-6">
        {/* Row 1: Logo, Profile, Theme Toggle */}
        <div className="flex items-center justify-between gap-2 min-h-14">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" data-testid="link-home">
            <div className="relative flex items-center gap-2">
              <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                OTP King
              </h1>
            </div>
          </Link>

          {/* Right: Profile, Theme Toggle */}
          <div className="flex items-center gap-1 sm:gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" data-testid="button-profile">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" data-testid="link-profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/history" data-testid="link-history">
                      History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm" data-testid="button-login">
                  Login
                </Button>
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Row 2: Credits, Wallet, Notifications (Mobile only) */}
        {user && (
          <div className="flex items-center justify-between gap-2 min-h-11 sm:hidden border-t mt-2 pt-2">
            {/* Left: Moderator Button */}
            {user.isModerator && (
              <Link href="/mod" className="flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-mod-dashboard">
                  <Shield className="h-4 w-4 text-primary" />
                </Button>
              </Link>
            )}

            {/* Center: Credits Badge */}
            <Link href="/wallet" className="flex-1 min-w-0">
              <Badge 
                variant="secondary" 
                className="w-full justify-center px-2 py-1 text-xs font-semibold bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 flex items-center gap-1 cursor-pointer hover-elevate"
                data-testid="badge-credits"
              >
                <Gem className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{user.credits ?? 0}</span>
              </Badge>
            </Link>

            {/* Right: Wallet + Notifications */}
            <Link href="/wallet" className="flex-shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-wallet">
                <Wallet className="h-4 w-4" />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8" data-testid="button-notifications">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 sm:w-80">
                {notifications && notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id} 
                      className="flex flex-col items-start gap-1 py-2 cursor-pointer text-xs"
                      onClick={() => handleNotificationClick(notification)}
                      data-testid={`notification-item-${notification.id}`}
                    >
                      <div className="font-semibold">{notification.title}</div>
                      <div className="text-[11px] text-muted-foreground">{notification.message}</div>
                      {!notification.isRead && (
                        <div className="mt-1 h-2 w-2 rounded-full bg-destructive" data-testid={`notification-unread-indicator-${notification.id}`}></div>
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled className="text-xs">No notifications</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Desktop Row: Credits, Wallet, Notifications (sm and up) */}
        {user && (
          <div className="hidden sm:flex items-center justify-between gap-2 min-h-14 border-t">
            {/* Left: Moderator */}
            {user.isModerator && (
              <Link href="/mod">
                <Button variant="ghost" size="icon" className="relative" data-testid="button-mod-dashboard">
                  <Shield className="h-5 w-5 text-primary" />
                </Button>
              </Link>
            )}

            {/* Center: Credits Badge */}
            <Link href="/wallet">
              <Badge 
                variant="secondary" 
                className="px-3 py-2 text-sm font-semibold bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 flex items-center gap-1.5 cursor-pointer hover-elevate"
                data-testid="badge-credits"
              >
                <Gem className="h-3.5 w-3.5" />
                {user.credits ?? 0} Credits
              </Badge>
            </Link>

            {/* Wallet */}
            <Link href="/wallet">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-wallet">
                <Wallet className="h-5 w-5" />
              </Button>
            </Link>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                {notifications && notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id} 
                      className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                      data-testid={`notification-item-${notification.id}`}
                    >
                      <div className="font-semibold text-sm">{notification.title}</div>
                      <div className="text-xs text-muted-foreground">{notification.message}</div>
                      {!notification.isRead && (
                        <div className="mt-1 h-2 w-2 rounded-full bg-destructive" data-testid={`notification-unread-indicator-${notification.id}`}></div>
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* SignUp button for non-logged-in users on desktop */}
        {!user && (
          <div className="hidden sm:flex items-center justify-end gap-2 min-h-14 border-t">
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90" data-testid="button-signup">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
