import { ThemedText } from "@components/atoms/ThemedText";
import { Projection } from "@constants/api";
import { BorderRadius, Spacing } from "@constants/theme";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { formatCurrency, formatDate } from "@utils/format";
import React, { createContext, useContext, useState } from "react";
import {
    LayoutAnimation,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    UIManager,
    View
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface MonthData {
  month: string;
  year: number;
  monthIndex: number;
  projections: Projection[];
  totalIncome: number;
  totalExpenses: number;
  finalBalance: number;
}

export interface MonthCardProps {
  monthData: MonthData;
  children: React.ReactNode;
}

interface MonthCardContextValue {
  monthData: MonthData;
  theme: ReturnType<typeof useTheme>["theme"];
  expanded: boolean;
  toggleExpand: () => void;
  selectedDay: Projection | null;
  setSelectedDay: (day: Projection | null) => void;
  projectionMap: Map<number, Projection>;
}

const MonthCardContext = createContext<MonthCardContextValue | null>(null);

const useMonthCardContext = () => {
  const context = useContext(MonthCardContext);
  if (!context) {
    throw new Error("MonthCard compound components must be used within MonthCard");
  }
  return context;
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

function formatCompactCurrency(value: number): string {
  if (value === 0) return "-";
  const absValue = Math.abs(value);
  if (absValue >= 1000) {
    return `${value < 0 ? "-" : ""}${(absValue / 1000).toFixed(1)}k`;
  }
  return value.toFixed(0);
}

function MonthCardRoot({ monthData, children }: Readonly<MonthCardProps>) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Projection | null>(null);

  const projectionMap = new Map<number, Projection>();
  monthData.projections.forEach((p) => {
    const day = new Date(p.date).getDate();
    projectionMap.set(day, p);
  });

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const contextValue: MonthCardContextValue = React.useMemo(
    () => ({
      monthData,
      theme,
      expanded,
      toggleExpand,
      selectedDay,
      setSelectedDay,
      projectionMap,
    }),
    [
      monthData,
      theme,
      expanded,
      toggleExpand,
      selectedDay,
      setSelectedDay,
      projectionMap,
    ]
  );

  return (
    <MonthCardContext.Provider value={contextValue}>
      <View
        style={[styles.container, { backgroundColor: theme.backgroundDefault }]}
      >
        {children}
      </View>
    </MonthCardContext.Provider>
  );
}

function MonthCardHeader() {
  const { monthData, theme, expanded, toggleExpand } = useMonthCardContext();

  return (
    <Pressable
      onPress={toggleExpand}
      style={({ pressed }) => [
        styles.header,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.headerLeft}>
        <ThemedText type="label">
          {monthData.month} {monthData.year}
        </ThemedText>
        <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Feather name="arrow-up-circle" size={14} color={theme.income} />
            <ThemedText type="caption" style={{ color: theme.income }}>
              {formatCurrency(monthData.totalIncome)}
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <Feather
              name="arrow-down-circle"
              size={14}
              color={theme.expense}
            />
            <ThemedText type="caption" style={{ color: theme.expense }}>
              {formatCurrency(monthData.totalExpenses)}
            </ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.headerRight}>
        <ThemedText
          type="body"
          style={{
            fontWeight: "600",
            color:
              monthData.finalBalance >= 0 ? theme.income : theme.expense,
          }}
        >
          {formatCurrency(monthData.finalBalance)}
        </ThemedText>
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.textSecondary}
        />
      </View>
    </Pressable>
  );
}

function MonthCardCalendar() {
  const { monthData, theme, expanded, projectionMap, setSelectedDay } = useMonthCardContext();

  if (!expanded) return null;

  const firstDate = new Date(monthData.year, monthData.monthIndex, 1);
  const lastDate = new Date(monthData.year, monthData.monthIndex + 1, 0);
  const daysInMonth = lastDate.getDate();
  const startDayOfWeek = firstDate.getDay();

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const handleDayPress = (day: number) => {
    const projection = projectionMap.get(day);
    if (projection) {
      setSelectedDay(projection);
    }
  };

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.weekdaysRow}>
        {WEEKDAYS.map((day, index) => (
          <View key={day} style={styles.weekdayCell}>
            <ThemedText
              type="caption"
              style={{
                color:
                  index === 0 || index === 6
                    ? theme.expense
                    : theme.textSecondary,
                fontWeight: "600",
                fontSize: 11,
              }}
            >
              {day}
            </ThemedText>
          </View>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={`${monthData.year}-${monthData.monthIndex}-week-${weekIndex}`} style={styles.weekRow}>
          {week.map((day, dayIndex) => {
            if (day === null) {
              return (
                <View key={`empty-${weekIndex}-${dayIndex}`} style={styles.dayCell} />
              );
            }

            const projection = projectionMap.get(day);
            const hasData = projection !== undefined;
            const net = projection ? projection.net : 0;
            const isPositive = net >= 0;
            const isWeekend = dayIndex === 0 || dayIndex === 6;

            return (
              <Pressable
                key={day}
                onPress={() => handleDayPress(day)}
                style={({ pressed }) => [
                  styles.dayCell,
                  hasData && {
                    backgroundColor: isPositive
                      ? theme.income + "15"
                      : theme.expense + "15",
                  },
                  pressed && hasData && { opacity: 0.6 },
                ]}
              >
                <ThemedText
                  type="caption"
                  style={{
                    fontWeight: "600",
                    color: isWeekend ? theme.textSecondary : theme.text,
                    fontSize: 12,
                  }}
                >
                  {day}
                </ThemedText>
                {hasData && projection && (
                  <>
                    {projection.income > 0 && (
                      <ThemedText
                        style={{
                          fontSize: 9,
                          color: theme.income,
                          fontWeight: "500",
                        }}
                      >
                        +{formatCompactCurrency(projection.income)}
                      </ThemedText>
                    )}
                    {projection.totalExpenses > 0 && (
                      <ThemedText
                        style={{
                          fontSize: 9,
                          color: theme.expense,
                          fontWeight: "500",
                        }}
                      >
                        -{formatCompactCurrency(projection.totalExpenses)}
                      </ThemedText>
                    )}
                  </>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function MonthCardDayDetail() {
  const { theme, selectedDay, setSelectedDay } = useMonthCardContext();

  return (
    <Modal
      visible={selectedDay !== null}
      transparent
      animationType="fade"
      onRequestClose={() => setSelectedDay(null)}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setSelectedDay(null)}
      >
        <Pressable
          style={[
            styles.dayDetailCard,
            { backgroundColor: theme.backgroundRoot },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {selectedDay && (
            <>
              <View style={styles.dayDetailHeader}>
                <ThemedText type="subheading">
                  {formatDate(selectedDay.date)}
                </ThemedText>
                <Pressable
                  onPress={() => setSelectedDay(null)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                >
                  <Feather name="x" size={24} color={theme.text} />
                </Pressable>
              </View>

              <View style={styles.dayDetailContent}>
                <View
                  style={[
                    styles.detailRow,
                    { backgroundColor: theme.income + "15" },
                  ]}
                >
                  <View style={styles.detailRowLeft}>
                    <Feather
                      name="arrow-up-circle"
                      size={20}
                      color={theme.income}
                    />
                    <ThemedText type="body">Receitas</ThemedText>
                  </View>
                  <ThemedText
                    type="body"
                    style={{ color: theme.income, fontWeight: "600" }}
                  >
                    {formatCurrency(selectedDay.income)}
                  </ThemedText>
                </View>

                <View
                  style={[
                    styles.detailRow,
                    { backgroundColor: theme.expense + "15" },
                  ]}
                >
                  <View style={styles.detailRowLeft}>
                    <Feather
                      name="arrow-down-circle"
                      size={20}
                      color={theme.expense}
                    />
                    <ThemedText type="body">Despesas Totais</ThemedText>
                  </View>
                  <ThemedText
                    type="body"
                    style={{ color: theme.expense, fontWeight: "600" }}
                  >
                    {formatCurrency(selectedDay.totalExpenses)}
                  </ThemedText>
                </View>

                <View
                  style={[
                    styles.detailSubRow,
                    { backgroundColor: theme.backgroundDefault },
                  ]}
                >
                  <View style={styles.detailRowLeft}>
                    <Feather
                      name="credit-card"
                      size={16}
                      color={theme.textSecondary}
                    />
                    <ThemedText
                      type="caption"
                      style={{ color: theme.textSecondary }}
                    >
                      Cartao
                    </ThemedText>
                  </View>
                  <ThemedText type="caption">
                    {formatCurrency(selectedDay.cardExpenses)}
                  </ThemedText>
                </View>

                <View
                  style={[
                    styles.detailSubRow,
                    { backgroundColor: theme.backgroundDefault },
                  ]}
                >
                  <View style={styles.detailRowLeft}>
                    <Feather
                      name="smartphone"
                      size={16}
                      color={theme.textSecondary}
                    />
                    <ThemedText
                      type="caption"
                      style={{ color: theme.textSecondary }}
                    >
                      Debito
                    </ThemedText>
                  </View>
                  <ThemedText type="caption">
                    {formatCurrency(selectedDay.debitExpenses)}
                  </ThemedText>
                </View>

                <View
                  style={[
                    styles.detailSubRow,
                    { backgroundColor: theme.backgroundDefault },
                  ]}
                >
                  <View style={styles.detailRowLeft}>
                    <Feather
                      name="more-horizontal"
                      size={16}
                      color={theme.textSecondary}
                    />
                    <ThemedText
                      type="caption"
                      style={{ color: theme.textSecondary }}
                    >
                      Outras
                    </ThemedText>
                  </View>
                  <ThemedText type="caption">
                    {formatCurrency(selectedDay.otherExpenses)}
                  </ThemedText>
                </View>

                <View style={styles.detailDivider} />

                <View
                  style={[
                    styles.detailRow,
                    {
                      backgroundColor:
                        selectedDay.net >= 0
                          ? theme.income + "15"
                          : theme.expense + "15",
                    },
                  ]}
                >
                  <View style={styles.detailRowLeft}>
                    <Feather
                      name="activity"
                      size={20}
                      color={
                        selectedDay.net >= 0 ? theme.income : theme.expense
                      }
                    />
                    <ThemedText type="body">Saldo do Dia</ThemedText>
                  </View>
                  <ThemedText
                    type="body"
                    style={{
                      color:
                        selectedDay.net >= 0 ? theme.income : theme.expense,
                      fontWeight: "600",
                    }}
                  >
                    {selectedDay.net >= 0 ? "+" : ""}
                    {formatCurrency(selectedDay.net)}
                  </ThemedText>
                </View>

                <View
                  style={[
                    styles.detailRow,
                    { backgroundColor: theme.primary + "15" },
                  ]}
                >
                  <View style={styles.detailRowLeft}>
                    <Feather
                      name="dollar-sign"
                      size={20}
                      color={theme.primary}
                    />
                    <ThemedText type="body">Saldo Acumulado</ThemedText>
                  </View>
                  <ThemedText
                    type="body"
                    style={{
                      color:
                        selectedDay.currentAmount >= 0
                          ? theme.income
                          : theme.expense,
                      fontWeight: "700",
                    }}
                  >
                    {formatCurrency(selectedDay.currentAmount)}
                  </ThemedText>
                </View>
              </View>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export const MonthCard = Object.assign(MonthCardRoot, {
  Header: MonthCardHeader,
  Calendar: MonthCardCalendar,
  DayDetail: MonthCardDayDetail,
});

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
    gap: Spacing.xs,
  },
  headerStats: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  calendarContainer: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
    paddingTop: Spacing.sm,
  },
  weekdaysRow: {
    flexDirection: "row",
    marginBottom: Spacing.xs,
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.xs,
    margin: 1,
    padding: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  dayDetailCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  dayDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  dayDetailContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
  },
  detailSubRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xs,
    marginLeft: Spacing.xl,
  },
  detailRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  detailDivider: {
    height: 1,
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    marginVertical: Spacing.sm,
  },
});
