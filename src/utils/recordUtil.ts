export function getRecordEntries<K extends keyof any, V>(
  record: Record<K, V>,
): [K, V][] {
  return Object.entries(record) as unknown as [K, V][];
}

export type PropertyReplacer = (
  key: string | symbol,
  value: unknown,
) => [string | symbol, unknown] | [string | symbol, unknown][];

export function replacePropertiesDeeply<T>(
  object: T,
  getReplacement: PropertyReplacer,
): T {
  if (typeof object === "string") {
    return object;
  }
  if (typeof object !== "object" || object === null) {
    return object;
  }
  if (Array.isArray(object)) {
    return object.map((element) =>
      replacePropertiesDeeply<any>(element, getReplacement),
    ) as any;
  }
  if (object instanceof Map) {
    const newMap = new Map();
    for (const [key, value] of object) {
      const newKey = key;
      const newValue = replacePropertiesDeeply(value, getReplacement);
      newMap.set(newKey, newValue);
    }
    return newMap as any;
  }
  if (object instanceof Set) {
    const newSet = new Set();
    for (const value of object) {
      const newValue = replacePropertiesDeeply(value, getReplacement);
      newSet.add(newValue);
    }
    return newSet as any;
  }

  // assertAlways(object instanceof Object);
  const newObject: any = {};
  function handleReplacementEntry(
    oldKey: string | symbol,
    oldValue: unknown,
    newKey: string | symbol,
    newValue: unknown,
  ) {
    if (newKey === oldKey && newValue === oldValue) {
      newObject[newKey] = replacePropertiesDeeply(oldValue, getReplacement);
    } else {
      newObject[newKey] = newValue;
    }
  }
  for (const [key, value] of getRecordEntries(object as any)) {
    const replacement = getReplacement(key as string | symbol, value);
    if (replacement.length === 2 && typeof replacement[0] === "string") {
      handleReplacementEntry(
        key as string | symbol,
        value,
        replacement[0],
        replacement[1],
      );
    } else {
      for (const [newKey, newValue] of replacement as [
        string | symbol,
        unknown,
      ][]) {
        handleReplacementEntry(key as string | symbol, value, newKey, newValue);
      }
    }
  }
  return newObject;
}

export function removeUndefinedValuesOnRecord<K extends keyof any, V>(
  record: Record<K, V | undefined>,
): Record<K, V> {
  const newRecord = {} as Record<K, V>;
  for (const [key, value] of getRecordEntries(record)) {
    if (value === undefined) {
      continue;
    }
    newRecord[key] = value;
  }
  return newRecord;
}
