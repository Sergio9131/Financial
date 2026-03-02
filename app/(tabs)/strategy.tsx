import { ScrollView, View, Text, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useFinance } from "@/lib/finance-context";
import { useColors } from "@/hooks/use-colors";
import { useMemo } from "react";

export default function StrategyScreen() {
  const { state } = useFinance();
  const colors = useColors();
  const plan = state.summary.strategicPlan;

  const riskColors = {
    low: colors.success,
    medium: colors.warning,
    high: colors.error,
    critical: "#8B0000",
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {plan ? (
          <>
            {/* Risk Level */}
            <View
              className="px-6 pt-6 pb-8"
              style={{ backgroundColor: riskColors[plan.riskLevel] }}
            >
              <Text className="text-white text-sm font-medium mb-2">Nivel de Riesgo</Text>
              <Text className="text-white text-3xl font-bold capitalize mb-4">{plan.riskLevel}</Text>

              <View className="gap-3">
                <View className="flex-row justify-between">
                  <Text className="text-white/80 text-sm">Ingresos Mensuales</Text>
                  <Text className="text-white font-bold">${plan.totalMonthlyIncome.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-white/80 text-sm">Gastos Mensuales</Text>
                  <Text className="text-white font-bold">${plan.totalMonthlyExpenses.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between border-t border-white/30 pt-3">
                  <Text className="text-white/80 text-sm font-semibold">Disponible para Deudas</Text>
                  <Text className="text-white font-bold text-lg">
                    ${plan.availableForDebtPayment.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Debt Summary */}
            <View className="px-6 py-6">
              <Text className="text-foreground font-semibold mb-4">Resumen de Deudas</Text>

              <View className="bg-surface rounded-xl p-4 border border-border mb-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-muted text-sm">Deuda Total</Text>
                  <Text className="text-error font-bold text-lg">${plan.totalDebtAmount.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-muted text-sm">Pago Mensual Total</Text>
                  <Text className="text-primary font-bold">${plan.totalMonthlyDebtPayment.toFixed(2)}</Text>
                </View>
                {plan.estimatedDebtFreeDate && (
                  <View className="flex-row justify-between pt-2 border-t border-border">
                    <Text className="text-muted text-sm">Fecha Estimada Libre de Deudas</Text>
                    <Text className="text-success font-bold">
                      {new Date(plan.estimatedDebtFreeDate).toLocaleDateString("es-ES", {
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Payment Plans */}
            {plan.debtPaymentPlans.length > 0 && (
              <View className="px-6 py-6">
                <Text className="text-foreground font-semibold mb-4">Plan de Pago Estratégico</Text>
                <Text className="text-muted text-xs mb-4">
                  Método Avalanche: Pagamos primero las deudas con mayor interés para ahorrar dinero.
                </Text>

                <FlatList
                  data={plan.debtPaymentPlans}
                  keyExtractor={(item) => item.debtId}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
                      <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2 mb-1">
                            <View
                              className="w-6 h-6 rounded-full items-center justify-center"
                              style={{ backgroundColor: colors.primary }}
                            >
                              <Text className="text-white text-xs font-bold">{item.priority}</Text>
                            </View>
                            <Text className="text-foreground font-semibold flex-1">{item.debtName}</Text>
                          </View>
                          <Text className="text-muted text-xs ml-8">
                            Interés: {item.interestRate}% anual
                          </Text>
                        </View>
                      </View>

                      <View className="gap-2 mb-3">
                        <View className="flex-row justify-between">
                          <Text className="text-muted text-sm">Balance Actual</Text>
                          <Text className="text-error font-bold">${item.currentBalance.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                          <Text className="text-muted text-sm">Pago Mensual</Text>
                          <Text className="text-success font-bold">${item.monthlyPayment.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                          <Text className="text-muted text-sm">Meses para Liquidar</Text>
                          <Text className="text-primary font-bold">{item.estimatedPayoffMonths}</Text>
                        </View>
                      </View>

                      <View className="bg-background rounded-lg p-3 border border-border">
                        <Text className="text-foreground text-xs leading-relaxed">{item.strategy}</Text>
                      </View>
                    </View>
                  )}
                />
              </View>
            )}

            {/* Recommendations */}
            <View className="px-6 py-6 pb-8">
              <Text className="text-foreground font-semibold mb-4">Recomendaciones</Text>

              <FlatList
                data={plan.recommendations}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View className="bg-surface rounded-xl p-4 mb-3 border-l-4 border-primary">
                    <Text className="text-foreground text-sm leading-relaxed">{item}</Text>
                  </View>
                )}
              />
            </View>
          </>
        ) : (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-muted text-center text-lg">
              No hay deudas registradas. Agrega deudas para ver tu estrategia de pago.
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
