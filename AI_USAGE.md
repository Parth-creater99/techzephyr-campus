# AI Usage Declaration (Section 6 Compliance)

- **In-Product AI Layer (`/ai/parse-booking`, `/ai/explain`)**: Parses English/Hinglish venue requests and explains solver decisions.
- **Fallback Guarantee**: Includes a deterministic rule-based English/Hinglish parser so if external LLM APIs fail or have no key/credits, both natural-language parsing and manual booking forms work 100% offline.
- **Strict Validation Boundary**: The LLM NEVER decides whether a timetable, exam slot, or booking is valid. All validity checks and schedule generations are executed strictly by Google OR-Tools CP-SAT and deterministic Python constraint validators (`validator.py`).
- **Development AI Tools**: Cursor / Claude / Gemini used for UI scaffolding and FastAPI boilerplate.
