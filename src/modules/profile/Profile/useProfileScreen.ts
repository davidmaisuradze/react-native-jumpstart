import { useRouter } from "expo-router";

import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

export const useProfileScreen = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { isPremium } = useSubscription();

  const navigateToPaywall = () => {
    router.push("/(modals)/paywall");
  };

  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : "N/A";

  const displayName = user?.email?.split("@")[0] || "User";

  return {
    user,
    isPremium,
    displayName,
    memberSince,
    navigateToPaywall,
    signOut,
  };
};
