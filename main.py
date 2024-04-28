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
        # Count the occurrences of 'machine-generated' label
        machine_generated_count = 0
        # Use the detector model to detect machine-generated text for each chunk
        for chunk in chunks:
            result = detector(chunk)
            # Get the label
            label = result[0]['label']
            if label == 'machine-generated':
                machine_generated_count += 1
        # Calculate the percentage of AI-generated text
        ai_generated_percentage = (machine_generated_count / len(chunks)) * 100
        return ai_generated_percentage
    else:
        return 0

iface = gr.Interface(
    fn=detect_mgt,
    inputs=["text", "file"],
    outputs="number",
    title="AI Generated Text Detector",
    description="Detect the percentage of AI-generated text in the input text."
)

iface.launch()
