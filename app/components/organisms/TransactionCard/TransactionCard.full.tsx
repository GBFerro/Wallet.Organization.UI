import { ThemedText } from "@components/atoms/ThemedText";
import {
    PAYMENT_METHOD_LABELS,
    Transaction,
    TRANSACTION_TYPE_LABELS,
    TransactionEnum,
} from "@constants/api";
import { BorderRadius, Spacing } from "@constants/theme";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { formatCurrency, formatDate } from "@utils/format";
import React, { createContext, useContext, useMemo } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

export interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
  children: React.ReactNode;
}

interface TransactionCardContextValue {
  transaction: Transaction;
  theme: ReturnType<typeof useTheme>["theme"];
  isIncome: boolean;
  isInvestment: boolean;
  amountColor: string;
  amountPrefix: string;
}

const TransactionCardContext = createContext<TransactionCardContextValue | null>(null);

const useTransactionCardContext = () => {
  const context = useContext(TransactionCardContext);
  if (!context) {
    throw new Error("TransactionCard compound components must be used within TransactionCard");
  }
  return context;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TransactionCardRoot({
  transaction,
  onPress,
  children,
}: Readonly<TransactionCardProps>) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const isIncome = transaction.type === TransactionEnum.Income;
  const isInvestment = transaction.type === TransactionEnum.Investment;
  const amountColor = isIncome || isInvestment ? theme.income : theme.expense;
  const amountPrefix = isIncome || isInvestment ? "+" : "-";

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    }
  };

  const contextValue: TransactionCardContextValue = useMemo(
    () => ({
      transaction,
      theme,
      isIncome,
      isInvestment,
      amountColor,
      amountPrefix,
    }),
    [transaction, theme, isIncome, isInvestment, amountColor, amountPrefix]
  );

  const Component = onPress ? AnimatedPressable : Animated.View;
  const pressProps = onPress
    ? { onPress, onPressIn: handlePressIn, onPressOut: handlePressOut }
    : {};

  return (
    <TransactionCardContext.Provider value={contextValue}>
      <Component
        {...pressProps}
        style={[
          styles.container,
          { backgroundColor: theme.backgroundDefault },
          onPress && animatedStyle,
        ]}
      >
        {children}
      </Component>
    </TransactionCardContext.Provider>
  );
}

export interface TransactionCardIconProps {
  size?: number;
}

function TransactionCardIcon({ size = 20 }: Readonly<TransactionCardIconProps>) {
  const { transaction, amountColor } = useTransactionCardContext();

  const getTypeIcon = (): keyof typeof Feather.glyphMap => {
    switch (transaction.type) {
      case TransactionEnum.Income:
        return "trending-up";
      case TransactionEnum.Expense:
        return "trending-down";
      case TransactionEnum.Investment:
        return "bar-chart-2";
      default:
        return "circle";
    }
  };

  return (
    <View style={[styles.iconContainer, { backgroundColor: amountColor + "20" }]}>
      <Feather name={getTypeIcon()} size={size} color={amountColor} />
    </View>
  );
}

export interface TransactionCardContentProps {
  children: React.ReactNode;
}

function TransactionCardContent({ children }: Readonly<TransactionCardContentProps>) {
  return <View style={styles.leftContent}>{children}</View>;
}

export interface TransactionCardDetailsProps {
  children?: React.ReactNode;
}

function TransactionCardDetails({ children }: Readonly<TransactionCardDetailsProps>) {
  const { transaction, theme } = useTransactionCardContext();

  return (
    <View style={styles.details}>
      <ThemedText type="body" numberOfLines={1}>
        {transaction.description || "Sem descricao"}
      </ThemedText>
      {children || (
        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText type="caption" style={{ color: theme.textSecondary, fontSize: 11 }}>
              {TRANSACTION_TYPE_LABELS[transaction.type]}
            </ThemedText>
          </View>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {PAYMENT_METHOD_LABELS[transaction.payment.method]}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

export interface TransactionCardAmountProps {
  style?: ViewStyle;
}

function TransactionCardAmount({ style }: Readonly<TransactionCardAmountProps>) {
  const { transaction, amountColor, amountPrefix } = useTransactionCardContext();

  return (
    <View style={[styles.rightContent, style]}>
      <ThemedText
        type="body"
        style={{ color: amountColor, fontWeight: "600" }}
      >
        {amountPrefix}
        {formatCurrency(transaction.payment.amount)}
      </ThemedText>
      <ThemedText type="caption" style={{ color: useTransactionCardContext().theme.textSecondary }}>
        {formatDate(transaction.date)}
      </ThemedText>
    </View>
  );
}

export interface TransactionCardActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}

function TransactionCardActions({
  onEdit,
  onDelete,
  children
}: Readonly<TransactionCardActionsProps>) {
  const { theme } = useTransactionCardContext();

  if (children) {
    return <View style={styles.actions}>{children}</View>;
  }

  return (
    <View style={styles.actions}>
      {onDelete && (
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { opacity: pressed ? 0.5 : 1 },
          ]}
          onPress={onDelete}
        >
          <Feather name="trash-2" size={18} color={theme.error} />
        </Pressable>
      )}
    </View>
  );
}

export interface TransactionCardMetaProps {
  children?: React.ReactNode;
}

function TransactionCardMeta({ children }: Readonly<TransactionCardMetaProps>) {
  const { transaction, theme } = useTransactionCardContext();

  if (children) {
    return <View style={styles.metaRow}>{children}</View>;
  }

  return (
    <View style={styles.metaRow}>
      <View style={[styles.badge, { backgroundColor: theme.backgroundSecondary }]}>
        <ThemedText type="caption" style={{ color: theme.textSecondary, fontSize: 11 }}>
          {TRANSACTION_TYPE_LABELS[transaction.type]}
        </ThemedText>
      </View>
      <ThemedText type="caption" style={{ color: theme.textSecondary }}>
        {PAYMENT_METHOD_LABELS[transaction.payment.method]}
      </ThemedText>
    </View>
  );
}

export const TransactionCard = Object.assign(TransactionCardRoot, {
  Icon: TransactionCardIcon,
  Content: TransactionCardContent,
  Details: TransactionCardDetails,
  Amount: TransactionCardAmount,
  Actions: TransactionCardActions,
  Meta: TransactionCardMeta,
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  leftContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  details: {
    flex: 1,
    gap: Spacing.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  rightContent: {
    alignItems: "flex-end",
    marginRight: Spacing.sm,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.sm,
  },
});
