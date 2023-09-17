const express = require('express');
const puppeteer = require('puppeteer');
const { Readable } = require('stream'); // Import the Readable stream
const app = express();

app.use(express.json());

app.post('/convert-to-pdf', async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required in JSON format.' });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);

    const pdfBuffer = await page.pdf();

    await browser.close();

    // Set the response headers
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length); // Set content length

    // Use a Readable stream to send PDF data in chunks
    const stream = new Readable();
    stream.push(pdfBuffer);
    stream.push(null); // Signal the end of the stream

    stream.pipe(res);
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
