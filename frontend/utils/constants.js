export const CLASSES = [
    "egg", "banana", "cabbage", "watermelon", "broccoli", "cucumber", "tomato", "lemon",
    "strawberry", "orange", "carrot", "potato", "cauliflower", "bell_pepper", "grapes",
    "pineapple", "apple", "mango", "pear", "onion",
]


export function generateColors() {
  const colors= {};

  const goldenRatio = 0.618033988749895;
  CLASSES.forEach((cls, i) => {
    const h = Math.round(((i * goldenRatio) % 1.0) * 360);
    colors[cls] = {
      border: `hsl(${h}, 85%, 55%)`,
      bg: `hsla(${h}, 65%, 32%, 0.45)`,
    };
  });
  return colors;
}