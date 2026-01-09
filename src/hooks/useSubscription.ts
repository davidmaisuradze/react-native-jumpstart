import { useState, useEffect, useCallback } from "react";
import { CustomerInfo, PurchasesPackage } from "react-native-purchases";
import {
  getCustomerInfo,
  getOfferings,
  purchasePackage,
  restorePurchases,
  checkEntitlement,
  addCustomerInfoUpdateListener,
} from "@/lib/revenuecat";
import { useAppStore } from "@/stores/app.store";

// Default entitlement identifier - customize based on your RevenueCat setup
const PREMIUM_ENTITLEMENT = "premium";

export const useSubscription = () => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isPremium, setPremium } = useAppStore();

  // Fetch customer info and offerings on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch customer info
        const info = await getCustomerInfo();
        setCustomerInfo(info);

        // Check premium status
        const hasPremium = await checkEntitlement(PREMIUM_ENTITLEMENT);
        setPremium(hasPremium);

        // Fetch offerings
        const currentOffering = await getOfferings();
        if (currentOffering?.availablePackages) {
          setOfferings(currentOffering.availablePackages);
        }
      } catch (err: any) {
        console.error("Error fetching subscription data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Listen for customer info updates
    // RevenueCat returns an EmitterSubscription with .remove() method
    const subscription = addCustomerInfoUpdateListener((info) => {
      setCustomerInfo(info);
      const hasPremium = info.entitlements.active[PREMIUM_ENTITLEMENT]?.isActive ?? false;
      setPremium(hasPremium);
    });

    return () => {
      subscription.remove();
    };
  }, [setPremium]);

  const purchase = useCallback(
    async (pkg: PurchasesPackage) => {
      try {
        setIsPurchasing(true);
        setError(null);

        const info = await purchasePackage(pkg);
        setCustomerInfo(info);

        const hasPremium = info.entitlements.active[PREMIUM_ENTITLEMENT]?.isActive ?? false;
        setPremium(hasPremium);

        return { success: true, customerInfo: info };
      } catch (err: any) {
        const errorMessage =
          err.message === "Purchase cancelled"
            ? "Purchase was cancelled"
            : "Failed to complete purchase. Please try again.";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsPurchasing(false);
      }
    },
    [setPremium]
  );

  const restore = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const info = await restorePurchases();
      setCustomerInfo(info);

      const hasPremium = info.entitlements.active[PREMIUM_ENTITLEMENT]?.isActive ?? false;
      setPremium(hasPremium);

      if (!hasPremium) {
        return { success: false, message: "No previous purchases found" };
      }

      return { success: true, message: "Purchases restored successfully" };
    } catch (err: any) {
      setError("Failed to restore purchases");
      return { success: false, message: "Failed to restore purchases" };
    } finally {
      setIsLoading(false);
    }
  }, [setPremium]);

  const checkPremium = useCallback(async () => {
    const hasPremium = await checkEntitlement(PREMIUM_ENTITLEMENT);
    setPremium(hasPremium);
    return hasPremium;
  }, [setPremium]);

  return {
    customerInfo,
    offerings,
    isPremium,
    isLoading,
    isPurchasing,
    error,
    purchase,
    restore,
    checkPremium,
  };
};
