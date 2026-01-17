import { Platform } from "react-native";
import Purchases, {
  LOG_LEVEL,
  PurchasesOffering,
  CustomerInfo,
  PurchasesPackage,
} from "react-native-purchases";

const API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS;
const API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID;

let isConfigured = false;
let configPromise: Promise<void> | null = null;

export const isRevenueCatConfigured = () => isConfigured;

export const configureRevenueCat = async (userId?: string) => {
  // Return existing promise if already configuring/configured
  if (configPromise) return configPromise;

  configPromise = (async () => {
    if (isConfigured) return;

    const apiKey = Platform.OS === "ios" ? API_KEY_IOS : API_KEY_ANDROID;

    if (!apiKey) {
      console.log("RevenueCat: Skipping - API key not configured");
      return;
    }

    // Only enable verbose logging in development
    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);

    await Purchases.configure({
      apiKey,
      appUserID: userId,
    });

    isConfigured = true;
  })();

  return configPromise;
};

// Wait for RevenueCat to be configured before performing operations
const waitForConfig = async () => {
  if (configPromise) {
    await configPromise;
  }
};

export const identifyUser = async (userId: string) => {
  await waitForConfig();

  if (!isConfigured) {
    return null;
  }

  try {
    const { customerInfo } = await Purchases.logIn(userId);
    return customerInfo;
  } catch (error) {
    console.error("Error identifying user:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  // RevenueCat recommends NOT calling logOut() on the SDK.
  // When a new user logs in, logIn(newUserId) will switch users.
  // Calling logOut() creates race condition issues and throws errors
  // when the user is already anonymous.
  // See: https://www.revenuecat.com/docs/customers/identifying-customers
  console.debug("RevenueCat: Skipping logout (will identify on next login)");
  return null;
};

export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  await waitForConfig();

  if (!isConfigured) {
    return null;
  }

  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    console.error("Error fetching offerings:", error);
    throw error;
  }
};

export const purchasePackage = async (
  pkg: PurchasesPackage
): Promise<CustomerInfo | null> => {
  if (!isConfigured) {
    throw new Error("RevenueCat not configured");
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  } catch (error: any) {
    if (error.userCancelled) {
      throw new Error("Purchase cancelled");
    }
    console.error("Error purchasing package:", error);
    throw error;
  }
};

export const restorePurchases = async (): Promise<CustomerInfo | null> => {
  if (!isConfigured) {
    return null;
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error("Error restoring purchases:", error);
    throw error;
  }
};

export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  await waitForConfig();

  if (!isConfigured) {
    return null;
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error("Error getting customer info:", error);
    throw error;
  }
};

export const checkEntitlement = async (
  entitlementId: string
): Promise<boolean> => {
  await waitForConfig();

  if (!isConfigured) {
    return false;
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return (
      customerInfo.entitlements.active[entitlementId]?.isActive ?? false
    );
  } catch (error) {
    console.error("Error checking entitlement:", error);
    return false;
  }
};

// Subscription listener
// Note: RevenueCat SDK's listener returns void in newer versions
// We wrap it to provide a consistent cleanup interface
export const addCustomerInfoUpdateListener = (
  callback: (customerInfo: CustomerInfo) => void
): { remove: () => void } => {
  if (!isConfigured) {
    // Return no-op if not configured
    return { remove: () => {} };
  }

  // Cast to unknown first to handle the void return type safely
  const result = Purchases.addCustomerInfoUpdateListener(callback) as unknown;

  // Return an object with remove method for cleanup
  return {
    remove: () => {
      // Handle case where SDK returns an EmitterSubscription with remove method
      if (result && typeof result === "object" && "remove" in result) {
        (result as { remove: () => void }).remove();
      }
    },
  };
};
