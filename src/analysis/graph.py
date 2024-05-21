import json
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

def read_stats(file_name):
    with open(file_name, 'r', encoding='utf-8') as file:
        return json.load(file)

def plot_distribution(human_stats, ai_stats, column_name, ax):
    human_values = np.array([float(stat[column_name]) for stat in human_stats])
    ai_values = np.array([float(stat[column_name]) for stat in ai_stats])

    sns.kdeplot(human_values, label='Human', ax=ax, color='blue', fill=True)
    sns.kdeplot(ai_values, label='AI', ax=ax, color='red', fill=True)
    ax.set_title(f'Distribution of {column_name}')
    ax.legend()

def main():
    human_stats = read_stats('human_stats.json')
    ai_stats = read_stats('ai_stats.json')

    # Plot distributions
    fig, axes = plt.subplots(1, 2, figsize=(18, 6))

    plot_distribution(human_stats, ai_stats, 'average_word_count', axes[0])
    plot_distribution(human_stats, ai_stats, 'lexical_diversity', axes[1])

    plt.tight_layout()
    plt.savefig('distribution_graphs.png')
    plt.show()

if __name__ == "__main__":
    main()
