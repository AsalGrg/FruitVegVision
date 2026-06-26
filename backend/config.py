"""Configuration: classes, calories, and color mapping."""
import colorsys
import os
CLASSES = [
    "egg", "banana", "cabbage", "watermelon", "broccoli", "cucumber", "tomato", "lemon",
    "strawberry", "orange", "carrot", "potato", "cauliflower", "bell_pepper", "grapes",
    "pineapple", "apple", "mango", "pear", "onion",
]

CALORIES = {
    "egg": 155,
    "banana": 89,
    "cabbage": 25,
    "watermelon": 30,
    "broccoli": 34,
    "cucumber": 15,
    "tomato": 18,
    "lemon": 29,
    "strawberry": 32,
    "orange": 47,
    "carrot": 41,
    "potato": 77,
    "cauliflower": 25,
    "bell_pepper": 31,
    "grapes": 69,
    "pineapple": 50,
    "apple": 52,
    "mango": 60,
    "pear": 57,
    "onion": 40,
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

MODEL_PATH = os.path.join(os.path.dirname(__file__), "best.pt")
