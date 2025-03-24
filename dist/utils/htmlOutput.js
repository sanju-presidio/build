"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputHTMLPage = void 0;
const handlebars_1 = __importDefault(require("handlebars"));
const outputHTMLPage = (data) => {
    const escapedHTML = `&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;en&quot;&gt;
&lt;head&gt;
    &lt;meta charset=&quot;UTF-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;
    &lt;title&gt;FactifAI Test Report&lt;/title&gt;
    &lt;style&gt;
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #e1e1e1;
            height: 100vh;
            overflow: hidden;
            background-color: #1a1a1a;
        }

        /* Header */
        .header {
            background-color: #2d2d2d;
            padding: 1rem 2rem;
            border-bottom: 1px solid #404040;
        }

        .header h1 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #e1e1e1;
        }

        /* Test Summary */
        .test-summary {
            display: flex;
            padding: 1rem 2rem;
            background-color: #2d2d2d;
            border-bottom: 1px solid #404040;
            gap: 2rem;
        }

        .summary-item {
            display: flex;
            gap: 0.5rem;
        }

        .summary-label {
            font-weight: 500;
            color: #e1e1e1;
        }

        /* Main Container */
        .container {
            display: grid;
            grid-template-columns: 250px 0.7fr 1fr;
            height: calc(100vh - 120px);
            overflow: hidden;
            min-height: 0;
            background-color: #1a1a1a;
        }

        /* Test Cases List */
        .test-cases {
            border-right: 1px solid #404040;
            overflow-y: auto;
            background-color: #2d2d2d;
            max-height: 100%;
        }

        .test-case-item {
            padding: 1rem;
            border-bottom: 1px solid #404040;
            cursor: pointer;
        }

        .test-case-item:hover {
            background-color: #3d3d3d;
        }

        .test-case-item.active {
            background-color: #3d3d3d;
            border-left: 3px solid #0d6efd;
        }

        .test-case-name {
            font-weight: 500;
            margin-bottom: 0.25rem;
            color: #e1e1e1;
        }

        .test-case-description {
            font-size: 0.875rem;
            color: #a0a0a0;
        }

        /* Chat Section */
        .chat-section {
            border-right: 1px solid #404040;
            padding: 1rem;
            overflow-y: auto;
            height: 100%;
            display: flex;
            flex-direction: column;
            background-color: #1a1a1a;
        }

        /* Chat Messages Container */
        .chat-message {
            flex: 0 0 auto;
            margin-bottom: 1rem;
            padding: 0.75rem;
            border-radius: 4px;
            max-width: 80%;
            word-wrap: break-word;
            color: #e1e1e1;
        }

        .chat-message h1, .chat-message h2, .chat-message h3 { 
            color: #e1e1e1;
            margin: 0.5em 0;
        }
        .chat-message h1 { font-size: 1.5em; }
        .chat-message h2 { font-size: 1.3em; }
        .chat-message h3 { font-size: 1.1em; }
        .chat-message p { margin: 0.5em 0; }
        .chat-message code {
            background-color: #2d2d2d;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: monospace;
            color: #e1e1e1;
        }
        .chat-message pre {
            background-color: #2d2d2d;
            padding: 1em;
            border-radius: 4px;
            overflow-x: auto;
            border: 1px solid #404040;
        }
        .chat-message pre code {
            background-color: transparent;
            padding: 0;
        }
        .chat-message ul, .chat-message ol {
            margin: 0.5em 0;
            padding-left: 1.5em;
            color: #e1e1e1;
        }
        .chat-message blockquote {
            border-left: 3px solid #404040;
            margin: 0.5em 0;
            padding-left: 1em;
            color: #a0a0a0;
        }

        .chat-message.user {
            background-color: #2d2d2d;
            margin-left: auto;
        }

        .chat-message.assistant {
            background-color: #252525;
            margin-right: auto;
            cursor: pointer;
            position: relative;
        }

        .chat-message.assistant::after {
            content: '📷';
            position: absolute;
            right: 10px;
            top: 10px;
        }

        .chat-message.assistant.active {
            border-left: 3px solid #0d6efd;
            background-color: #2d2d2d;
        }

        /* Right Section */
        .right-section {
            display: flex;
            flex-direction: column;
            height: 100%;
            background-color: #1a1a1a;
        }

        /* Screenshot Section */
        .screenshot-section {
            height: 50%;
            padding: 1rem;
            position: relative;
            border-bottom: 1px solid #404040;
            background-color: #2d2d2d;
        }

        .screenshot-container {
            height: calc(100% - 40px);
            position: relative;
            overflow: hidden;
        }

        .screenshot-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            background-color: #1a1a1a;
        }

        .screenshot-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-top: 0.5rem;
        }

        .screenshot-nav {
            background: #0d6efd;
            color: white;
            border: none;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            cursor: pointer;
        }

        .screenshot-nav:disabled {
            background: #404040;
            cursor: not-allowed;
        }

        .screenshot-dots {
            display: flex;
            gap: 0.5rem;
        }

        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #404040;
            cursor: pointer;
        }

        .dot.active {
            background: #0d6efd;
        }

        /* Console Section */
        .console-section {
            height: 50%;
            padding: 1rem;
            overflow-y: auto;
            background-color: #1e1e1e;
            color: #e1e1e1;
            font-family: 'Courier New', monospace;
            max-height: 50%;
        }

        .console-entry {
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
        }

        .log-entry {
            color: #e1e1e1;
        }

        .log-info {
            color: #4fc3f7;
        }

        .log-warning {
            color: #ffd600;
        }

        .log-error {
            color: #ff5252;
        }

        .request-entry {
            margin-bottom: 1rem;
        }

        .request-method {
            display: inline-block;
            padding: 0.125rem 0.375rem;
            border-radius: 3px;
            margin-right: 0.5rem;
            color: #1a1a1a;
        }

        .method-get { background-color: #4caf50; }
        .method-post { background-color: #2196f3; }
        .method-put { background-color: #ff9800; }
        .method-delete { background-color: #f44336; }

        .status-2xx { color: #4caf50; }
        .status-4xx { color: #ff9800; }
        .status-5xx { color: #f44336; }
    &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;header class=&quot;header&quot;&gt;
        &lt;h1&gt;FactifAI&lt;/h1&gt;
    &lt;/header&gt;

    &lt;div class=&quot;test-summary&quot;&gt;
        &lt;div class=&quot;summary-item&quot;&gt;
            &lt;span class=&quot;summary-label&quot;&gt;Test Case Count&lt;/span&gt;
            &lt;span class=&quot;summary-value&quot; id=&quot;total-count&quot;&gt;0&lt;/span&gt;
        &lt;/div&gt;
        &lt;div class=&quot;summary-item&quot;&gt;
            &lt;span class=&quot;summary-label&quot;&gt;Passed&lt;/span&gt;
            &lt;span class=&quot;summary-value&quot; id=&quot;passed-count&quot;&gt;0&lt;/span&gt;
        &lt;/div&gt;
        &lt;div class=&quot;summary-item&quot;&gt;
            &lt;span class=&quot;summary-label&quot;&gt;Failed&lt;/span&gt;
            &lt;span class=&quot;summary-value&quot; id=&quot;failed-count&quot;&gt;0&lt;/span&gt;
        &lt;/div&gt;
    &lt;/div&gt;

    &lt;main class=&quot;container&quot;&gt;
        &lt;div class=&quot;test-cases&quot; id=&quot;test-cases-list&quot;&gt;
            &lt;!-- Test cases will be populated here --&gt;
        &lt;/div&gt;

        &lt;div class=&quot;chat-section&quot; id=&quot;chat-section&quot;&gt;
            &lt;!-- Chat messages will be populated here --&gt;
        &lt;/div&gt;

        &lt;div class=&quot;right-section&quot;&gt;
            &lt;div class=&quot;screenshot-section&quot;&gt;
                &lt;div class=&quot;screenshot-container&quot;&gt;
                    &lt;img class=&quot;screenshot-img&quot; id=&quot;current-screenshot&quot; src=&quot;&quot; alt=&quot;Test screenshot&quot;&gt;
                &lt;/div&gt;
                &lt;div class=&quot;screenshot-controls&quot;&gt;
                    &lt;button class=&quot;screenshot-nav&quot; id=&quot;prev-screenshot&quot;&gt;&amp;lt;&lt;/button&gt;
                    &lt;div class=&quot;screenshot-dots&quot; id=&quot;screenshot-dots&quot;&gt;
                        &lt;!-- Dots will be populated here --&gt;
                    &lt;/div&gt;
                    &lt;button class=&quot;screenshot-nav&quot; id=&quot;next-screenshot&quot;&gt;&amp;gt;&lt;/button&gt;
                &lt;/div&gt;
            &lt;/div&gt;

            &lt;div class=&quot;console-section&quot; id=&quot;console-output&quot;&gt;
                &lt;!-- Console output will be populated here --&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/main&gt;

    &lt;script&gt;
        class TestReport {
            constructor() {
                this.data = null;
                this.currentTestIndex = 0;
                this.currentScreenshotIndex = 0;
                
                // DOM Elements
                this.elements = {
                    totalCount: document.getElementById('total-count'),
                    passedCount: document.getElementById('passed-count'),
                    failedCount: document.getElementById('failed-count'),
                    testCasesList: document.getElementById('test-cases-list'),
                    chatSection: document.getElementById('chat-section'),
                    currentScreenshot: document.getElementById('current-screenshot'),
                    screenshotDots: document.getElementById('screenshot-dots'),
                    prevScreenshot: document.getElementById('prev-screenshot'),
                    nextScreenshot: document.getElementById('next-screenshot'),
                    consoleOutput: document.getElementById('console-output')
                };

                // Event Listeners
                this.elements.prevScreenshot.addEventListener('click', () =&gt; this.navigateScreenshot(-1));
                this.elements.nextScreenshot.addEventListener('click', () =&gt; this.navigateScreenshot(1));
            }

            loadData(jsonData) {
                this.data = jsonData;
                this.updateSummary();
                this.renderTestCases();
                this.selectTest(0);
            }

            updateSummary() {
                const { summary } = this.data;
                this.elements.totalCount.textContent = summary.total;
                this.elements.passedCount.textContent = summary.passed;
                this.elements.failedCount.textContent = summary.failed;
            }

            renderTestCases() {
                this.elements.testCasesList.innerHTML = this.data.tests.map((test, index) =&gt; \`
                    &lt;div class=&quot;test-case-item ${index === 0 ? "active" : ""}&quot; data-index=&quot;${index}&quot;&gt;
                        &lt;div class=&quot;test-case-name&quot;&gt;${test.name}&lt;/div&gt;
                        &lt;div class=&quot;test-case-description&quot;&gt;${test.description}&lt;/div&gt;
                    &lt;/div&gt;
                \`).join('');

                this.elements.testCasesList.addEventListener('click', (e) =&gt; {
                    const testItem = e.target.closest('.test-case-item');
                    if (testItem) {
                        const index = parseInt(testItem.dataset.index);
                        this.selectTest(index);
                    }
                });
            }

            selectTest(index) {
                this.currentTestIndex = index;
                this.currentScreenshotIndex = 0;

                // Update test case selection
                const testItems = this.elements.testCasesList.querySelectorAll('.test-case-item');
                testItems.forEach((item, i) =&gt; {
                    item.classList.toggle('active', i === index);
                });

                this.renderChat();
                this.renderScreenshots();
                this.renderConsole();
            }

            renderChat() {
                const test = this.data.tests[this.currentTestIndex];
                // Add marked library for markdown parsing
                const markedScript = document.createElement('script');
                markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
                document.head.appendChild(markedScript);

                markedScript.onload = () =&gt; {
                    this.elements.chatSection.innerHTML = test.conversation.map((msg, index) =&gt; \`
                        &lt;div class=&quot;chat-message ${msg.role} ${msg.screenshotId ? "has-screenshot" : ""}&quot; 
                             data-message-id=&quot;${msg.id}&quot;&gt;
                            ${marked.parse(msg.message)}
                        &lt;/div&gt;
                    \`).join('');

                    // Add click handlers for assistant messages
                    this.elements.chatSection.querySelectorAll('.chat-message.assistant').forEach(msg =&gt; {
                        msg.addEventListener('click', () =&gt; {
                            const messageId = parseInt(msg.dataset.messageId);
                            const message = test.conversation.find(m =&gt; m.id === messageId);
                            if (message &amp;&amp; message.screenshotId) {
                                const screenshotIndex = test.screenshots.findIndex(s =&gt; s.id === message.screenshotId);
                                if (screenshotIndex !== -1) {
                                    this.showScreenshot(screenshotIndex);
                                }
                            }
                        });
                    });
                };

                // Add click handlers for assistant messages
                this.elements.chatSection.querySelectorAll('.chat-message.assistant').forEach(msg =&gt; {
                    msg.addEventListener('click', () =&gt; {
                        const messageId = parseInt(msg.dataset.messageId);
                        const message = test.conversation.find(m =&gt; m.id === messageId);
                        if (message &amp;&amp; message.screenshotId) {
                            const screenshotIndex = test.screenshots.findIndex(s =&gt; s.id === message.screenshotId);
                            if (screenshotIndex !== -1) {
                                this.showScreenshot(screenshotIndex);
                            }
                        }
                    });
                });
            }

            renderScreenshots() {
                const test = this.data.tests[this.currentTestIndex];
                const screenshots = test.screenshots;

                // Update navigation buttons
                this.elements.prevScreenshot.disabled = this.currentScreenshotIndex === 0;
                this.elements.nextScreenshot.disabled = this.currentScreenshotIndex === screenshots.length - 1;

                // Update dots
                this.elements.screenshotDots.innerHTML = screenshots.map((_, index) =&gt; \`
                    &lt;div class=&quot;dot ${index === this.currentScreenshotIndex ? "active" : ""}&quot;
                         data-index=&quot;${index}&quot;&gt;&lt;/div&gt;
                \`).join('');

                this.elements.screenshotDots.querySelectorAll('.dot').forEach(dot =&gt; {
                    dot.addEventListener('click', () =&gt; {
                        this.showScreenshot(parseInt(dot.dataset.index));
                    });
                });

                this.showScreenshot(this.currentScreenshotIndex);
            }

            showScreenshot(index) {
                const test = this.data.tests[this.currentTestIndex];
                const screenshots = test.screenshots;
                
                if (index &gt;= 0 &amp;&amp; index &lt; screenshots.length) {
                    this.currentScreenshotIndex = index;
                    const screenshot = screenshots[index];
                    
                    // Update image
                    this.elements.currentScreenshot.src = screenshot.image;
                    
                    // Update dots
                    this.elements.screenshotDots.querySelectorAll('.dot').forEach((dot, i) =&gt; {
                        dot.classList.toggle('active', i === index);
                    });
                    
                    // Update navigation buttons
                    this.elements.prevScreenshot.disabled = index === 0;
                    this.elements.nextScreenshot.disabled = index === screenshots.length - 1;

                    // Update chat highlighting
                    const messages = this.elements.chatSection.querySelectorAll('.chat-message.assistant');
                    messages.forEach(msg =&gt; {
                        const messageId = parseInt(msg.dataset.messageId);
                        const message = test.conversation.find(m =&gt; m.id === messageId);
                        msg.classList.toggle('active', message &amp;&amp; message.screenshotId === screenshot.id);
                    });
                }
            }

            navigateScreenshot(direction) {
                const newIndex = this.currentScreenshotIndex + direction;
                const test = this.data.tests[this.currentTestIndex];
                if (newIndex &gt;= 0 &amp;&amp; newIndex &lt; test.screenshots.length) {
                    this.showScreenshot(newIndex);
                }
            }

            renderConsole() {
                const test = this.data.tests[this.currentTestIndex];
                const { logs, requests } = test.console;

                let consoleHtml = '';

                // Sort all entries by timestamp
                const allEntries = [
                    ...logs.map(log =&gt; ({ ...log, type: 'log' })),
                    ...requests.map(req =&gt; ({ ...req, type: 'request' }))
                ].sort((a, b) =&gt; new Date(a.timestamp) - new Date(b.timestamp));

                allEntries.forEach(entry =&gt; {
                    if (entry.type === 'log') {
                        consoleHtml += \`
                            &lt;div class=&quot;console-entry log-entry log-${entry.level}&quot;&gt;
                                ${entry.timestamp} [${entry.level.toUpperCase()}] ${entry.message}
                            &lt;/div&gt;
                        \`;
                    } else {
                        const statusClass = entry.status &lt; 300 ? 'status-2xx' : 
                                         entry.status &lt; 500 ? 'status-4xx' : 'status-5xx';
                        consoleHtml += \`
                            &lt;div class=&quot;console-entry request-entry&quot;&gt;
                                &lt;span class=&quot;request-method method-${entry.method.toLowerCase()}&quot;&gt;${entry.method}&lt;/span&gt;
                                &lt;span&gt;${entry.url}&lt;/span&gt;
                                &lt;span class=&quot;${statusClass}&quot;&gt;${entry.status}&lt;/span&gt;
                            &lt;/div&gt;
                        \`;
                    }
                });

                this.elements.consoleOutput.innerHTML = consoleHtml;
            }
        }

        // Initialize the report
        const report = new TestReport();

        // Load data directly
        const jsonData = {{testResultJSON}};
        
        // Initialize with the data directly
        report.loadData(jsonData);
    &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;`;
    const template = handlebars_1.default.compile(escapedHTML);
    return template({ testResultJSON: data });
};
exports.outputHTMLPage = outputHTMLPage;
//# sourceMappingURL=htmlOutput.js.map