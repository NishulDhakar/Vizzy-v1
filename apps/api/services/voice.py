from services.llm import client


def transcribe(audio_bytes: bytes, filename: str = "recording.webm") -> str:
    result = client.audio.transcriptions.create(
        file=(filename, audio_bytes, "audio/webm"),
        model="whisper-large-v3-turbo",
    )
    return result.text
