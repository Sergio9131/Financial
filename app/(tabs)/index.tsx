import { ScrollView, View, Text, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useFinance } from "@/lib/finance-context";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useMemo } from "react";

export default function DashboardScreen() {
  const { state } = useFinance();
  const colors = useColors();
  const router = useRouter();

  const summary = state.summary;

  // Get recent transactions
  const recentTransactions = useMemo(() => {
    const allTransactions = [
      ...state.expenses.map((e) => ({
        id: e.id,
        type: "expense" as const,
        amount: e.amount,
        description: e.description,
        date: e.date,
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

    return allTransactions;
  }, [state.expenses]);

  const healthColor =
    summary.healthScore >= 80
      ? colors.success
      : summary.healthScore >= 60
        ? colors.warning
        : colors.error;

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header with health indicator */}
        <View className="bg-primary px-6 pt-6 pb-8">
          <Text className="text-white text-sm font-medium mb-2">Estado Financiero</Text>
          <View className="flex-row items-end justify-between">
            <View className="flex-1">
              <Text className="text-white text-4xl font-bold">
                ${summary.netBalance.toFixed(2)}
              </Text>
              <Text className="text-white/80 text-sm mt-1">Balance Neto</Text>
            </View>
            <View className="items-center">
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: healthColor }}
              >
                <Text className="text-white font-bold text-xl">{summary.healthScore}%</Text>
              </View>
              <Text className="text-white/80 text-xs mt-2">Salud</Text>
            </View>
          </View>
        </View>

        {/* Summary cards */}
        <View className="px-6 py-6 gap-4">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-muted text-xs font-medium mb-2">INGRESOS</Text>
              <Text className="text-foreground text-2xl font-bold">
                ${summary.totalIncome.toFixed(2)}
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-muted text-xs font-medium mb-2">DEUDAS</Text>
              <Text className="text-error text-2xl font-bold">
                ${summary.totalDebt.toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-muted text-xs font-medium mb-2">GASTOS (MES)</Text>
              <Text className="text-foreground text-2xl font-bold">
                ${summary.totalExpenses.toFixed(2)}
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-muted text-xs font-medium mb-2">DEUDA/INGRESOS</Text>
              <Text className="text-warning text-2xl font-bold">
                {summary.debtToIncomeRatio.toFixed(0)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Alerts */}
        {state.alerts.length > 0 && (
          <View className="px-6 pb-6">
            <Text className="text-foreground font-semibold mb-3">Alertas</Text>
            {state.alerts.map((alert) => (
              <View
                key={alert.id}
                className="bg-surface rounded-xl p-4 mb-3 border-l-4"
                style={{
                  borderLeftColor:
                    alert.type === "error"
                      ? colors.error
                      : alert.type === "warning"
                        ? colors.warning
                        : colors.primary,
                }}
              >
                <Text className="text-foreground font-semibold text-sm">{alert.title}</Text>
                <Text className="text-muted text-xs mt-1">{alert.message}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Recent transactions */}
        <View className="px-6 pb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground font-semibold">Transacciones Recientes</Text>
            <Pressable
              onPress={() => router.push("/(tabs)/expenses")}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-primary text-sm font-medium">Ver todo</Text>
            </Pressable>
          </View>

          {recentTransactions.length > 0 ? (
            <FlatList
              data={recentTransactions}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="bg-surface rounded-xl p-4 mb-2 flex-row items-center justify-between border border-border">
                  <View className="flex-1">
                    <Text className="text-foreground font-medium text-sm">{item.description}</Text>
                    <Text className="text-muted text-xs mt-1">
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text className="text-error font-semibold">-${item.amount.toFixed(2)}</Text>
                </View>
              )}
            />
          ) : (
            <View className="bg-surface rounded-xl p-6 items-center">
              <Text className="text-muted text-sm">No hay transacciones aún</Text>
            </View>
          )}
        </View>

        {/* Quick action buttons */}
        <View className="px-6 pb-8 gap-3">
          <Pressable
            onPress={() => router.push("/(tabs)/incomes")}
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1 },
              { backgroundColor: colors.success },
            ]}
            className="rounded-xl py-4 px-6 items-center"
          >
            <Text className="text-white font-semibold">+ Agregar Ingreso</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/expenses")}
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1 },
              { backgroundColor: colors.primary },
            ]}
            className="rounded-xl py-4 px-6 items-center"
          >
            <Text className="text-white font-semibold">+ Registrar Gasto</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
