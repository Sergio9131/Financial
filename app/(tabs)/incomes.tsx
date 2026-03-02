import { ScrollView, View, Text, Pressable, FlatList, Modal, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useFinance } from "@/lib/finance-context";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Frequency } from "@/lib/types";

export default function IncomesScreen() {
  const { state, addIncome, deleteIncome } = useFinance();
  const colors = useColors();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    frequency: "monthly" as Frequency,
  });

  const handleAddIncome = () => {
    if (!formData.name || !formData.amount) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    const nextPaymentDate = new Date();
    if (formData.frequency === "weekly") {
      nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
    } else if (formData.frequency === "biweekly") {
      nextPaymentDate.setDate(nextPaymentDate.getDate() + 14);
    } else if (formData.frequency === "monthly") {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    } else if (formData.frequency === "yearly") {
      nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
    }

    addIncome({
      name: formData.name,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      nextPaymentDate,
    });

    setFormData({ name: "", amount: "", frequency: "monthly" });
    setShowModal(false);
  };

  const totalIncome = state.summary.totalIncome;

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-success px-6 pt-6 pb-8">
          <Text className="text-white text-sm font-medium mb-2">Ingresos Totales</Text>
          <Text className="text-white text-4xl font-bold">${totalIncome.toFixed(2)}</Text>
        </View>

        {/* Income list */}
        <View className="px-6 py-6 flex-1">
          {state.incomes.length > 0 ? (
            <FlatList
              data={state.incomes}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="bg-surface rounded-xl p-4 mb-3 flex-row items-center justify-between border border-border">
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold">{item.name}</Text>
                    <Text className="text-muted text-xs mt-1 capitalize">
                      {item.frequency === "once" ? "Único" : item.frequency === "weekly" ? "Semanal" : item.frequency === "biweekly" ? "Quincenal" : item.frequency === "monthly" ? "Mensual" : "Anual"}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-success font-bold text-lg">${item.amount.toFixed(2)}</Text>
                    <Pressable
                      onPress={() => deleteIncome(item.id)}
                      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    >
                      <IconSymbol name="trash.fill" size={16} color={colors.error} />
                    </Pressable>
                  </View>
                </View>
              )}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-muted text-center">No hay ingresos registrados</Text>
            </View>
          )}
        </View>

        {/* Add button */}
        <View className="px-6 pb-8">
          <Pressable
            onPress={() => setShowModal(true)}
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1 },
              { backgroundColor: colors.success },
            ]}
            className="rounded-xl py-4 px-6 items-center"
          >
            <Text className="text-white font-semibold">+ Agregar Ingreso</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 pb-8">
            <Text className="text-foreground text-2xl font-bold mb-6">Nuevo Ingreso</Text>

            <Text className="text-foreground font-semibold mb-2">Nombre</Text>
            <TextInput
              placeholder="Ej: Salario"
              placeholderTextColor={colors.muted}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
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
            <View className="flex-row gap-2 mb-6">
              {(["once", "weekly", "biweekly", "monthly", "yearly"] as Frequency[]).map((freq) => (
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
                  className="flex-1 rounded-lg py-3 items-center border border-border"
                >
                  <Text
                    className={`text-xs font-semibold ${formData.frequency === freq ? "text-white" : "text-foreground"}`}
                  >
                    {freq === "once" ? "Único" : freq === "weekly" ? "Semanal" : freq === "biweekly" ? "Quincenal" : freq === "monthly" ? "Mensual" : "Anual"}
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
                onPress={handleAddIncome}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.8 : 1 },
                  { backgroundColor: colors.success },
                ]}
                className="flex-1 rounded-lg py-4 items-center"
              >
                <Text className="text-white font-semibold">Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
