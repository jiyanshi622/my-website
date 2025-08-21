// RAG Knowledge Assistant Functionality
document.addEventListener('DOMContentLoaded', function() {
    const questionInput = document.getElementById('questionInput');
    const askBtn = document.getElementById('askBtn');
    const chatMessages = document.getElementById('chatMessages');
    const quickQuestions = document.querySelectorAll('.quick-question');

    // Knowledge base content (simulated)
    const knowledgeBase = {
        'ai-basics': {
            title: 'AI Fundamentals Guide',
            content: {
                'artificial intelligence': 'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. AI systems can perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation.',
                'machine learning': 'Machine Learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. It uses algorithms to analyze data, identify patterns, and make predictions or decisions.',
                'neural networks': 'Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) that process information and can learn complex patterns in data.',
                'deep learning': 'Deep Learning is a subset of machine learning that uses neural networks with multiple layers (deep neural networks) to model and understand complex patterns in data.'
            }
        },
        'prompt-engineering': {
            title: 'Prompt Engineering Best Practices',
            content: {
                'prompt engineering': 'Prompt engineering is the practice of designing and optimizing input prompts to get better outputs from AI language models. It involves crafting clear, specific instructions that guide the AI to produce desired responses.',
                'best practices': 'Key prompt engineering best practices include: being specific and clear, providing context, using examples (few-shot learning), breaking complex tasks into steps, and iterating on prompts based on results.',
                'few-shot learning': 'Few-shot learning in prompt engineering involves providing a few examples of the desired input-output format to help the AI understand the task better.',
                'chain of thought': 'Chain of thought prompting encourages the AI to show its reasoning process step-by-step, leading to more accurate and explainable results.'
            }
        },
        'llm-guide': {
            title: 'Large Language Models Overview',
            content: {
                'large language models': 'Large Language Models (LLMs) are AI systems trained on vast amounts of text data to understand and generate human-like text. They can perform various language tasks including translation, summarization, question answering, and creative writing.',
                'transformers': 'Transformers are the architecture behind most modern LLMs. They use attention mechanisms to process sequences of data and understand relationships between different parts of the input.',
                'training process': 'LLMs are trained in two main phases: pre-training on large text datasets to learn language patterns, and fine-tuning on specific tasks or datasets to improve performance on particular applications.',
                'applications': 'LLMs have numerous applications including chatbots, content generation, code assistance, language translation, summarization, and question answering systems.',
                'limitations': 'LLM limitations include potential hallucinations (generating false information), bias from training data, lack of real-time knowledge updates, and high computational requirements.'
            }
        }
    };

    // Simulate RAG retrieval and generation
    function processQuestion(question) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = performRAG(question);
                resolve(result);
            }, 1500); // Simulate processing time
        });
    }

    function performRAG(question) {
        const queryLower = question.toLowerCase();
        let bestMatches = [];
        let relevanceScore = 0;

        // Search through knowledge base
        Object.keys(knowledgeBase).forEach(docId => {
            const doc = knowledgeBase[docId];
            Object.keys(doc.content).forEach(key => {
                const content = doc.content[key];
                
                // Simple keyword matching (in real RAG, this would be semantic similarity)
                const keyWords = key.split(' ');
                const contentWords = content.toLowerCase().split(' ');
                const questionWords = queryLower.split(' ');
                
                let score = 0;
                questionWords.forEach(word => {
                    if (key.includes(word)) score += 3;
                    if (contentWords.some(cWord => cWord.includes(word))) score += 1;
                });

                if (score > 0) {
                    bestMatches.push({
                        docId,
                        docTitle: doc.title,
                        key,
                        content,
                        score
                    });
                }
            });
        });

        // Sort by relevance
        bestMatches.sort((a, b) => b.score - a.score);
        
        if (bestMatches.length === 0) {
            return {
                answer: "I couldn't find relevant information in the knowledge base to answer your question. Please try asking about AI fundamentals, prompt engineering, or large language models.",
                citations: []
            };
        }

        // Generate answer based on top matches
        const topMatches = bestMatches.slice(0, 3);
        let answer = generateAnswer(question, topMatches);
        
        return {
            answer,
            citations: topMatches.map(match => ({
                source: match.docTitle,
                excerpt: match.content.substring(0, 100) + '...'
            }))
        };
    }

    function generateAnswer(question, matches) {
        const mainMatch = matches[0];
        let answer = mainMatch.content;

        // Add context from other relevant matches
        if (matches.length > 1) {
            const additionalInfo = matches.slice(1, 3).map(match => match.content).join(' ');
            if (additionalInfo.length > 0) {
                answer += ` Additionally, ${additionalInfo}`;
            }
        }

        // Make the answer more conversational
        const questionLower = question.toLowerCase();
        if (questionLower.includes('what is') || questionLower.includes('what are')) {
            return answer;
        } else if (questionLower.includes('how')) {
            return `Based on the available information: ${answer}`;
        } else {
            return `Here's what I found: ${answer}`;
        }
    }

    function addMessage(content, isUser = false, citations = []) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
        
        let citationsHtml = '';
        if (citations && citations.length > 0) {
            citationsHtml = `
                <div class="citations">
                    <h4>Sources:</h4>
                    ${citations.map((citation, index) => `
                        <div class="citation">
                            <strong>[${index + 1}] ${citation.source}</strong>
                            <p>${citation.excerpt}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        messageDiv.innerHTML = `
            <div class="message-avatar">${isUser ? '👤' : '🤖'}</div>
            <div class="message-content">
                <p>${content}</p>
                ${citationsHtml}
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleQuestion(question) {
        if (!question.trim()) return;

        // Add user message
        addMessage(question, true);
        
        // Clear input
        questionInput.value = '';
        
        // Show loading state
        askBtn.disabled = true;
        document.querySelector('.btn-text').style.display = 'none';
        document.querySelector('.btn-loading').style.display = 'inline';

        try {
            const result = await processQuestion(question);
            addMessage(result.answer, false, result.citations);
        } catch (error) {
            addMessage("I'm sorry, I encountered an error processing your question. Please try again.", false);
        } finally {
            // Reset button state
            askBtn.disabled = false;
            document.querySelector('.btn-text').style.display = 'inline';
            document.querySelector('.btn-loading').style.display = 'none';
        }
    }

    // Event listeners
    askBtn.addEventListener('click', () => {
        handleQuestion(questionInput.value);
    });

    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleQuestion(questionInput.value);
        }
    });

    quickQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.getAttribute('data-question');
            questionInput.value = question;
            handleQuestion(question);
        });
    });
});
