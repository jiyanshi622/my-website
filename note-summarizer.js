// AI Note Summarizer Functionality
document.addEventListener('DOMContentLoaded', function() {
    const noteInput = document.getElementById('noteInput');
    const summarizeBtn = document.getElementById('summarizeBtn');
    const summaryOutput = document.getElementById('summaryOutput');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const outputActions = document.querySelector('.output-actions');
    const exampleBtns = document.querySelectorAll('.example-btn');

    // Example data
    const examples = {
        meeting: `Team Meeting - Project Alpha Discussion - January 15, 2025

Attendees: Sarah (PM), Mike (Dev), Lisa (Designer), Tom (QA)

Key Points Discussed:
- Project timeline needs adjustment due to client feedback
- Current deadline of Feb 15th may need to be pushed to Feb 28th
- Design mockups received positive feedback from stakeholders
- Backend API development is 70% complete
- Frontend integration will begin next week
- QA testing phase should start by Feb 10th
- Client wants additional features: dark mode and mobile responsiveness
- Budget implications of timeline extension need review
- Marketing team needs final assets by March 1st

Action Items:
- Sarah to discuss timeline extension with client by Jan 18th
- Mike to provide updated API documentation by Jan 20th
- Lisa to create dark mode designs by Jan 25th
- Tom to prepare test cases for new features
- All team members to attend follow-up meeting on Jan 22nd

Next Steps:
- Finalize project scope changes
- Update project documentation
- Communicate changes to all stakeholders`,

        research: `Artificial Intelligence in Healthcare: A Comprehensive Review

Abstract: This study examines the current applications and future potential of artificial intelligence (AI) in healthcare systems worldwide. The research analyzes data from 150 healthcare institutions across 25 countries over a 3-year period.

Key Findings:
- AI diagnostic tools showed 94% accuracy in medical imaging analysis
- Machine learning algorithms reduced diagnostic time by 40% on average
- Natural language processing improved clinical documentation efficiency by 60%
- Predictive analytics helped reduce hospital readmission rates by 25%
- AI-powered drug discovery accelerated research timelines by 30%

Challenges Identified:
- Data privacy and security concerns remain significant barriers
- Integration with existing healthcare systems requires substantial investment
- Training healthcare professionals on AI tools needs improvement
- Regulatory frameworks lag behind technological advancement
- Ethical considerations around AI decision-making in critical care

Recommendations:
- Develop standardized protocols for AI implementation in healthcare
- Invest in comprehensive training programs for medical staff
- Establish clear ethical guidelines for AI use in patient care
- Create robust data governance frameworks
- Foster collaboration between tech companies and healthcare providers

Conclusion: While AI presents tremendous opportunities to improve healthcare outcomes, successful implementation requires addressing technical, ethical, and regulatory challenges through coordinated efforts across the healthcare ecosystem.`,

        lecture: `Computer Science 101 - Introduction to Algorithms - Lecture 8

Topic: Sorting Algorithms and Time Complexity

Today's Agenda:
1. Review of Big O notation
2. Bubble Sort algorithm
3. Selection Sort algorithm  
4. Insertion Sort algorithm
5. Comparison of sorting algorithms
6. When to use each algorithm

Big O Notation Review:
- Measures algorithm efficiency as input size grows
- Common complexities: O(1), O(log n), O(n), O(n log n), O(n²)
- Focus on worst-case scenario for analysis
- Helps choose appropriate algorithm for problem size

Bubble Sort:
- Compares adjacent elements and swaps if needed
- Time complexity: O(n²) worst case, O(n) best case
- Space complexity: O(1)
- Simple to understand but inefficient for large datasets
- Good for educational purposes and small datasets

Selection Sort:
- Finds minimum element and places it at beginning
- Time complexity: O(n²) in all cases
- Space complexity: O(1)
- Performs fewer swaps than bubble sort
- Unstable sorting algorithm

Insertion Sort:
- Builds sorted array one element at a time
- Time complexity: O(n²) worst case, O(n) best case
- Space complexity: O(1)
- Efficient for small datasets and nearly sorted arrays
- Stable sorting algorithm

Key Takeaways:
- Choose algorithm based on data size and characteristics
- Simple algorithms good for learning and small datasets
- More complex algorithms needed for large-scale applications
- Understanding time complexity crucial for algorithm selection

Assignment: Implement all three sorting algorithms in your preferred programming language and compare their performance on different dataset sizes.`
    };

    // AI Summarization logic (simulated)
    function generateSummary(text, type, length) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.split(/\s+/);
        
        // Simulate AI processing delay
        return new Promise((resolve) => {
            setTimeout(() => {
                let summary = '';
                
                switch(type) {
                    case 'bullet':
                        summary = generateBulletSummary(sentences, length);
                        break;
                    case 'paragraph':
                        summary = generateParagraphSummary(sentences, length);
                        break;
                    case 'action':
                        summary = generateActionSummary(text, length);
                        break;
                }
                
                resolve(summary);
            }, 2000); // 2 second delay to simulate AI processing
        });
    }

    function generateBulletSummary(sentences, length) {
        const keyPoints = extractKeyPoints(sentences, length);
        return keyPoints.map(point => `• ${point.trim()}`).join('\n');
    }

    function generateParagraphSummary(sentences, length) {
        const keyPoints = extractKeyPoints(sentences, length);
        return keyPoints.join('. ') + '.';
    }

    function generateActionSummary(text, length) {
        const actionWords = ['action', 'task', 'todo', 'complete', 'finish', 'deliver', 'submit', 'review', 'discuss', 'meet', 'call', 'email', 'send', 'prepare', 'create', 'update'];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        let actions = sentences.filter(sentence => 
            actionWords.some(word => sentence.toLowerCase().includes(word))
        );

        if (actions.length === 0) {
            actions = extractKeyPoints(sentences, length).map(point => `Complete: ${point}`);
        }

        const maxActions = length === 'brief' ? 3 : length === 'medium' ? 5 : 8;
        return actions.slice(0, maxActions).map((action, index) => `${index + 1}. ${action.trim()}`).join('\n');
    }

    function extractKeyPoints(sentences, length) {
        const maxPoints = length === 'brief' ? 3 : length === 'medium' ? 6 : 10;
        
        // Simple keyword-based extraction (in real implementation, this would use NLP)
        const importantWords = ['important', 'key', 'main', 'significant', 'crucial', 'essential', 'primary', 'major', 'critical', 'findings', 'results', 'conclusion', 'recommendation'];
        
        let scoredSentences = sentences.map(sentence => {
            let score = 0;
            const words = sentence.toLowerCase().split(/\s+/);
            
            // Score based on important words
            importantWords.forEach(word => {
                if (sentence.toLowerCase().includes(word)) score += 2;
            });
            
            // Score based on sentence length (medium length preferred)
            if (words.length > 10 && words.length < 30) score += 1;
            
            // Score based on position (first and last sentences often important)
            const index = sentences.indexOf(sentence);
            if (index === 0 || index === sentences.length - 1) score += 1;
            
            return { sentence: sentence.trim(), score };
        });

        // Sort by score and take top sentences
        scoredSentences.sort((a, b) => b.score - a.score);
        return scoredSentences.slice(0, maxPoints).map(item => item.sentence);
    }

    // Event Listeners
    summarizeBtn.addEventListener('click', async function() {
        const text = noteInput.value.trim();
        
        if (!text) {
            alert('Please enter some notes to summarize.');
            return;
        }

        const summaryType = document.querySelector('input[name="summaryType"]:checked').value;
        const summaryLength = document.getElementById('summaryLength').value;

        // Show loading state
        summarizeBtn.disabled = true;
        document.querySelector('.btn-text').style.display = 'none';
        document.querySelector('.btn-loading').style.display = 'inline';

        try {
            const summary = await generateSummary(text, summaryType, summaryLength);
            
            summaryOutput.innerHTML = `<div class="summary-result">${summary.replace(/\n/g, '<br>')}</div>`;
            outputActions.style.display = 'flex';
            
        } catch (error) {
            summaryOutput.innerHTML = `<div class="error-message">Error generating summary. Please try again.</div>`;
        } finally {
            // Reset button state
            summarizeBtn.disabled = false;
            document.querySelector('.btn-text').style.display = 'inline';
            document.querySelector('.btn-loading').style.display = 'none';
        }
    });

    copyBtn.addEventListener('click', function() {
        const summaryText = summaryOutput.querySelector('.summary-result').innerText;
        navigator.clipboard.writeText(summaryText).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy Summary';
            }, 2000);
        });
    });

    clearBtn.addEventListener('click', function() {
        summaryOutput.innerHTML = `
            <div class="placeholder-text">
                <p>Your AI-generated summary will appear here...</p>
                <p>Enter your notes and click "Summarize Notes" to get started.</p>
            </div>
        `;
        outputActions.style.display = 'none';
        noteInput.value = '';
    });

    // Example buttons
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const exampleType = this.getAttribute('data-example');
            noteInput.value = examples[exampleType];
            noteInput.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
