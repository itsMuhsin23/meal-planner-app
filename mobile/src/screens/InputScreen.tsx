import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useStore } from "../store/useStore";

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, "Input"> };

const DIETARY_OPTIONS = ["none","vegetarian","vegan","gluten-free","dairy-free","keto","paleo"];

const CALORIE_PRESETS = [
  { label: "Light\n1500 cal",   value: 1500 },
  { label: "Moderate\n2000 cal",value: 2000 },
  { label: "Active\n2500 cal",  value: 2500 },
  { label: "Athlete\n3000 cal", value: 3000 }
];

export default function InputScreen({ navigation }: Props) {
  const { generate, loading } = useStore();

  const [calories,     setCalories]     = useState("2000");
  const [budget,       setBudget]       = useState("15");
  const [dietary,      setDietary]      = useState("none");
  const [calPreset,    setCalPreset]    = useState(2000);

  const handleGenerate = async () => {
    const cal = Number(calories);
    const bud = Number(budget);

    if (isNaN(cal) || cal < 1200 || cal > 5000) {
      return Alert.alert("Invalid Calories", "Enter a value between 1200 and 5000.");
    }
    if (isNaN(bud) || bud < 5 || bud > 100) {
      return Alert.alert("Invalid Budget", "Enter a daily budget between $5 and $100.");
    }

    await generate({ dailyCalories: cal, dailyBudget: bud, dietaryPreference: dietary });
    navigation.navigate("MealPlan");
  };

  const selectPreset = (val: number) => {
    setCalPreset(val);
    setCalories(String(val));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>🥗 Create Meal Plan</Text>
      <Text style={styles.sub}>Tell us your goals and we'll build your week</Text>

      {/* ── Daily Calories ─────────────────────────── */}
      <Text style={styles.label}>Daily Calories Goal</Text>
      <View style={styles.presetRow}>
        {CALORIE_PRESETS.map((p) => (
          <TouchableOpacity
            key={p.value}
            style={[styles.presetBtn, calPreset === p.value && styles.presetActive]}
            onPress={() => selectPreset(p.value)}
          >
            <Text style={[styles.presetTxt, calPreset === p.value && styles.presetTxtActive]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        value={calories}
        onChangeText={(v) => { setCalories(v); setCalPreset(0); }}
        keyboardType="numeric"
        placeholder="Or enter custom calories (1200–5000)"
        placeholderTextColor="#aaa"
      />

      {/* ── Daily Budget ───────────────────────────── */}
      <Text style={styles.label}>Daily Budget (USD)</Text>
      <TextInput
        style={styles.input}
        value={budget}
        onChangeText={setBudget}
        keyboardType="decimal-pad"
        placeholder="e.g. 15 (min $5, max $100)"
        placeholderTextColor="#aaa"
      />

      {/* ── Dietary Preference ─────────────────────── */}
      <Text style={styles.label}>Dietary Preference</Text>
      <View style={styles.tagRow}>
        {DIETARY_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.tag, dietary === opt && styles.tagActive]}
            onPress={() => setDietary(opt)}
          >
            <Text style={[styles.tagTxt, dietary === opt && styles.tagTxtActive]}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Summary card ──────────────────────────── */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📋 Your Plan Summary</Text>
        <Text style={styles.summaryLine}>🔥 {calories} calories/day</Text>
        <Text style={styles.summaryLine}>💰 ${budget}/day · ${(Number(budget)*7).toFixed(0)}/week</Text>
        <Text style={styles.summaryLine}>🥑 {dietary.charAt(0).toUpperCase()+dietary.slice(1)} diet</Text>
        <Text style={styles.summaryLine}>📅 7 days · 28 meals total</Text>
      </View>

      {/* ── Generate Button ────────────────────────── */}
      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={handleGenerate}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnTxt}>✨ Generate My Meal Plan</Text>
        }
      </TouchableOpacity>

      {/* ── Go to existing plan ────────────────────── */}
      <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate("MealPlan")}>
        <Text style={styles.linkTxt}>View existing meal plan →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const G = "#4CAF50";
const styles = StyleSheet.create({
  container:      { flex:1, backgroundColor:"#f9fafb", padding:20 },
  header:         { fontSize:26, fontWeight:"800", color:"#1a1a1a", marginTop:10 },
  sub:            { fontSize:14, color:"#666", marginBottom:24 },
  label:          { fontSize:15, fontWeight:"700", color:"#333", marginBottom:8, marginTop:18 },
  input:          { backgroundColor:"#fff", borderWidth:1, borderColor:"#ddd", borderRadius:10, padding:14, fontSize:15, color:"#222" },
  presetRow:      { flexDirection:"row", gap:8, marginBottom:10 },
  presetBtn:      { flex:1, backgroundColor:"#fff", borderWidth:1, borderColor:"#ddd", borderRadius:10, padding:10, alignItems:"center" },
  presetActive:   { backgroundColor:G, borderColor:G },
  presetTxt:      { fontSize:11, textAlign:"center", color:"#555" },
  presetTxtActive:{ color:"#fff", fontWeight:"700" },
  tagRow:         { flexDirection:"row", flexWrap:"wrap", gap:8 },
  tag:            { backgroundColor:"#fff", borderWidth:1, borderColor:"#ddd", borderRadius:20, paddingHorizontal:14, paddingVertical:8 },
  tagActive:      { backgroundColor:G, borderColor:G },
  tagTxt:         { fontSize:13, color:"#555" },
  tagTxtActive:   { color:"#fff", fontWeight:"700" },
  summaryCard:    { backgroundColor:"#E8F5E9", borderRadius:12, padding:16, marginTop:24, gap:6 },
  summaryTitle:   { fontWeight:"800", fontSize:15, marginBottom:4, color:"#2e7d32" },
  summaryLine:    { fontSize:14, color:"#333" },
  btn:            { backgroundColor:G, borderRadius:14, padding:18, alignItems:"center", marginTop:24 },
  btnDisabled:    { opacity:0.6 },
  btnTxt:         { color:"#fff", fontWeight:"800", fontSize:16 },
  linkBtn:        { alignItems:"center", marginTop:16 },
  linkTxt:        { color:G, fontSize:14 }
});
