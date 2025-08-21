// Content Ideation Tool Functionality
document.addEventListener('DOMContentLoaded', function() {
    const topicInput = document.getElementById('topicInput');
    const contentType = document.getElementById('contentType');
    const audienceLevel = document.getElementById('audienceLevel');
    const contentLength = document.getElementById('contentLength');
    const toneStyle = document.getElementById('toneStyle');
    const additionalNotes = document.getElementById('additionalNotes');
    const generateBtn = document.getElementById('generateBtn');
    const contentOutput = document.getElementById('contentOutput');
    const outputActions = document.querySelector('.output-actions');
    const templateCards = document.querySelectorAll('.template-card');

    // Template data
    const templates = {
        'tech-tutorial': {
            topic: 'Building a REST API with Node.js',
            type: 'tutorial',
            audience: 'intermediate',
            length: 'medium',
            tone: 'educational'
        },
        'ai-explainer': {
            topic: 'How Neural Networks Learn',
            type: 'blog',
            audience: 'beginner',
            length: 'medium',
            tone: 'conversational'
        },
        'project-showcase': {
            topic: 'My AI-Powered Web Application',
            type: 'video',
            audience: 'mixed',
            length: 'short',
            tone: 'casual'
        },
        'career-advice': {
            topic: 'Breaking into AI and Machine Learning',
            type: 'blog',
            audience: 'beginner',
            length: 'long',
            tone: 'professional'
        }
    };

    // Content generation logic
    function generateContentIdeas(params) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const ideas = createContentOutline(params);
                resolve(ideas);
            }, 2000);
        });
    }

    function createContentOutline(params) {
        const { topic, type, audience, length, tone, notes } = params;
        
        // Generate title variations
        const titles = generateTitles(topic, type, audience);
        
        // Generate outline based on content type
        const outline = generateOutline(topic, type, audience, length);
        
        // Generate key points
        const keyPoints = generateKeyPoints(topic, audience);
        
        // Generate engagement strategies
        const engagement = generateEngagementStrategies(type, audience, tone);
        
        return {
            titles,
            outline,
            keyPoints,
            engagement,
            additionalSuggestions: generateAdditionalSuggestions(topic, type, notes)
        };
    }

    function generateTitles(topic, type, audience) {
        const titleTemplates = {
            blog: [
                `The Complete Guide to ${topic}`,
                `${topic}: Everything You Need to Know`,
                `Mastering ${topic} in 2025`,
                `${topic} Explained Simply`
            ],
            video: [
                `${topic} - Full Tutorial`,
                `Learn ${topic} in 20 Minutes`,
                `${topic}: Step-by-Step Guide`,
                `${topic} for Beginners`
            ],
            tutorial: [
                `How to ${topic}: Step-by-Step Tutorial`,
                `${topic}: A Practical Guide`,
                `Building ${topic} from Scratch`,
                `${topic}: Hands-On Tutorial`
            ],
            presentation: [
                `${topic}: Key Concepts and Applications`,
                `Understanding ${topic}`,
                `${topic}: From Theory to Practice`,
                `${topic} Overview and Best Practices`
            ]
        };

        return titleTemplates[type] || titleTemplates.blog;
    }

    function generateOutline(topic, type, audience, length) {
        const baseOutline = {
            introduction: `Introduction to ${topic}`,
            mainSections: [],
            conclusion: 'Conclusion and Next Steps'
        };

        // Customize based on content type
        switch(type) {
            case 'tutorial':
                baseOutline.mainSections = [
                    'Prerequisites and Setup',
                    'Step 1: Getting Started',
                    'Step 2: Core Implementation',
                    'Step 3: Advanced Features',
                    'Testing and Debugging',
                    'Best Practices and Tips'
                ];
                break;
            case 'video':
                baseOutline.mainSections = [
                    'Quick Overview',
                    'Main Demonstration',
                    'Key Takeaways',
                    'Resources and Links'
                ];
                break;
            case 'blog':
                baseOutline.mainSections = [
                    `What is ${topic}?`,
                    'Why It Matters',
                    'How It Works',
                    'Real-World Applications',
                    'Getting Started'
                ];
                break;
            case 'presentation':
                baseOutline.mainSections = [
                    'Problem Statement',
                    'Solution Overview',
                    'Technical Details',
                    'Benefits and Impact',
                    'Implementation Strategy'
                ];
                break;
            default:
                baseOutline.mainSections = [
                    'Overview',
                    'Key Concepts',
                    'Practical Examples',
                    'Best Practices'
                ];
        }

        // Adjust for length
        if (length === 'short') {
            baseOutline.mainSections = baseOutline.mainSections.slice(0, 3);
        } else if (length === 'long') {
            baseOutline.mainSections.push('Advanced Topics', 'Common Pitfalls', 'Future Considerations');
        }

        return baseOutline;
    }

    function generateKeyPoints(topic, audience) {
        const points = [
            `Define ${topic} in simple terms`,
            'Explain the core benefits and use cases',
            'Provide practical examples',
            'Address common questions and concerns'
        ];

        if (audience === 'beginner') {
            points.unshift('Start with basic concepts and terminology');
            points.push('Provide additional resources for learning');
        } else if (audience === 'advanced') {
            points.push('Discuss advanced techniques and optimizations');
            points.push('Compare with alternative approaches');
        }

        return points;
    }

    function generateEngagementStrategies(type, audience, tone) {
        const strategies = [];

        // Type-specific strategies
        switch(type) {
            case 'video':
                strategies.push('Use visual demonstrations and screen recordings');
                strategies.push('Include timestamps for easy navigation');
                break;
            case 'blog':
                strategies.push('Use subheadings and bullet points for readability');
                strategies.push('Include code examples and screenshots');
                break;
            case 'tutorial':
                strategies.push('Provide downloadable resources and code');
                strategies.push('Include checkpoint summaries');
                break;
        }

        // Audience-specific strategies
        if (audience === 'beginner') {
            strategies.push('Define technical terms clearly');
            strategies.push('Use analogies and real-world comparisons');
        } else if (audience === 'advanced') {
            strategies.push('Focus on implementation details');
            strategies.push('Discuss performance considerations');
        }

        // Tone-specific strategies
        if (tone === 'conversational') {
            strategies.push('Use personal anecdotes and experiences');
            strategies.push('Ask rhetorical questions to engage readers');
        } else if (tone === 'professional') {
            strategies.push('Include industry statistics and research');
            strategies.push('Reference authoritative sources');
        }

        return strategies;
    }

    function generateAdditionalSuggestions(topic, type, notes) {
        const suggestions = [
            'Consider creating a follow-up piece on advanced topics',
            'Include interactive elements or exercises',
            'Add relevant tags and keywords for SEO',
            'Plan for social media promotion'
        ];

        if (notes && notes.trim()) {
            suggestions.unshift(`Incorporate the specific requirements: ${notes.trim()}`);
        }

        return suggestions;
    }

    function displayResults(results) {
        const { titles, outline, keyPoints, engagement, additionalSuggestions } = results;

        const html = `
            <div class="content-results-display">
                <div class="result-section">
                    <h3>📝 Title Suggestions</h3>
                    <ul class="title-list">
                        ${titles.map(title => `<li>${title}</li>`).join('')}
                    </ul>
                </div>

                <div class="result-section">
                    <h3>📋 Content Outline</h3>
                    <div class="outline-structure">
                        <div class="outline-item">
                            <strong>1. ${outline.introduction}</strong>
                        </div>
                        ${outline.mainSections.map((section, index) => `
                            <div class="outline-item">
                                <strong>${index + 2}. ${section}</strong>
                            </div>
                        `).join('')}
                        <div class="outline-item">
                            <strong>${outline.mainSections.length + 2}. ${outline.conclusion}</strong>
                        </div>
                    </div>
                </div>

                <div class="result-section">
                    <h3>🎯 Key Points to Cover</h3>
                    <ul class="key-points-list">
                        ${keyPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>

                <div class="result-section">
                    <h3>🚀 Engagement Strategies</h3>
                    <ul class="engagement-list">
                        ${engagement.map(strategy => `<li>${strategy}</li>`).join('')}
                    </ul>
                </div>

                <div class="result-section">
                    <h3>💡 Additional Suggestions</h3>
                    <ul class="suggestions-list">
                        ${additionalSuggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        contentOutput.innerHTML = html;
        outputActions.style.display = 'flex';
    }

    // Event Listeners
    generateBtn.addEventListener('click', async function() {
        const topic = topicInput.value.trim();
        
        if (!topic) {
            alert('Please enter a content topic.');
            return;
        }

        const params = {
            topic,
            type: contentType.value,
            audience: audienceLevel.value,
            length: contentLength.value,
            tone: toneStyle.value,
            notes: additionalNotes.value
        };

        // Show loading state
        generateBtn.disabled = true;
        document.querySelector('.btn-text').style.display = 'none';
        document.querySelector('.btn-loading').style.display = 'inline';

        try {
            const results = await generateContentIdeas(params);
            displayResults(results);
        } catch (error) {
            contentOutput.innerHTML = '<div class="error-message">Error generating content ideas. Please try again.</div>';
        } finally {
            // Reset button state
            generateBtn.disabled = false;
            document.querySelector('.btn-text').style.display = 'inline';
            document.querySelector('.btn-loading').style.display = 'none';
        }
    });

    // Copy functionality
    document.getElementById('copyOutlineBtn').addEventListener('click', function() {
        const resultText = contentOutput.innerText;
        navigator.clipboard.writeText(resultText).then(() => {
            this.textContent = 'Copied!';
            setTimeout(() => {
                this.textContent = 'Copy Outline';
            }, 2000);
        });
    });

    // Generate more ideas
    document.getElementById('generateMoreBtn').addEventListener('click', function() {
        generateBtn.click();
    });

    // Clear output
    document.getElementById('clearOutputBtn').addEventListener('click', function() {
        contentOutput.innerHTML = `
            <div class="placeholder-content">
                <h3>Your Content Ideas Will Appear Here</h3>
                <p>Fill in the form and click "Generate Content Ideas" to get:</p>
                <ul>
                    <li>Detailed content outline</li>
                    <li>Key talking points</li>
                    <li>Audience-specific suggestions</li>
                    <li>Engagement strategies</li>
                </ul>
            </div>
        `;
        outputActions.style.display = 'none';
    });

    // Template functionality
    templateCards.forEach(card => {
        const templateBtn = card.querySelector('.template-btn');
        templateBtn.addEventListener('click', function() {
            const templateType = card.getAttribute('data-template');
            const template = templates[templateType];
            
            if (template) {
                topicInput.value = template.topic;
                contentType.value = template.type;
                audienceLevel.value = template.audience;
                contentLength.value = template.length;
                toneStyle.value = template.tone;
                
                // Scroll to form
                document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
