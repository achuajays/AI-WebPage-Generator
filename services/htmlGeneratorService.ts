
const API_URL = 'https://aiapi-production-b62b.up.railway.app/query/';

export const generateHtmlFromText = async (prompt: string, customization?: { pattern?: string | null; palette?: string[] | null }): Promise<string> => {
    let customizationInstructions = '';
    if (customization?.pattern) {
        customizationInstructions += `\n- **Design Pattern:** The user has chosen a '${customization.pattern}' layout. Structure the page accordingly.`;
    }
    if (customization?.palette && customization.palette.length > 0) {
        const paletteString = customization.palette.join(', ');
        customizationInstructions += `\n- **Color Palette:** The user has selected a color palette. The design MUST prominently use these colors: ${paletteString}. Prioritize them for backgrounds, buttons, and text.`;
    }

    const fullPrompt = `Based on the following user request, generate a complete, single-file HTML document using Tailwind CSS.

**Instructions:**
1.  **Structure:** The response MUST be a single, complete, and well-formed HTML document, starting with \`<!DOCTYPE html>\` and enclosed in \`<html>\` tags.
2.  **Tailwind CSS:**
    *   You MUST use Tailwind CSS classes directly on the HTML elements for all styling.
    *   Do NOT include a \`<style>\` tag with custom CSS. All styling must be done with Tailwind utility classes.
    *   You MUST include the Tailwind CSS CDN script in the \`<head>\` section: \`<script src="https://cdn.tailwindcss.com"></script>\`.
3.  **Content Size & Style:**
    *   The design should be modern, professional, and aesthetically pleasing.
    *   If the user's request does NOT specify a size, length, or conciseness (e.g., "short", "brief", "summary"), generate a rich, detailed, and comprehensive page. Make it as "big" and full of relevant content as possible.
    *   If the user's request *does* mention a specific length, respect that preference.
4.  **Content:**
    *   The \`<head>\` must include a relevant \`<title>\`.
    *   The \`<body>\` should contain the structured, styled content as described by the user request below.
${customizationInstructions ? `\n**Customization Directives:**${customizationInstructions}` : ''}

**User Request:** "${prompt}"`;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: fullPrompt,
                model: 'moonshotai/kimi-k2-instruct',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
            throw new Error(`API Error: ${response.statusText} - ${errorData.detail || 'Unknown error'}`);
        }

        const data = await response.json();
        
        let htmlContent = data.response ?? data.answer ?? data.result ?? null;

        if (htmlContent === null && typeof data === 'string') {
            htmlContent = data;
        }

        if (typeof htmlContent !== 'string') {
            console.error("Unexpected API response structure:", data);
            throw new Error("Could not parse the generated HTML from the API response.");
        }
        
        if (htmlContent.startsWith('```html')) {
            htmlContent = htmlContent.substring(7);
        }
        if (htmlContent.endsWith('```')) {
            htmlContent = htmlContent.slice(0, -3);
        }
        
        return htmlContent.trim();

    } catch (error) {
        console.error('Failed to generate HTML:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate HTML: ${error.message}`);
        }
        throw new Error('An unknown error occurred while generating HTML.');
    }
};


export const editHtmlFromText = async (currentHtml: string, prompt: string): Promise<string> => {
    const fullPrompt = `You are an expert web developer who modifies HTML code based on user instructions.

**Task:**
Modify the provided HTML document according to the user's request.

**Instructions:**
1.  **Input:** You will receive an existing HTML document and a modification request.
2.  **Output:** You MUST return only the *complete, new, single-file HTML document*. Do not provide explanations, comments, or apologies. The output must be pure HTML code starting with \`<!DOCTYPE html>\`.
3.  **Styling:** Continue to use Tailwind CSS classes for any new or modified elements. Ensure the Tailwind CDN script remains in the \`<head>\`.
4.  **Preservation:** Preserve the original structure and content as much as possible, only making changes as requested by the user.

**Existing HTML Document:**
\`\`\`html
${currentHtml}
\`\`\`

**User's Modification Request:** "${prompt}"`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: fullPrompt,
                model: 'moonshotai/kimi-k2-instruct',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
            throw new Error(`API Error: ${response.statusText} - ${errorData.detail || 'Unknown error'}`);
        }

        const data = await response.json();
        
        let htmlContent = data.response ?? data.answer ?? data.result ?? null;

        if (htmlContent === null && typeof data === 'string') {
            htmlContent = data;
        }

        if (typeof htmlContent !== 'string') {
            console.error("Unexpected API response structure:", data);
            throw new Error("Could not parse the generated HTML from the API response.");
        }
        
        if (htmlContent.startsWith('```html')) {
            htmlContent = htmlContent.substring(7);
        }
        if (htmlContent.endsWith('```')) {
            htmlContent = htmlContent.slice(0, -3);
        }
        
        return htmlContent.trim();

    } catch (error) {
        console.error('Failed to edit HTML:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to edit HTML: ${error.message}`);
        }
        throw new Error('An unknown error occurred while editing HTML.');
    }
};