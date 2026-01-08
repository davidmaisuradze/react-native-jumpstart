import { Platform } from "react-native";
import Purchases, {
  LOG_LEVEL,
  PurchasesOffering,
  CustomerInfo,
  PurchasesPackage,
} from "react-native-purchases";

const API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS!;
const API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID!;

let isConfigured = false;

export const configureRevenueCat = async (userId?: string) => {
  if (isConfigured) return;

  const apiKey = Platform.OS === "ios" ? API_KEY_IOS : API_KEY_ANDROID;

  if (!apiKey) {
    console.warn("RevenueCat API key not configured");
    return;
  }

  Purchases.setLogLevel(LOG_LEVEL.DEBUG);

  await Purchases.configure({
    apiKey,
    appUserID: userId,
  });

  isConfigured = true;
};

export const identifyUser = async (userId: string) => {
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    return customerInfo;
  } catch (error) {
    console.error("Error identifying user:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // Check if user is anonymous - can't logout anonymous users
    const customerInfo = await Purchases.getCustomerInfo();
    const appUserId = await Purchases.getAppUserID();

    // Anonymous user IDs start with "$RCAnonymousID:"
    if (appUserId.startsWith("$RCAnonymousID:")) {
      // Already anonymous, no need to logout
      return customerInfo;
    }

    const newCustomerInfo = await Purchases.logOut();
    return newCustomerInfo;
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

export const getOfferings = async (): Promise<PurchasesOffering | null> => {
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
): Promise<CustomerInfo> => {
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

export const restorePurchases = async (): Promise<CustomerInfo> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error("Error restoring purchases:", error);
    throw error;
  }
};

export const getCustomerInfo = async (): Promise<CustomerInfo> => {
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
export const addCustomerInfoUpdateListener = (
  callback: (customerInfo: CustomerInfo) => void
) => {
  return Purchases.addCustomerInfoUpdateListener(callback);
};
