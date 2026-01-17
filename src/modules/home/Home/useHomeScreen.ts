import { useRouter } from "expo-router";

import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

export const useHomeScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { isPremium } = useSubscription();

  const navigateToPaywall = () => {
    router.push("/(modals)/paywall");
  };

  return {
    user,
    isPremium,
    navigateToPaywall,
  };
};
