export function assertNoEmDash(text: string): void {
  if (text.includes("—")) {
    throw new Error(`Text contains a forbidden em dash: "${text}"`);
  }
}
