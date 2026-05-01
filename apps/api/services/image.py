from urllib.parse import quote


def generate_image(prompt: str, count: int = 4) -> list[str]:
    encoded = quote(prompt)
    return [
        f"https://image.pollinations.ai/prompt/{encoded}?seed={i}&width=512&height=512&nologo=true&model=flux"
        for i in range(count)
    ]
