const express = require('express');
const multer = require('multer');
const OpenAI = require('openai');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(cors());
require('dotenv').config();

app.post('/analyzeImage', upload.single('image'), async (req, res) => {
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const image = req.file;

    const imageBuffer = fs.readFileSync(image.path);
    const imageBase64 = imageBuffer.toString('base64');
    const response = await openai.chat.completions.create({
        model:'gpt-4-vision-preview',
        messages:[
            {
                role: "user",
                content: [
                    {type:'text', text:'Describe this image to me'},
                    {
                        type:'image_url',
                        image_url: `data:${image.mimetype};base64,${imageBase64}`
                    }
                ]
            }
        ],
        max_tokens: 500,
    })
    console.log(response);
    res.json(response)
});

app.listen(8000, () => console.log('Server started on port 8000'));