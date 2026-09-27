export function parseModelJsonObject(content: string): Record<string, unknown> {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)?.[1]?.trim();
  const candidates = [trimmed, fenced, jsonObjectSpan(trimmed)].filter((candidate): candidate is string => Boolean(candidate));

  for (const candidate of candidates) {
    try {
      const value = JSON.parse(candidate);
      if (value && typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>;
    } catch { /* Try the next bounded representation. */ }
  }
  throw new Error('Model response did not contain one JSON object');
}

function jsonObjectSpan(content: string) {
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  return start >= 0 && end > start ? content.slice(start, end + 1) : undefined;
}
