const textarea = document.querySelector('.input-field');
const responseContainer = document.querySelector('.response-container');
const helloDiv = document.querySelector('.hello');
const arrowButton = document.querySelector('button.fa-arrow-right');


const handleFormSubmission = async () => {
    const question = textarea.value.trim();
    if (question) {
        textarea.value = '';
        responseContainer.innerHTML = '';
        const responseElement = document.createElement('div');
        responseElement.classList.add('response');
        const skeleton = document.createElement('div');
        skeleton.classList.add('skeleton');
        responseElement.appendChild(skeleton);
        responseContainer.appendChild(responseElement);

        try {
            const response = await sendQuestionToGroq(question);
            responseElement.removeChild(skeleton);
            responseElement.textContent = response;
        } catch (error) {
            responseContainer.removeChild(responseElement);
            displayError(error.message);
        }
    }
};

textarea.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        await handleFormSubmission();
    }
});


arrowButton.addEventListener('click', async (e) => {
    e.preventDefault();
    await handleFormSubmission();
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
