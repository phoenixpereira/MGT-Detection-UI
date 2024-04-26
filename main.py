import gradio as gr
from PyPDF2 import PdfReader

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

iface = gr.Interface(
    fn = extract_text,
    inputs="file",
    outputs="text",
    title="PDF Text Extractor",
    description="Upload a PDF file to extract its text."
)

iface.launch()
