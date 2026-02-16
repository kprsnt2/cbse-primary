// Vercel Serverless Function - Gemini API Proxy
// Handles worksheet generation requests

const GEMINI_MODEL = 'gemini-1.5-flash';
const REQUEST_TIMEOUT_MS = 60000;
const MAX_PROMPT_LENGTH = 100000;

async function callGemini(apiKey, prompt, signal) {
    return fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 8192,
                        responseMimeType: 'application/json',
                    },
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HARASSMENT',
                            threshold: 'BLOCK_NONE',
                        },
                        {
                            category: 'HARM_CATEGORY_HATE_SPEECH',
                            threshold: 'BLOCK_NONE',
                        },
                        {
                            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                            threshold: 'BLOCK_NONE',
                        },
                        {
                            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                            threshold: 'BLOCK_NONE',
                        },
                    ],
                }),
            signal,
        }
    );
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        if (typeof prompt !== 'string' || prompt.length > MAX_PROMPT_LENGTH) {
            return res.status(400).json({ error: `Prompt too long (max ${MAX_PROMPT_LENGTH} characters)` });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        let response;
        try {
            response = await callGemini(apiKey, prompt, controller.signal);
        } catch (err) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
                return res.status(504).json({ error: 'Request timed out. Please try again.' });
            }
            const isRetryable = err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED';
            if (isRetryable) {
                response = await callGemini(apiKey, prompt, new AbortController().signal);
            } else {
                throw err;
            }
        }
        clearTimeout(timeoutId);

        if (!response.ok) {
            const is5xx = response.status >= 500;
            if (is5xx) {
                const retryController = new AbortController();
                const retryTimeoutId = setTimeout(() => retryController.abort(), REQUEST_TIMEOUT_MS);
                try {
                    response = await callGemini(apiKey, prompt, retryController.signal);
                } finally {
                    clearTimeout(retryTimeoutId);
                }
            }
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Gemini API error:', errorText);
                return res.status(response.status).json({
                    error: `Gemini API error: ${response.status}`,
                    details: errorText
                });
            }
        }

        const data = await response.json();

        // Extract the generated text
        const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            return res.status(500).json({ error: 'No content generated', raw: data });
        }

        // Parse the JSON response
        let worksheetData;
        try {
            // Clean up the response - remove markdown code fences if present
            let cleanText = generatedText.trim();
            if (cleanText.startsWith('```json')) {
                cleanText = cleanText.slice(7);
            }
            if (cleanText.startsWith('```')) {
                cleanText = cleanText.slice(3);
            }
            if (cleanText.endsWith('```')) {
                cleanText = cleanText.slice(0, -3);
            }
            worksheetData = JSON.parse(cleanText.trim());
        } catch (parseError) {
            // If JSON parsing fails, return the raw text
            return res.status(200).json({
                raw: generatedText,
                parseError: 'Failed to parse as JSON, returning raw text'
            });
        }

        return res.status(200).json({ worksheet: worksheetData });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: error.message });
    }
}
