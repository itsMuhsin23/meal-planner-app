import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, Alert
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useStore, groupByDay } from "../store/useStore";
import { DayMeals, MealItem, MealType } from "../types/models";

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, "MealPlan"> };

const MEAL_ICONS: Record<MealType, string> = {
  breakfast: "🌅", lunch: "☀️", dinner: "🌙", snack: "🍎"
};

function MealCard({ item, onSwap }: { item: MealItem | undefined; onSwap: () => void }) {
  if (!item) return null;
  const s = item.snapshot;
  return (
    <View style={styles.mealCard}>
      <View style={styles.mealRow}>
        <Text style={styles.mealIcon}>{MEAL_ICONS[item.mealType]}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.mealType}>{item.mealType.toUpperCase()}</Text>
          <Text style={styles.mealName}>{s.name}</Text>
          <Text style={styles.mealMeta}>
            🔥 {s.calories} cal  •  ⏱ {s.prepTime}m  •  💰 ${s.costPerServing.toFixed(2)}
          </Text>
          <Text style={styles.macros}>
            P {s.protein}g · C {s.carbs}g · F {s.fats}g
          </Text>
        </View>
        <TouchableOpacity style={styles.swapBtn} onPress={onSwap}>
          <Text style={styles.swapTxt}>🔄</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DayCard({ day, planId, onSwap }: { day: DayMeals; planId: string; onSwap: (d:number,t:string)=>void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.dayCard}>
      <TouchableOpacity style={styles.dayHeader} onPress={() => setExpanded(!expanded)}>
        <View>
          <Text style={styles.dayName}>{day.dayName}</Text>
          <Text style={styles.dayMeta}>
            🔥 {day.totalCal} cal  •  💰 ${day.totalCost.toFixed(2)}
          </Text>
        </View>
        <Text style={styles.chevron}>{expanded ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.mealsContainer}>
          {(["breakfast","lunch","dinner","snack"] as MealType[]).map((type) => (
            <MealCard
              key={type}
              item={day[type]}
              onSwap={() => onSwap(day.dayOfWeek, type)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default function MealPlanScreen({ navigation }: Props) {
  const { mealPlan, loading, error, fetchLatest, swapMeal, clearError } = useStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { if (!mealPlan) fetchLatest(); }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLatest();
    setRefreshing(false);
  };

  const handleSwap = (day: number, type: string) => {
    if (!mealPlan) return;
    Alert.alert("Swap Meal", `Replace ${type} on day ${day}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Swap", onPress: () => swapMeal(mealPlan._id, day, type) }
    ]);
  };

  if (loading && !mealPlan) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={G} />
        <Text style={styles.loadingTxt}>Building your meal plan…</Text>
      </View>
    );
  }

  if (!mealPlan) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>🍽️</Text>
        <Text style={styles.emptyTitle}>No meal plan yet</Text>
        <Text style={styles.emptySub}>Create your first plan to get started</Text>
        <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate("Input")}>
          <Text style={styles.createTxt}>Create Meal Plan</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const days = groupByDay(mealPlan);
  const w    = mealPlan.weeklyTotals;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={G} />}
    >
      {/* ── Header ────────────────────────── */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>🗓 Weekly Meal Plan</Text>
        <Text style={styles.headerSub}>
          {mealPlan.preferences.dailyCalories} cal/day • ${mealPlan.preferences.dailyBudget}/day
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>${w.cost.toFixed(0)}</Text>
            <Text style={styles.statKey}>Total Cost</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{mealPlan.avgDailyCalories}</Text>
            <Text style={styles.statKey}>Avg Cal/Day</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>${mealPlan.avgDailyCost}</Text>
            <Text style={styles.statKey}>Avg Cost/Day</Text>
          </View>
        </View>

        {/* Macro bar */}
        <View style={styles.macroRow}>
          <Text style={styles.macroItem}>🥩 Protein: {w.protein.toFixed(0)}g</Text>
          <Text style={styles.macroItem}>🍞 Carbs: {w.carbs.toFixed(0)}g</Text>
          <Text style={styles.macroItem}>🧈 Fats: {w.fats.toFixed(0)}g</Text>
        </View>
      </View>

      {/* ── Days ─────────────────────────── */}
      <Text style={styles.sectionTitle}>Tap a day to see meals</Text>
      {days.map((day) => (
        <DayCard key={day.dayOfWeek} day={day} planId={mealPlan._id} onSwap={handleSwap} />
      ))}

      {/* ── Actions ──────────────────────── */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: G }]} onPress={() => navigation.navigate("ShoppingList")}>
          <Text style={styles.actionTxt}>🛒 Shopping List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor:"#2196F3" }]} onPress={() => navigation.navigate("Input")}>
          <Text style={styles.actionTxt}>✨ New Plan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const G = "#4CAF50";
const styles = StyleSheet.create({
  container:      { flex:1, backgroundColor:"#f9fafb" },
  center:         { flex:1, alignItems:"center", justifyContent:"center", padding:30 },
  loadingTxt:     { marginTop:16, color:"#666", fontSize:15 },
  emptyIcon:      { fontSize:64, marginBottom:16 },
  emptyTitle:     { fontSize:22, fontWeight:"800", color:"#1a1a1a" },
  emptySub:       { fontSize:14, color:"#888", marginTop:6, marginBottom:24, textAlign:"center" },
  createBtn:      { backgroundColor:G, borderRadius:12, paddingHorizontal:32, paddingVertical:14 },
  createTxt:      { color:"#fff", fontWeight:"700", fontSize:15 },
  headerCard:     { backgroundColor:G, padding:20, paddingTop:50 },
  headerTitle:    { fontSize:22, fontWeight:"800", color:"#fff" },
  headerSub:      { color:"rgba(255,255,255,0.85)", fontSize:13, marginTop:2 },
  statsRow:       { flexDirection:"row", marginTop:16, gap:8 },
  statBox:        { flex:1, backgroundColor:"rgba(255,255,255,0.2)", borderRadius:10, padding:10, alignItems:"center" },
  statVal:        { fontSize:20, fontWeight:"800", color:"#fff" },
  statKey:        { fontSize:11, color:"rgba(255,255,255,0.8)", marginTop:2 },
  macroRow:       { flexDirection:"row", marginTop:12, justifyContent:"space-around" },
  macroItem:      { color:"rgba(255,255,255,0.9)", fontSize:12 },
  sectionTitle:   { fontSize:13, color:"#888", textAlign:"center", marginVertical:12 },
  dayCard:        { backgroundColor:"#fff", marginHorizontal:14, marginBottom:10, borderRadius:14, overflow:"hidden", elevation:2, shadowColor:"#000", shadowOpacity:0.06, shadowRadius:6 },
  dayHeader:      { flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:16 },
  dayName:        { fontSize:17, fontWeight:"700", color:"#222" },
  dayMeta:        { fontSize:13, color:"#666", marginTop:2 },
  chevron:        { fontSize:14, color:"#aaa" },
  mealsContainer: { borderTopWidth:1, borderTopColor:"#f0f0f0" },
  mealCard:       { padding:14, borderBottomWidth:1, borderBottomColor:"#f5f5f5" },
  mealRow:        { flexDirection:"row", alignItems:"flex-start", gap:12 },
  mealIcon:       { fontSize:22, marginTop:2 },
  mealType:       { fontSize:10, fontWeight:"700", color:"#aaa", letterSpacing:1 },
  mealName:       { fontSize:15, fontWeight:"600", color:"#222", marginTop:2 },
  mealMeta:       { fontSize:12, color:"#666", marginTop:4 },
  macros:         { fontSize:11, color:"#999", marginTop:2 },
  swapBtn:        { padding:8 },
  swapTxt:        { fontSize:20 },
  actionRow:      { flexDirection:"row", gap:12, margin:14 },
  actionBtn:      { flex:1, borderRadius:12, padding:16, alignItems:"center" },
  actionTxt:      { color:"#fff", fontWeight:"700", fontSize:15 }
});
