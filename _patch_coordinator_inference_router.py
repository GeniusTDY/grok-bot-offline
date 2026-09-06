import io

path = "/tmp/gbrw/source/node-agent-coordinator/inference-router.ts"
src = io.open(path, "r", encoding="utf-8").read()

anchor = "export function shouldUseNativeCliProxyHost(provider: SandInferenceProvider, boxRuntime: SandBoxRuntime): boolean {"
assert src.count(anchor) == 1, "anchor not found"

addition = '''function transcriptTimestamp(entry: unknown): number {
  const value = asRecord(entry)?.timestampMs;
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function mergeInferenceRouterTranscriptEntries(
  remoteEntries: readonly unknown[],
  localEntries: readonly unknown[],
  limit: number,
): unknown[] {
  const idCounts = new Map<string, number>();
  return [...remoteEntries, ...localEntries]
    .map((entry, index) => ({ entry, index }))
    .sort((left, right) =>
      transcriptTimestamp(left.entry) - transcriptTimestamp(right.entry)
      || left.index - right.index,
    )
    .map(({ entry, index }) => {
      const record = asRecord(entry);
      const id = typeof record?.id === "string" ? record.id : "";
      if (id.length === 0) return entry;
      const occurrence = idCounts.get(id) ?? 0;
      idCounts.set(id, occurrence + 1);
      return occurrence === 0
        ? entry
        : {
            ...record,
            id: `${id}~${transcriptTimestamp(entry) || index}~${occurrence}`,
          };
    })
    .slice(-limit);
}

'''

src = src.replace(anchor, addition + anchor)
io.open(path, "w", encoding="utf-8").write(src)
print("coordinator inference-router.ts patched OK")