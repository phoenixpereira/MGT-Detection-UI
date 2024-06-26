# Machine Generated Text (MGT) Detector UI
This project is a machine-generated text detector that uses multiple existing MGT detection models through the Hugging Face API and text statistics to determine if text is machine-generated or not. It combines the power of various models and statistical analysis to make more accurate predictions regarding the origin of the text.

## Getting Started

To analyse the dataset and generate statistics required for the graphs , please follow these steps:

1. Go to the `analysis` folder

```bash
cd src/analysis
```

2. Run `analysis.py` to generate `combined_analysis.json`

```bash
python3 analysis.py
```

3. Run `graph.py` to verify that the results look valid (Optional)

```bash
python3 graph.py
```

3. Move `combined_analysis.json` to the `public` folder if updated.

To run the user interface, please follow these steps:

1. Install the dependencies.

```bash
pnpm install
```

2. Copy `.env.local.example` to a new file `.env.local` and add your Hugging Face API key.

3. Run the development server.

```bash
pnpm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the UI.
