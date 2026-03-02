import { ScrollView, View, Text, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useFinance } from "@/lib/finance-context";
import { useColors } from "@/hooks/use-colors";
import { useMemo } from "react";

export default function AnalyticsScreen() {
  const { state } = useFinance();
  const colors = useColors();

  const summary = state.summary;

  // Calculate trends
  const trends = useMemo(() => {
    const monthlyData: Record<string, number> = {};
    state.expenses.forEach((exp) => {
      const month = new Date(exp.date).toLocaleString("es-ES", { month: "short", year: "2-digit" });
      monthlyData[month] = (monthlyData[month] || 0) + exp.amount;
    });
    return Object.entries(monthlyData).sort();
  }, [state.expenses]);

  // Top expense categories
  const topCategories = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    state.expenses.forEach((exp) => {
      categoryTotals[exp.categoryId] = (categoryTotals[exp.categoryId] || 0) + exp.amount;
    });
    return Object.entries(categoryTotals)
      .map(([catId, amount]) => ({
        category: state.categories.find((c) => c.id === catId),
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [state.expenses, state.categories]);

  // Recommendations
  const recommendations = useMemo(() => {
    const recs: string[] = [];

    if (summary.debtToIncomeRatio > 50) {
      recs.push("Tu deuda es muy alta. Considera aumentar ingresos o reducir gastos significativamente.");
    } else if (summary.debtToIncomeRatio > 30) {
      recs.push("Tu deuda es moderada. Enfócate en pagarla gradualmente.");
    }

    if (summary.totalExpenses > summary.totalIncome * 0.8) {
      recs.push("Tus gastos son muy altos comparados con tus ingresos. Revisa dónde puedes ahorrar.");
    }

    if (topCategories.length > 0 && topCategories[0].amount > summary.totalExpenses * 0.4) {
      recs.push(
        `Gastas mucho en ${topCategories[0].category?.name}. Considera reducir en esta categoría.`
      );
    }

    if (summary.netBalance > 0) {
      recs.push("¡Buen trabajo! Tienes un balance positivo. Considera ahorrar o invertir.");
    }

    return recs.length > 0 ? recs : ["Mantén el monitoreo de tus finanzas regularmente."];
  }, [summary, topCategories]);

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Health Score */}
        <View className="bg-primary px-6 pt-6 pb-8">
          <Text className="text-white text-sm font-medium mb-4">Salud Financiera</Text>
          <View className="flex-row items-end gap-6">
            <View className="flex-1">
              <View className="bg-white/20 rounded-full h-32 w-32 items-center justify-center">
                <Text className="text-white text-5xl font-bold">{summary.healthScore}%</Text>
              </View>
            </View>
            <View className="flex-1 gap-3">
              <View>
                <Text className="text-white/80 text-xs mb-1">Ingresos</Text>
                <Text className="text-white font-bold">${summary.totalIncome.toFixed(2)}</Text>
              </View>
              <View>
                <Text className="text-white/80 text-xs mb-1">Deudas</Text>
                <Text className="text-white font-bold">${summary.totalDebt.toFixed(2)}</Text>
              </View>
              <View>
                <Text className="text-white/80 text-xs mb-1">Balance</Text>
                <Text
                  className="font-bold"
                  style={{ color: summary.netBalance >= 0 ? colors.success : colors.error }}
                >
                  ${summary.netBalance.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Trends */}
        {trends.length > 0 && (
          <View className="px-6 py-6">
            <Text className="text-foreground font-semibold mb-4">Gastos por Mes</Text>
            <FlatList
              data={trends}
              keyExtractor={([month]) => month}
              scrollEnabled={false}
              renderItem={({ item: [month, amount] }) => {
                const maxAmount = Math.max(...trends.map(([, a]) => a));
                const percentage = (amount / maxAmount) * 100;
                return (
                  <View className="mb-4">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-foreground font-medium text-sm">{month}</Text>
                      <Text className="text-foreground font-bold">${amount.toFixed(2)}</Text>
                    </View>
                    <View className="bg-surface rounded-full h-2 overflow-hidden">
                      <View
                        className="bg-primary h-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </View>
                  </View>
                );
              }}
            />
          </View>
        )}

        {/* Top Categories */}
        {topCategories.length > 0 && (
          <View className="px-6 py-6">
            <Text className="text-foreground font-semibold mb-4">Categorías Principales</Text>
            <FlatList
              data={topCategories}
              keyExtractor={(item) => item.category?.id || "unknown"}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const percentage = (item.amount / summary.totalExpenses) * 100;
                return (
                  <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center gap-3 flex-1">
                        <View
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.category?.color }}
                        />
                        <Text className="text-foreground font-semibold flex-1">
                          {item.category?.name}
                        </Text>
                      </View>
                      <Text className="text-foreground font-bold">${item.amount.toFixed(2)}</Text>
                    </View>
                    <View className="bg-background rounded-full h-2 overflow-hidden">
                      <View
                        className="h-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.category?.color,
                        }}
                      />
                    </View>
                    <Text className="text-muted text-xs mt-2">{percentage.toFixed(0)}% del total</Text>
                  </View>
                );
              }}
            />
          </View>
        )}

        {/* Recommendations */}
        <View className="px-6 py-6 pb-8">
          <Text className="text-foreground font-semibold mb-4">Recomendaciones</Text>
          <FlatList
            data={recommendations}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View className="bg-surface rounded-xl p-4 mb-3 border-l-4 border-primary">
                <Text className="text-foreground text-sm leading-relaxed">{item}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
