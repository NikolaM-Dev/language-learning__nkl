import sys

# See https://github.com/SYSTRAN/faster-whisper
from faster_whisper import WhisperModel


def get_args() -> str:
    """
    Purpose: Get args
    """
    args = sys.argv[1:]  # Slice to exclude the script name itself

    return args[0]


# end def


def get_model() -> WhisperModel:
    """
    Purpose: Get the WhisperModel to performe the transcription, currently it's
    using CPU, but would be a massive improvement to add support for GPU.
    """
    MODEL_SIZE = "medium" # small, medium, large

    # Run on GPU with FP16
    # model = WhisperModel(model_size, device="cuda", compute_type="float16")

    # or run on GPU with INT8
    # model = WhisperModel(model_size, device="cuda", compute_type="int8_float16")
    # or run on CPU with INT8
    model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
    return model


# end def


def main():
    """
    Purpose: Boostrap and run the whisper module.
    """

    audio = get_args()
    transcription_filename = audio.replace("wav", "txt").replace("mp3", "txt")
    model = get_model()

    segments, _ = model.transcribe(audio, beam_size=5)
    transcription = ""

    # Stream transcrption
    for segment in segments:
        print(segment.text)
        transcription += segment.text + "\n"

    file = open(transcription_filename, "w")  # open in write mode 'w'
    file.write(transcription)
    file.close()
    print(f"Transcription is also save into {transcription_filename}")


# end def

if __name__ == "__main__":
    main()

# end main
