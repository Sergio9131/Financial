import { ScrollView, View, Text, Pressable, FlatList, Modal, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useFinance } from "@/lib/finance-context";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { DebtStatus } from "@/lib/types";

export default function DebtsScreen() {
  const { state, addDebt, deleteDebt, updateDebt } = useFinance();
  const colors = useColors();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    interestRate: "",
    dueDate: new Date().toISOString().split("T")[0],
  });

  const handleAddDebt = () => {
    if (!formData.name || !formData.amount) {
      Alert.alert("Error", "Por favor completa los campos requeridos");
      return;
    }

    addDebt({
      name: formData.name,
      amount: parseFloat(formData.amount),
      interestRate: parseFloat(formData.interestRate) || 0,
      dueDate: new Date(formData.dueDate),
      status: "active" as DebtStatus,
    });

    setFormData({
      name: "",
      amount: "",
      interestRate: "",
      dueDate: new Date().toISOString().split("T")[0],
    });
    setShowModal(false);
  };

  const totalDebt = state.summary.totalDebt;
  const debtRatio = state.summary.debtToIncomeRatio;

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-error px-6 pt-6 pb-8">
          <Text className="text-white text-sm font-medium mb-2">Deuda Total</Text>
          <Text className="text-white text-4xl font-bold">${totalDebt.toFixed(2)}</Text>
          <Text className="text-white/80 text-sm mt-2">
            {debtRatio.toFixed(0)}% de tus ingresos
          </Text>
        </View>

        {/* Debt list */}
        <View className="px-6 py-6 flex-1">
          {state.debts.length > 0 ? (
            <FlatList
              data={state.debts}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-foreground font-semibold flex-1">{item.name}</Text>
                    <View
                      className="px-2 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          item.status === "paid"
                            ? colors.success
                            : item.status === "overdue"
                              ? colors.error
                              : colors.warning,
                      }}
                    >
                      <Text className="text-white text-xs font-semibold capitalize">
                        {item.status === "paid" ? "Pagada" : item.status === "overdue" ? "Vencida" : "Activa"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-error font-bold text-lg">${item.amount.toFixed(2)}</Text>
                    {item.interestRate > 0 && (
                      <Text className="text-muted text-sm">{item.interestRate}% interés</Text>
                    )}
                  </View>
                  <Text className="text-muted text-xs">
                    Vencimiento: {new Date(item.dueDate).toLocaleDateString()}
                  </Text>
                  <View className="flex-row gap-2 mt-3">
                    {item.status !== "paid" && (
                      <Pressable
                        onPress={() =>
                          updateDebt(item.id, { status: "paid" as DebtStatus })
                        }
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                        className="flex-1 bg-success/20 rounded-lg py-2 items-center"
                      >
                        <Text className="text-success text-xs font-semibold">Marcar pagada</Text>
                      </Pressable>
                    )}
                    <Pressable
                      onPress={() => deleteDebt(item.id)}
                      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                      className="bg-error/20 rounded-lg px-3 py-2 items-center"
                    >
                      <IconSymbol name="trash.fill" size={14} color={colors.error} />
                    </Pressable>
                  </View>
                </View>
              )}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-muted text-center">No hay deudas registradas</Text>
            </View>
          )}
        </View>

        {/* Add button */}
        <View className="px-6 pb-8">
          <Pressable
            onPress={() => setShowModal(true)}
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1 },
              { backgroundColor: colors.error },
            ]}
            className="rounded-xl py-4 px-6 items-center"
          >
            <Text className="text-white font-semibold">+ Agregar Deuda</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 pb-8">
            <Text className="text-foreground text-2xl font-bold mb-6">Nueva Deuda</Text>

            <Text className="text-foreground font-semibold mb-2">Nombre</Text>
            <TextInput
              placeholder="Ej: Tarjeta de Crédito"
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

            <Text className="text-foreground font-semibold mb-2">Tasa de Interés (%)</Text>
            <TextInput
              placeholder="0.00"
              placeholderTextColor={colors.muted}
              value={formData.interestRate}
              onChangeText={(text) => setFormData({ ...formData, interestRate: text })}
              keyboardType="decimal-pad"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-4"
            />

            <Text className="text-foreground font-semibold mb-2">Fecha de Vencimiento</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.muted}
              value={formData.dueDate}
              onChangeText={(text) => setFormData({ ...formData, dueDate: text })}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-6"
            />

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setShowModal(false)}
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                className="flex-1 bg-surface rounded-lg py-4 items-center border border-border"
              >
                <Text className="text-foreground font-semibold">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleAddDebt}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.8 : 1 },
                  { backgroundColor: colors.error },
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
