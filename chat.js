const input = document.querySelector('input[type="text"]');
const container = document.querySelector('.container');

input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const question = input.value.trim();
        if (question) {
            input.value = '';
            const loadingIndicator = document.createElement('div');
            loadingIndicator.textContent = 'Loading...';
            container.appendChild(loadingIndicator);

            try {
                const response = await sendQuestionToGroq(question);
                container.removeChild(loadingIndicator);
                displayResponse(response);
            } catch (error) {
                container.removeChild(loadingIndicator);
                displayError(error.message);
            }
        }
    }
});

async function sendQuestionToGroq(question) {
    const apiEndpoint = 'https://api.groq.com/openai/v1/chat/completions';
    const apiKey = ''; //your api key

    const requestBody = {
        model: 'llama3-8b-8192',
        messages: [
            {
                role: 'user',
                content: question
            }
        ],
        max_tokens: 500
    };

    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed with status ${response.status}: ${errorData.error.message}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

function displayResponse(response) {
    const responseElement = document.createElement('div');
    responseElement.classList.add('response');
    responseElement.textContent = response;
    container.appendChild(responseElement);
}

function displayError(errorMessage) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('error');
    errorElement.textContent = `Error: ${errorMessage}`;
    container.appendChild(errorElement);
}
