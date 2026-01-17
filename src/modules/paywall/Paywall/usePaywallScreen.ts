import { useRouter } from "expo-router";

import { useSubscription } from "@/hooks/useSubscription";
import { useAppStore } from "@/stores/app.store";
import { capture } from "@/lib/posthog";

export const usePaywallScreen = () => {
  const router = useRouter();
  const { offerings, isPurchasing, purchase, restore } = useSubscription();
  const { setHasSeenPaywall } = useAppStore();

  const handleClose = () => {
    setHasSeenPaywall(true);
    capture("paywall_dismissed");
    router.back();
  };

  const handlePurchase = async (pkg: any) => {
    capture("purchase_initiated", { package: pkg.identifier });
    const result = await purchase(pkg);
    if (result.success) {
      capture("purchase_success", { package: pkg.identifier });
      router.back();
    }
  };

  const handleRestore = async () => {
    capture("restore_initiated");
    await restore();
  };

  return {
    offerings,
    isPurchasing,
    handleClose,
    handlePurchase,
    handleRestore,
  };
};
