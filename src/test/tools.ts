
export function delay(time = 20) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
