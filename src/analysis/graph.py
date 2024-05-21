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
        start, end = map(float, range_label.split(' - '))
        mid_point = (start + end) / 2
        values.extend([mid_point] * frequency)
        frequencies.append(frequency)

    return np.array(values)


def plot_distribution(human_data, ai_data, title, ax):
    sns.kdeplot(human_data, label='Human', ax=ax, color='blue', fill=True)
    sns.kdeplot(ai_data, label='AI', ax=ax, color='red', fill=True)
    ax.set_title(title)
    ax.legend()


def main():
    # Read data from JSON files
    human_lexical_diversity_stats = read_stats(
        'human_lexical_diversity_ranges.json')
    ai_lexical_diversity_stats = read_stats('ai_lexical_diversity_ranges.json')
    human_avg_sentence_length_stats = read_stats(
        'human_avg_sentence_length_ranges.json')
    ai_avg_sentence_length_stats = read_stats(
        'ai_avg_sentence_length_ranges.json')

    # Prepare data for plotting
    human_lexical_diversity_data = prepare_data(human_lexical_diversity_stats)
    ai_lexical_diversity_data = prepare_data(ai_lexical_diversity_stats)
    human_avg_sentence_length_data = prepare_data(
        human_avg_sentence_length_stats)
    ai_avg_sentence_length_data = prepare_data(ai_avg_sentence_length_stats)

    # Plot distributions
    fig, axes = plt.subplots(1, 2, figsize=(18, 6))

    plot_distribution(human_lexical_diversity_data,
                      ai_lexical_diversity_data, 'Lexical Diversity', axes[0])
    plot_distribution(human_avg_sentence_length_data,
                      ai_avg_sentence_length_data, 'Average Sentence Length', axes[1])

    plt.tight_layout()
    plt.savefig('distribution_graphs.png')
    plt.show()


if __name__ == "__main__":
    main()
