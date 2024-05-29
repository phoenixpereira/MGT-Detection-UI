import os
import json
import random
from nltk.tokenize import sent_tokenize, word_tokenize
from tqdm import tqdm

# Analysis functions
def count_words(text):
    return len(word_tokenize(text))


def count_sentences(text):
    return len(sent_tokenize(text))


def count_syllables(word):
    word = word.lower()
    syllable_count = 0
    vowels = "aeiouy"
    if word[0] in vowels:
        syllable_count += 1
    for index in range(1, len(word)):
        if word[index] in vowels and word[index - 1] not in vowels:
            syllable_count += 1
    if word.endswith("e"):
        syllable_count -= 1
    if syllable_count == 0:
        syllable_count = 1
    return syllable_count


def total_syllables(text):
    words = word_tokenize(text)
    return sum(count_syllables(word) for word in words)


def average_word_count(word_count, sentence_count):
    if sentence_count == 0:
        return 0
    return round(word_count / sentence_count, 2)


def lexical_diversity(words):
    if len(words) == 0:
        return 0
    return round(len(set(words)) / len(words), 2)


def flesch_kincaid_grade(word_count, sentence_count, syllable_count):
    if word_count == 0 or sentence_count == 0:
        return 0
    grade_level = 0.39 * (word_count / sentence_count) + \
        11.8 * (syllable_count / word_count) - 15.59
    # Ensure grade level is between 0 and 18
    return max(0, min(round(grade_level, 2), 18))


class TextAnalysis:
    def __init__(self, text):
        self.text = text
        self.words = word_tokenize(text)
        self.word_count = len(self.words)
        self.sentence_count = count_sentences(text)
        self.syllable_count = total_syllables(text)

    def analyze(self):
        return {
            "average_word_count": average_word_count(self.word_count, self.sentence_count),
            "lexical_diversity": lexical_diversity(self.words),
            "flesch_kincaid_grade": flesch_kincaid_grade(self.word_count, self.sentence_count, self.syllable_count)
        }


def export_to_json(file_name, data):
    with open(file_name, mode='w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)


def create_sorted_frequency_ranges(stats, min_val, max_val, range_size):
    frequency_ranges = {}
    for stat in stats:
        if stat > max_val:
            continue
        range_index = int((stat - min_val) / range_size)
        range_start = min_val + range_index * range_size
        range_label = f"{round(range_start, 2)}"
        frequency_ranges[range_label] = frequency_ranges.get(
            range_label, 0) + 1
    return dict(sorted(frequency_ranges.items(), key=lambda item: float(item[0])))


def process_responses(responses, desc):
    analyses = {"lexical_diversity": [],
                "average_word_count": [], "flesch_kincaid_grade": []}
    for answer in tqdm(responses, desc=desc):
        analysis = TextAnalysis(answer).analyze()
        for key, value in analysis.items():
            analyses[key].append(value)
    return analyses


def main():
    config = {
        "input_file": "all.jsonl",
        "output_file": "combined_analysis.json",
        "sample_size": 25000,
        "range_settings": {
            "lexical_diversity": {"min_val": 0, "max_val": 1.05, "range_size": 0.05},
            "average_word_count": {"min_val": 0, "max_val": 100, "range_size": 5},
            "flesch_kincaid_grade": {"min_val": 0, "max_val": 18, "range_size": 1},
        }
    }

    file_path = os.path.join(os.path.dirname(__file__), config["input_file"])
    with open(file_path, "r", encoding="utf-8") as file:
        data = [json.loads(line) for line in file]

    human_responses = [
        response for entry in data for response in entry["human_answers"]]
    ai_responses = [
        response for entry in data for response in entry["chatgpt_answers"]]

    human_selected = random.sample(human_responses, config["sample_size"])
    ai_selected = random.sample(ai_responses, config["sample_size"])

    human_analyses = process_responses(
        human_selected, "Analysing human responses")
    ai_analyses = process_responses(ai_selected, "Analysing AI responses")

    combined_data = {"human": {}, "ai": {}}
    for key, settings in config["range_settings"].items():
        combined_data["human"][key] = create_sorted_frequency_ranges(
            human_analyses[key], **settings)
        combined_data["ai"][key] = create_sorted_frequency_ranges(
            ai_analyses[key], **settings)

    export_to_json(config["output_file"], combined_data)


if __name__ == "__main__":
    main()
