export type Op = "add" | "sub" | "mul" | "div" | "pow" | "sqrt" | "percent"

export interface CalculateResult {
  result: number
  expression: string
}

const API_BASE = ""

export async function calculate(a: number, b: number, op: Op): Promise<CalculateResult> {
  const res = await fetch(`${API_BASE}/api/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ a, b, op }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }))
    throw new Error(err.detail || "Request failed")
  }

  return res.json()
}
