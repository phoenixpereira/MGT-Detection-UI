import os
import json
import random
from nltk.tokenize import sent_tokenize, word_tokenize
from tqdm import tqdm


def count_words(text):
    return len(word_tokenize(text))


def count_sentences(text):
    return len(sent_tokenize(text))


def average_word_count(text):
    word_count = count_words(text)
    sentence_count = count_sentences(text)

    if sentence_count == 0:
        return 0

    return round(word_count / sentence_count, 2)


def lexical_diversity(text):
    words = word_tokenize(text.lower())
    if len(words) == 0:
        return 0
    return round(len(set(words)) / len(words), 2)


def analyse_text(text):
    avg_word_count = average_word_count(text)
    lex_diversity = lexical_diversity(text)

    return {
        "average_word_count": avg_word_count,
        "lexical_diversity": lex_diversity
    }


def export_to_json(file_name, stats):
    with open(file_name, mode='w', encoding='utf-8') as file:
        json.dump(stats, file, ensure_ascii=False, indent=4)


def create_frequency_ranges(stats, min_val, max_val, range_size):
    # Initialize the frequency ranges
    frequency_ranges = {}

    # Loop through the stats and assign each value to a range
    for stat in stats:
        # If the stat exceeds the maximum value, ignore it
        if stat > max_val:
            continue

        # Calculate the range index for the current stat
        range_index = int((stat - min_val) / range_size)
        range_start = min_val + range_index * range_size
        range_end = range_start + range_size
        range_label = f"{round(range_start, 2)} - {round(range_end, 2)}"

        if range_label not in frequency_ranges:
            frequency_ranges[range_label] = 1
        else:
            frequency_ranges[range_label] += 1

    return frequency_ranges


def main():
    file_path = os.path.join(os.path.dirname(__file__), "all.jsonl")
    with open(file_path, "r", encoding="utf-8") as file:
        data = [json.loads(line) for line in file]

    human_lex_diversity = []
    human_avg_sentence_length = []
    ai_lex_diversity = []
    ai_avg_sentence_length = []

    human_responses = []
    ai_responses = []

    # Separate human and AI responses
    for entry in data:
        human_answers = entry["human_answers"]
        chatgpt_answers = entry["chatgpt_answers"]

        human_responses.extend(human_answers)
        ai_responses.extend(chatgpt_answers)

    # Randomly select 25,000 entries for human and AI responses
    human_selected = random.sample(human_responses, 25000)
    ai_selected = random.sample(ai_responses, 25000)

    # Analyze human responses
    for answer in tqdm(human_selected, desc="Analysing human responses"):
        analysis = analyse_text(answer)
        human_lex_diversity.append(analysis["lexical_diversity"])
        human_avg_sentence_length.append(analysis["average_word_count"])

    # Analyze AI responses
    for answer in tqdm(ai_selected, desc="Analysing AI responses"):
        analysis = analyse_text(answer)
        ai_lex_diversity.append(analysis["lexical_diversity"])
        ai_avg_sentence_length.append(analysis["average_word_count"])

    # Range sizes for lexical diversity and average sentence length
    lex_div_range_size = 0.05
    avg_sent_len_range_size = 5

    # Create frequency ranges for lexical diversity
    human_lex_diversity_ranges = create_frequency_ranges(
        human_lex_diversity, 0, 1.05, lex_div_range_size)
    ai_lex_diversity_ranges = create_frequency_ranges(
        ai_lex_diversity, 0, 1.05, lex_div_range_size)

    # Create frequency ranges for average sentence length
    human_avg_sentence_length_ranges = create_frequency_ranges(
        human_avg_sentence_length, 0, 100, avg_sent_len_range_size)
    ai_avg_sentence_length_ranges = create_frequency_ranges(
        ai_avg_sentence_length, 0, 100, avg_sent_len_range_size)

    # Sort frequency ranges for lexical diversity
    sorted_human_lex_diversity_ranges = dict(sorted(
        human_lex_diversity_ranges.items(), key=lambda item: float(item[0].split()[0])))
    sorted_ai_lex_diversity_ranges = dict(sorted(
        ai_lex_diversity_ranges.items(), key=lambda item: float(item[0].split()[0])))

    # Sort frequency ranges for average sentence length
    sorted_human_avg_sentence_length_ranges = dict(sorted(
        human_avg_sentence_length_ranges.items(), key=lambda item: float(item[0].split()[0])))
    sorted_ai_avg_sentence_length_ranges = dict(sorted(
        ai_avg_sentence_length_ranges.items(), key=lambda item: float(item[0].split()[0])))

    # Combine all the analysis data into a single dictionary
    combined_data = {
        "human": {
            "lexical_diversity_ranges": sorted_human_lex_diversity_ranges,
            "avg_sentence_length_ranges": sorted_human_avg_sentence_length_ranges
        },
        "ai": {
            "lexical_diversity_ranges": sorted_ai_lex_diversity_ranges,
            "avg_sentence_length_ranges": sorted_ai_avg_sentence_length_ranges
        }
    }

    # Export combined data to a JSON file
    export_to_json("combined_analysis.json", combined_data)


if __name__ == "__main__":
    main()
