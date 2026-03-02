import { ScrollView, View, Text, Pressable, FlatList, Modal, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useFinance } from "@/lib/finance-context";
import { useColors } from "@/hooks/use-colors";
import { useState, useMemo } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ExpenseFrequency } from "@/lib/types";

export default function ExpensesScreen() {
  const { state, addExpense, deleteExpense } = useFinance();
  const colors = useColors();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    categoryId: "",
    frequency: "monthly" as ExpenseFrequency,
  });

  // Get suggested categories based on recent expenses
  const suggestedCategories = useMemo(() => {
    const categoryFreq: Record<string, number> = {};
    state.expenses.forEach((exp) => {
      categoryFreq[exp.categoryId] = (categoryFreq[exp.categoryId] || 0) + 1;
    });
    return Object.entries(categoryFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([catId]) => state.categories.find((c) => c.id === catId))
      .filter(Boolean);
  }, [state.expenses, state.categories]);

  const handleAddExpense = () => {
    if (!formData.description || !formData.amount || !formData.categoryId) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    addExpense({
      description: formData.description,
      amount: parseFloat(formData.amount),
      categoryId: formData.categoryId,
      frequency: formData.frequency,
      date: new Date(),
    });

    setFormData({ description: "", amount: "", categoryId: "", frequency: "monthly" });
    setShowModal(false);
  };

  const totalExpenses = state.summary.totalExpenses;

  // Group expenses by category
  const expensesByCategory = useMemo(() => {
    const grouped: Record<string, number> = {};
    state.expenses.forEach((exp) => {
      grouped[exp.categoryId] = (grouped[exp.categoryId] || 0) + exp.amount;
    });
    return grouped;
  }, [state.expenses]);

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-warning px-6 pt-6 pb-8">
          <Text className="text-white text-sm font-medium mb-2">Gastos del Mes</Text>
          <Text className="text-white text-4xl font-bold">${totalExpenses.toFixed(2)}</Text>
        </View>

        {/* Category summary */}
        {Object.keys(expensesByCategory).length > 0 && (
          <View className="px-6 py-6">
            <Text className="text-foreground font-semibold mb-3">Por Categoría</Text>
            <FlatList
              data={Object.entries(expensesByCategory)}
              keyExtractor={([catId]) => catId}
              scrollEnabled={false}
              renderItem={({ item: [catId, amount] }) => {
                const category = state.categories.find((c) => c.id === catId);
                return (
                  <View className="flex-row items-center gap-3 mb-2">
                    <View
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category?.color }}
                    />
                    <Text className="text-muted text-sm flex-1">{category?.name}</Text>
                    <Text className="text-foreground font-semibold">${amount.toFixed(2)}</Text>
                  </View>
                );
              }}
            />
          </View>
        )}

        {/* Recent expenses */}
        <View className="px-6 py-6 flex-1">
          <Text className="text-foreground font-semibold mb-3">Gastos Recientes</Text>
          {state.expenses.length > 0 ? (
            <FlatList
              data={state.expenses.sort((a, b) => b.date.getTime() - a.date.getTime())}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const category = state.categories.find((c) => c.id === item.categoryId);
                const frequencyLabel = {
                  daily: "Diario",
                  weekly: "Semanal",
                  biweekly: "Quincenal",
                  monthly: "Mensual",
                }[item.frequency] || item.frequency;

                return (
                  <View className="bg-surface rounded-xl p-4 mb-3 flex-row items-center justify-between border border-border">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: category?.color + "20" }}
                      >
                        <Text className="text-lg">{category?.icon}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-foreground font-semibold text-sm">
                          {item.description}
                        </Text>
                        <Text className="text-muted text-xs mt-1">
                          {category?.name} • {frequencyLabel}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-error font-bold">-${item.amount.toFixed(2)}</Text>
                      <Pressable
                        onPress={() => deleteExpense(item.id)}
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                      >
                        <IconSymbol name="trash.fill" size={14} color={colors.error} />
                      </Pressable>
                    </View>
                  </View>
                );
              }}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-muted text-center">No hay gastos registrados</Text>
            </View>
          )}
        </View>

        {/* Add button */}
        <View className="px-6 pb-8">
          <Pressable
            onPress={() => setShowModal(true)}
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

      {/* Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 pb-8 max-h-4/5">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-foreground text-2xl font-bold mb-6">Nuevo Gasto</Text>

              <Text className="text-foreground font-semibold mb-2">Descripción</Text>
              <TextInput
                placeholder="Ej: Almuerzo"
                placeholderTextColor={colors.muted}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-4"
              />

              <Text className="text-foreground font-semibold mb-2">Monto</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor={colors.muted}
                value={formData.amount}
                onChangeText={(text) => setFormData({ ...formData, amount: text })}
                keyboardType="decimal-pad"
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-4"
              />

              <Text className="text-foreground font-semibold mb-2">Frecuencia</Text>
              <View className="flex-row gap-2 mb-4 flex-wrap">
                {(["daily", "weekly", "biweekly", "monthly"] as ExpenseFrequency[]).map((freq) => (
                  <Pressable
                    key={freq}
                    onPress={() => setFormData({ ...formData, frequency: freq })}
                    style={({ pressed }) => [
                      { opacity: pressed ? 0.8 : 1 },
                      {
                        backgroundColor:
                          formData.frequency === freq ? colors.primary : colors.surface,
                      },
                    ]}
                    className="rounded-lg py-2 px-3 border border-border"
                  >
                    <Text
                      className={`text-xs font-semibold ${formData.frequency === freq ? "text-white" : "text-foreground"}`}
                    >
                      {freq === "daily" ? "Diario" : freq === "weekly" ? "Semanal" : freq === "biweekly" ? "Quincenal" : "Mensual"}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text className="text-foreground font-semibold mb-3">Categoría</Text>
              {suggestedCategories.length > 0 && (
                <>
                  <Text className="text-muted text-xs mb-2">Sugeridas</Text>
                  <View className="flex-row gap-2 mb-4">
                    {suggestedCategories.map((cat) => (
                      <Pressable
                        key={cat?.id}
                        onPress={() => setFormData({ ...formData, categoryId: cat?.id || "" })}
                        style={({ pressed }) => [
                          { opacity: pressed ? 0.8 : 1 },
                          {
                            backgroundColor:
                              formData.categoryId === cat?.id ? cat?.color : colors.surface,
                          },
                        ]}
                        className="flex-1 rounded-lg py-3 items-center border border-border"
                      >
                        <Text
                          className={`text-xs font-semibold ${formData.categoryId === cat?.id ? "text-white" : "text-foreground"}`}
                        >
                          {cat?.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              )}

              <Text className="text-muted text-xs mb-2">Todas las categorías</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {state.categories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    onPress={() => setFormData({ ...formData, categoryId: cat.id })}
                    style={({ pressed }) => [
                      { opacity: pressed ? 0.8 : 1 },
                      {
                        backgroundColor:
                          formData.categoryId === cat.id ? cat.color : colors.surface,
                      },
                    ]}
                    className="rounded-lg py-2 px-3 border border-border"
                  >
                    <Text
                      className={`text-xs font-semibold ${formData.categoryId === cat.id ? "text-white" : "text-foreground"}`}
                    >
                      {cat.name}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => setShowModal(false)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                  className="flex-1 bg-surface rounded-lg py-4 items-center border border-border"
                >
                  <Text className="text-foreground font-semibold">Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={handleAddExpense}
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.8 : 1 },
                    { backgroundColor: colors.primary },
                  ]}
                  className="flex-1 rounded-lg py-4 items-center"
                >
                  <Text className="text-white font-semibold">Guardar</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
