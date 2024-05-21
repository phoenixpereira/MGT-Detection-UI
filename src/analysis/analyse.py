import os
import json
from nltk.tokenize import sent_tokenize, word_tokenize
from tqdm import tqdm


def count_words(text):
    return len(word_tokenize(text))


def count_sentences(text):
    return len(sent_tokenize(text))


def lexical_diversity(text):
    words = word_tokenize(text.lower())
    if len(words) == 0:
        return 0
    return round(len(set(words)) / len(words), 2)


def analyse_text(text):
    word_count = count_words(text)
    sentence_count = count_sentences(text)
    lex_diversity = lexical_diversity(text)

    if sentence_count == 0:
        average_word_count = 0
    else:
        average_word_count = round(word_count / sentence_count, 2)

    return {
        "average_word_count": average_word_count,
        "lexical_diversity": lex_diversity
    }


def export_to_json(file_name, stats):
    with open(file_name, mode='w', encoding='utf-8') as file:
        json.dump(stats, file, ensure_ascii=False, indent=4)


def create_frequency_ranges(stats, min_val, max_val):
    # Calculate the range size
    range_size = (max_val - min_val) / 50

    # Initialize the frequency ranges
    frequency_ranges = {}

    # Loop through the stats and assign each value to a range
    for stat in stats:
        # Calculate the range index for the current stat
        range_index = int((stat - min_val) / range_size)
        range_label = f"{round(min_val + range_index * range_size, 2)} - {round(min_val + (range_index + 1) * range_size, 2)}"
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

    for entry in tqdm(data, desc="Analysing dataset"):
        human_answers = entry["human_answers"]
        chatgpt_answers = entry["chatgpt_answers"]

        for answer in human_answers:
            analysis = analyse_text(answer)
            human_lex_diversity.append(analysis["lexical_diversity"])
            human_avg_sentence_length.append(analysis["average_word_count"])

        for answer in chatgpt_answers:
            analysis = analyse_text(answer)
            ai_lex_diversity.append(analysis["lexical_diversity"])
            ai_avg_sentence_length.append(analysis["average_word_count"])

    # Determine the minimum and maximum values from the combined stats for lexical diversity
    all_lex_diversity = human_lex_diversity + ai_lex_diversity
    lex_div_min_val = min(all_lex_diversity)
    lex_div_max_val = max(all_lex_diversity)

    # Determine the minimum and maximum values from the combined stats for average sentence length
    all_avg_sentence_length = human_avg_sentence_length + ai_avg_sentence_length
    avg_sent_len_min_val = min(all_avg_sentence_length)
    avg_sent_len_max_val = max(all_avg_sentence_length)

    # Create frequency ranges for lexical diversity
    human_lex_diversity_ranges = create_frequency_ranges(
        human_lex_diversity, lex_div_min_val, lex_div_max_val)
    ai_lex_diversity_ranges = create_frequency_ranges(
        ai_lex_diversity, lex_div_min_val, lex_div_max_val)

    # Create frequency ranges for average sentence length
    human_avg_sentence_length_ranges = create_frequency_ranges(
        human_avg_sentence_length, avg_sent_len_min_val, avg_sent_len_max_val)
    ai_avg_sentence_length_ranges = create_frequency_ranges(
        ai_avg_sentence_length, avg_sent_len_min_val, avg_sent_len_max_val)

    # Sort frequency ranges by keys in ascending order
    sorted_human_lex_diversity_ranges = dict(
        sorted(human_lex_diversity_ranges.items(), key=lambda item: item[0]))
    sorted_ai_lex_diversity_ranges = dict(
        sorted(ai_lex_diversity_ranges.items(), key=lambda item: item[0]))
    sorted_human_avg_sentence_length_ranges = dict(
        sorted(human_avg_sentence_length_ranges.items(), key=lambda item: item[0]))
    sorted_ai_avg_sentence_length_ranges = dict(
        sorted(ai_avg_sentence_length_ranges.items(), key=lambda item: item[0]))

    # Export sorted frequency ranges to JSON files
    export_to_json("human_lexical_diversity_ranges.json",
                   sorted_human_lex_diversity_ranges)
    export_to_json("ai_lexical_diversity_ranges.json",
                   sorted_ai_lex_diversity_ranges)
    export_to_json("human_avg_sentence_length_ranges.json",
                   sorted_human_avg_sentence_length_ranges)
    export_to_json("ai_avg_sentence_length_ranges.json",
                   sorted_ai_avg_sentence_length_ranges)


if __name__ == "__main__":
    main()
