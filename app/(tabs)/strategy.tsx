import { ScrollView, View, Text, FlatList, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useFinance } from "@/lib/finance-context";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { PaymentStrategy } from "@/lib/types";

export default function StrategyScreen() {
  const { state } = useFinance();
  const colors = useColors();
  const plan = state.summary.strategicPlan;
  const [selectedStrategy, setSelectedStrategy] = useState<PaymentStrategy>(plan?.recommendedStrategy || 'avalanche');

  const riskColors = {
    low: colors.success,
    medium: colors.warning,
    high: colors.error,
    critical: "#8B0000",
  };

  const currentStrategy = plan?.strategies.find((s) => s.strategy === selectedStrategy);

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {plan ? (
          <>
            {/* Risk Level Header */}
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

            {/* Financial Metrics */}
            <View className="px-6 py-6">
              <Text className="text-foreground font-semibold mb-4">Métricas Financieras</Text>

              <View className="bg-surface rounded-xl p-4 border border-border gap-3">
                <View className="flex-row justify-between">
                  <Text className="text-muted text-sm">Deuda Total</Text>
                  <Text className="text-error font-bold">${plan.totalDebtAmount.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-muted text-sm">Deuda/Ingresos</Text>
                  <Text className="text-warning font-bold">{plan.debtToIncomeRatio.toFixed(0)}%</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-muted text-sm">Gastos/Ingresos</Text>
                  <Text className="text-primary font-bold">{plan.expenseToIncomeRatio.toFixed(0)}%</Text>
                </View>
                <View className="flex-row justify-between border-t border-border pt-3">
                  <Text className="text-muted text-sm font-semibold">Tasa de Ahorro</Text>
                  <Text className="text-success font-bold">{plan.savingsRate.toFixed(0)}%</Text>
                </View>
              </View>
            </View>

            {/* Strategy Selection */}
            {plan.strategies.length > 0 && (
              <View className="px-6 py-6">
                <Text className="text-foreground font-semibold mb-4">Selecciona una Estrategia</Text>

                <FlatList
                  data={plan.strategies}
                  keyExtractor={(item) => item.strategy}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => setSelectedStrategy(item.strategy)}
                      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                      className={`rounded-xl p-4 mb-3 border-2 ${
                        selectedStrategy === item.strategy
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-surface'
                      }`}
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-foreground font-bold flex-1">{item.name}</Text>
                        {selectedStrategy === item.strategy && (
                          <View className="w-5 h-5 rounded-full" style={{ backgroundColor: colors.primary }} />
                        )}
                      </View>
                      <Text className="text-muted text-xs mb-3">{item.description}</Text>

                      <View className="gap-2">
                        <View className="flex-row justify-between">
                          <Text className="text-muted text-xs">Meses para Liquidar</Text>
                          <Text className="text-foreground font-semibold text-xs">
                            {item.totalMonthsToPayoff}
                          </Text>
                        </View>
                        <View className="flex-row justify-between">
                          <Text className="text-muted text-xs">Intereses Totales</Text>
                          <Text className="text-error font-semibold text-xs">
                            ${item.totalInterestPaid.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  )}
                />
              </View>
            )}

            {/* Current Strategy Details */}
            {currentStrategy && (
              <>
                <View className="px-6 py-6">
                  <Text className="text-foreground font-semibold mb-4">Plan de Pago Detallado</Text>

                  <View className="bg-surface rounded-xl p-4 border border-border mb-4">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-muted text-sm">Tiempo Total</Text>
                      <Text className="text-primary font-bold">
                        {currentStrategy.totalMonthsToPayoff} meses ({(currentStrategy.totalMonthsToPayoff / 12).toFixed(1)} años)
                      </Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-muted text-sm">Intereses a Pagar</Text>
                      <Text className="text-error font-bold">${currentStrategy.totalInterestPaid.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between border-t border-border pt-3">
                      <Text className="text-muted text-sm font-semibold">Total a Pagar</Text>
                      <Text className="text-foreground font-bold text-lg">
                        ${currentStrategy.totalAmountPaid.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  {/* Debt Payment Plans */}
                  <Text className="text-foreground font-semibold mb-3">Deudas por Prioridad</Text>
                  <FlatList
                    data={currentStrategy.debtPaymentPlans}
                    keyExtractor={(item) => item.debtId}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
                        <View className="flex-row items-center gap-2 mb-3">
                          <View
                            className="w-8 h-8 rounded-full items-center justify-center"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <Text className="text-white text-xs font-bold">{item.priority}</Text>
                          </View>
                          <View className="flex-1">
                            <Text className="text-foreground font-semibold">{item.debtName}</Text>
                            <Text className="text-muted text-xs">Interés: {item.interestRate}% anual</Text>
                          </View>
                        </View>

                        <View className="gap-2 bg-background rounded-lg p-3">
                          <View className="flex-row justify-between">
                            <Text className="text-muted text-xs">Balance Actual</Text>
                            <Text className="text-error font-bold text-xs">
                              ${item.currentBalance.toFixed(2)}
                            </Text>
                          </View>
                          <View className="flex-row justify-between">
                            <Text className="text-muted text-xs">Pago Mensual</Text>
                            <Text className="text-success font-bold text-xs">
                              ${item.monthlyPayment.toFixed(2)}
                            </Text>
                          </View>
                          <View className="flex-row justify-between">
                            <Text className="text-muted text-xs">Intereses a Pagar</Text>
                            <Text className="text-warning font-bold text-xs">
                              ${item.totalInterestPaid.toFixed(2)}
                            </Text>
                          </View>
                          <View className="flex-row justify-between border-t border-border pt-2">
                            <Text className="text-muted text-xs font-semibold">Meses para Liquidar</Text>
                            <Text className="text-primary font-bold text-xs">
                              {item.estimatedPayoffMonths}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  />
                </View>

                {/* Recommendations */}
                <View className="px-6 py-6">
                  <Text className="text-foreground font-semibold mb-4">Recomendaciones</Text>

                  <FlatList
                    data={currentStrategy.recommendations}
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
            )}

            {/* Alerts and Opportunities */}
            {(plan.alerts.length > 0 || plan.opportunities.length > 0) && (
              <View className="px-6 py-6 pb-8">
                {plan.alerts.length > 0 && (
                  <>
                    <Text className="text-error font-semibold mb-3">⚠️ Alertas</Text>
                    <FlatList
                      data={plan.alerts}
                      keyExtractor={(item, index) => `alert-${index}`}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <View className="bg-error/10 rounded-xl p-4 mb-3 border border-error/30">
                          <Text className="text-error text-sm leading-relaxed">{item}</Text>
                        </View>
                      )}
                    />
                  </>
                )}

                {plan.opportunities.length > 0 && (
                  <>
                    <Text className="text-success font-semibold mb-3 mt-4">🎯 Oportunidades</Text>
                    <FlatList
                      data={plan.opportunities}
                      keyExtractor={(item, index) => `opp-${index}`}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <View className="bg-success/10 rounded-xl p-4 mb-3 border border-success/30">
                          <Text className="text-success text-sm leading-relaxed">{item}</Text>
                        </View>
                      )}
                    />
                  </>
                )}
              </View>
            )}
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
