"""Configuration: classes, calories, and color mapping."""
import colorsys
import os

# 53 classes from the Ultralytics YOLO training run
CLASSES = [
    "tomato_raw", "apple_raw", "orange_raw", "potato_raw", "strawberry_raw",
    "mango_raw", "carrot_raw", "egg", "banana", "pear_raw",
    "watermelon_raw", "lemon_raw", "cucumber_raw", "cabbage", "pineapple_raw",
    "watermelon", "broccoli", "cucumber", "tomato", "lemon",
    "banana_group", "onion_raw", "broccoli_group", "grapes_raw", "strawberry",
    "carrot_group", "cabbage_group", "orange", "cucumber_group", "potato_group",
    "carrot", "potato", "strawberry_group", "tomato_group", "cauliflower",
    "bell_pepper", "mango_group", "grapes", "pineapple", "watermelon_group",
    "orange_group", "lemon_group", "apple", "mango", "banana_slice",
    "pineapple_group", "apple_group", "onion_group", "pear", "onion",
    "pear_group", "bell_pepper_group", "cauliflower_group"
]

# Calories per 100 g (or estimated per-item for *_group classes)
CALORIES = {
    "tomato_raw": 18,
    "apple_raw": 52,
    "orange_raw": 47,
    "potato_raw": 77,
    "strawberry_raw": 32,
    "mango_raw": 60,
    "carrot_raw": 41,
    "egg": 155,
    "banana": 89,
    "pear_raw": 57,
    "watermelon_raw": 30,
    "lemon_raw": 29,
    "cucumber_raw": 15,
    "cabbage": 25,
    "pineapple_raw": 50,
    "watermelon": 30,
    "broccoli": 34,
    "cucumber": 15,
    "tomato": 18,
    "lemon": 29,
    "banana_group": 178,
    "onion_raw": 40,
    "broccoli_group": 102,
    "grapes_raw": 69,
    "strawberry": 32,
    "carrot_group": 82,
    "cabbage_group": 75,
    "orange": 47,
    "cucumber_group": 45,
    "potato_group": 154,
    "carrot": 41,
    "potato": 77,
    "strawberry_group": 96,
    "tomato_group": 54,
    "cauliflower": 25,
    "bell_pepper": 31,
    "mango_group": 180,
    "grapes": 69,
    "pineapple": 50,
    "watermelon_group": 90,
    "orange_group": 94,
    "lemon_group": 58,
    "apple": 52,
    "mango": 60,
    "banana_slice": 89,
    "pineapple_group": 100,
    "apple_group": 104,
    "onion_group": 80,
    "pear": 57,
    "onion": 40,
    "pear_group": 114,
    "bell_pepper_group": 62,
    "cauliflower_group": 75,
}


def _generate_colors() -> dict:
    """Generate visually distinct HSL colors for every class."""
    colors = {}
    golden_ratio = 0.618033988749895
    for i, cls in enumerate(CLASSES):
        h = (i * golden_ratio) % 1.0
        # High saturation, medium lightness for visibility on dark *and* light backgrounds
        r, g, b = colorsys.hls_to_rgb(h, 0.55, 0.85)
        colors[cls] = f"#{int(r * 255):02x}{int(g * 255):02x}{int(b * 255):02x}"
    return colors


COLORS = _generate_colors()

MODEL_PATH = os.path.join(os.path.dirname(__file__), "last.pt")
