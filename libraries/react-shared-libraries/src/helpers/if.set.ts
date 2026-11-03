// Kaido (I14b): Prop nur übergeben, wenn der Wert gesetzt ist. Leere Werte füllt
// VariableContextComponent mit den Vorgaben auf; so stehen ungenutzte Dienste nicht im Seitenquelltext.
export const ifSet = <K extends string, V>(key: K, value: V) =>
  (value ? { [key]: value } : {}) as Partial<Record<K, V>>;
