import json
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np


def read_stats(file_name):
    with open(file_name, 'r', encoding='utf-8') as file:
        return json.load(file)


def prepare_data(stats):
    values = []
    frequencies = []

    for range_label, frequency in stats.items():
        try:
            value = float(range_label)
            values.extend([value] * frequency)
            frequencies.append(frequency)
        except ValueError:
            print(f"Ignoring invalid range label: {range_label}")

    return np.array(values)


def plot_distribution(human_data, ai_data, title, ax):
    sns.kdeplot(human_data, label='Human', ax=ax, color='blue', fill=True)
    sns.kdeplot(ai_data, label='AI', ax=ax, color='red', fill=True)
    ax.set_title(title)
    ax.legend()


def main():
    # Read data from JSON file
    combined_data = read_stats('combined_analysis.json')

    # Extract necessary statistics
    human_lexical_diversity_stats = combined_data["human"]["lexical_diversity"]
    ai_lexical_diversity_stats = combined_data["ai"]["lexical_diversity"]
    human_avg_sentence_length_stats = combined_data["human"]["average_word_count"]
    ai_avg_sentence_length_stats = combined_data["ai"]["average_word_count"]
    human_fk_grade_stats = combined_data["human"]["flesch_kincaid_grade"]
    ai_fk_grade_stats = combined_data["ai"]["flesch_kincaid_grade"]

    # Prepare data for plotting
    human_lexical_diversity_data = prepare_data(human_lexical_diversity_stats)
    ai_lexical_diversity_data = prepare_data(ai_lexical_diversity_stats)
    human_avg_sentence_length_data = prepare_data(
        human_avg_sentence_length_stats)
    ai_avg_sentence_length_data = prepare_data(ai_avg_sentence_length_stats)
    human_fk_grade_data = prepare_data(human_fk_grade_stats)
    ai_fk_grade_data = prepare_data(ai_fk_grade_stats)

    # Plot distributions
    fig, axes = plt.subplots(1, 3, figsize=(27, 6))

    plot_distribution(human_lexical_diversity_data,
                      ai_lexical_diversity_data, 'Lexical Diversity', axes[0])
    plot_distribution(human_avg_sentence_length_data,
                      ai_avg_sentence_length_data, 'Average Sentence Length', axes[1])
    plot_distribution(human_fk_grade_data,
                      ai_fk_grade_data, 'Flesch-Kincaid Grade Level', axes[2])

    plt.tight_layout()
    plt.savefig('distribution_graphs.png')
    plt.show()


if __name__ == "__main__":
    main()
