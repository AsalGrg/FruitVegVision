export const CLASSES = [
  'tomato_raw', 'apple_raw', 'orange_raw', 'potato_raw', 'strawberry_raw',
  'mango_raw', 'carrot_raw', 'egg', 'banana', 'pear_raw',
  'watermelon_raw', 'lemon_raw', 'cucumber_raw', 'cabbage', 'pineapple_raw',
  'watermelon', 'broccoli', 'cucumber', 'tomato', 'lemon',
  'banana_group', 'onion_raw', 'broccoli_group', 'grapes_raw', 'strawberry',
  'carrot_group', 'cabbage_group', 'orange', 'cucumber_group', 'potato_group',
  'carrot', 'potato', 'strawberry_group', 'tomato_group', 'cauliflower',
  'bell_pepper', 'mango_group', 'grapes', 'pineapple', 'watermelon_group',
  'orange_group', 'lemon_group', 'apple', 'mango', 'banana_slice',
  'pineapple_group', 'apple_group', 'onion_group', 'pear', 'onion',
  'pear_group', 'bell_pepper_group', 'cauliflower_group',
];


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