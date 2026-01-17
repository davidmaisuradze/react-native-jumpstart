export const styles = {
  container: "flex-1 bg-secondary-50 dark:bg-secondary-950",
  content: "p-6",
  profileHeader: "items-center mb-6",
  avatarContainer: "mb-4 h-24 w-24 items-center justify-center rounded-full bg-primary-100",
  userName: "text-xl font-bold text-secondary-900 dark:text-white",
  userEmail: "text-secondary-500",
  subscriptionBadge: "mt-3 rounded-full px-4 py-1",
  subscriptionBadgePremium: "bg-primary-100",
  subscriptionBadgeFree: "bg-secondary-200 dark:bg-secondary-700",
  subscriptionBadgeTextPremium: "text-sm font-medium text-primary-600",
  subscriptionBadgeTextFree: "text-sm font-medium text-secondary-600 dark:text-secondary-300",
  upgradeCard: "mb-6",
  upgradeCardContent: "items-center",
  upgradeCardTitle: "mt-2 text-lg font-semibold text-secondary-900 dark:text-white",
  upgradeCardSubtitle: "mt-1 text-center text-sm text-secondary-500",
  upgradeButton: "mt-4",
  sectionTitle: "mb-3 text-lg font-semibold text-secondary-900 dark:text-white",
  accountCard: "mb-6",
  accountRow: "flex-row items-center justify-between",
  accountRowLeft: "flex-row items-center",
  accountRowLabel: "ml-3 text-secondary-700 dark:text-secondary-300",
  accountRowValue: "text-secondary-500",
  divider: "h-px bg-secondary-200 dark:bg-secondary-700",
  accountRows: "gap-4",
} as const;

export const iconColor = "#64748b";
export const avatarIconColor = "#3b82f6";
