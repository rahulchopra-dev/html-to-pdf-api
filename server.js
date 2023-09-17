const express = require('express');
const PDFDocument = require('pdfkit');
const htmlToPdf = require('html-pdf'); // Import the html-pdf library
const { Readable } = require('stream');
const app = express();

app.use(express.json());

app.post('/convert-to-pdf', async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required in JSON format.' });
    }

    // Convert HTML to PDF using html-pdf
    htmlToPdf.create(html).toBuffer((err, pdfBuffer) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'PDF generation error.' });
      }

      // Set the response headers
      res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', pdfBuffer.length);

      // Use a Readable stream to send PDF data in chunks
      const stream = new Readable();
      stream.push(pdfBuffer);
      stream.push(null);

      stream.pipe(res);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
