// Seeded PRNG for stable mock data
let seed = 20260517;
export function srand(s?: number) {
  if (s !== undefined) seed = s;
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
export function rand(min: number, max: number) {
  return min + srand() * (max - min);
}
export function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}
export function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}
