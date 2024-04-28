import gradio as gr
from transformers import pipeline
from PyPDF2 import PdfReader

# Load the model for detecting MGT
detector = pipeline("text-classification", model="andreas122001/roberta-academic-detector")

def extract_text(pdf_file):
    # Open the PDF file
    with open(pdf_file.name, "rb") as f:
        # Create a PDF reader object
        reader = PdfReader(f)
        # Initialise an empty string to store text
        text = ""
        # Iterate through all the pages and extract text
        for page in reader.pages:
            text += page.extract_text()
    return text

def detect_mgt(text, pdf_file):
    if pdf_file:
        # If PDF file is uploaded, extract text from PDF
        text = extract_text(pdf_file)
    if text:
        # Split the text into chunks of maximum length accepted by the model
        chunk_size = 512
        chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
        # Initialise lists to store labels and scores
        labels = []
        scores = []
        # Use the detector model to detect machine-generated text for each chunk
        for chunk in chunks:
            result = detector(chunk)
            # Get the label and score
            label = result[0]['label']
            score = result[0]['score']
            labels.append(label)
            scores.append(score)
        return labels, scores
    else:
        return [], []

iface = gr.Interface(
    fn=detect_mgt,
    inputs=["text", "file"],
    outputs=["text", "number"],
    title="MGT Detector",
    description="Detect the probability of machine-generated text in the input text."
)

iface.launch()
