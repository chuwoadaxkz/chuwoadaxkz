// Code by @AzR_projects

import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: '❌ Method not allowed. Use GET request.' });
    }

    const text = (req.query.text || '').trim();

    if (!text) {
        return res.status(400).json({ error: '⚠️ Missing text input. Please provide a valid query.' });
    }

    const url = 'https://api.deepinfra.com/v1/openai/chat/completions';
    const payload = {
        model: 'deepseek-ai/DeepSeek-R1',
        messages: [
            { role: 'system', content: 'Be a helpful assistant' },
            { role: 'user', content: text }
        ],
        stream: false
    };

    try {
        const response = await axios.post(url, payload, {
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' }
        });

        if (!response.data || !response.data.choices) {
            return res.status(500).json({ error: '⚠️ Unexpected response format from API.' });
        }

        return res.json({
            credit: '@AzR_projects',
            response: response.data.choices[0].message.content
        });

    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json({ 
                error: `❌ HTTP Error: ${error.response.status} - API issue detected.` 
            });
        } else {
            return res.status(500).json({ error: '🚨 API is unreachable. Try again later.' });
        }
    }
}

