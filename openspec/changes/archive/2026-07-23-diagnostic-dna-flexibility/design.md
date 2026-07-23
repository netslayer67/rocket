## Context

The current narrative reviewer has useful anti-pattern checks, but two checks are too close to lexical rules: persona context is recognized from a small phrase list, and garment claims are treated as valid mainly when first-person experience is present. Generation also presents one reasoning sequence as if it were universal. Knowledge records have no compact diagnosis or evidence provenance, so retrieval can tell the model what failed but not why or how to repair it.

## Goals / Non-Goals

**Goals:**

- Keep reviewer decisions focused on context, evidence, and narrative diagnosis.
- Preserve ordinary vocabulary when a scene or reasoning supports it.
- Allow metadata-backed or explicitly hedged product observations.
- Store positive and negative lessons with reusable causes, fixes, and dimensions.
- Keep multiple narrative shapes available; the existing Observe → Wonder → Hypothesis → Reference → Open Question flow is guidance only.
- Make OpenSpec and Ponytail rules enforce these boundaries without adding runtime dependencies.

**Non-Goals:**

- No new classifier, detector package, embedding model, or UI.
- No raw thread, screenshot, URL content, or crawler output in knowledge metadata.
- No change to the manual approval boundary.

## Decisions

1. **Optional diagnosis fields.** Add `lessonType`, `diagnosis`, `rootCause`, `recommendedFix`, `failureDimensions`, and `evidenceSources` as optional Knowledge fields. Existing records remain valid; seed metadata and parser defaults provide compatibility.
2. **Context-aware persona check.** Only flag persona cosplay when persona-style vocabulary appears in a first-person draft without a concrete observation or reasoning cue. A word alone never blocks a draft.
3. **Evidence-aware product check.** Keep the small known claim detector, but permit claims supported by firsthand evidence, user-confirmed evidence, or reference metadata with a clear hedge. The evidence text is transient prompt context and is not persisted.
4. **Diverse structure.** Prompts describe several valid shapes and mark Observe → Wonder → Hypothesis → Reference → Open Question as preferred, never required. Reviewer checks outcomes such as voice, curiosity, coherence, and reference fit instead of sequence order.
5. **Minimal Ponytail boundary.** Reuse the existing reviewer and knowledge shapes. Narrow lexical heuristics stay documented with a `ponytail:` ceiling and are expanded only after a new reviewed example demonstrates the gap.

## Risks / Trade-offs

- **False negatives from narrow context heuristics** → keep the current blocking quality gates and add regression examples when a real miss appears.
- **Evidence metadata can be incomplete** → only allow hedged inferences from reference metadata; otherwise retain the blocking warning.
- **More DNA fields increase prompt size** → pass compact diagnosis fields only and retain the existing retrieval limit.
- **Legacy records lack lesson type** → interpret `Negative lesson` labels and naturalness ≤2 as negative during retrieval until all records are gradually enriched.
