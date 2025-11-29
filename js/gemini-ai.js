// PC Forge AI Chat Assistant - Dynamic and Intelligent
class PCForgeAI {
  constructor() {
    this.apiKey = 'AIzaSyAoajwVkAWqHJajiwasAKE0oqAqRE4K4NU';
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  }

  async sendMessage(userMessage) {
    const prompt = `You are an expert PC building consultant for PC Forge, a premium computer components store in the Philippines. You have deep knowledge of computer hardware and can provide intelligent, personalized recommendations.

AVAILABLE PRODUCTS & REAL-TIME PRICING:
• AMD Ryzen 7 7700X (₱18,500) - 8-core/16-thread processor, 5.4GHz boost, AM5 socket, excellent for gaming and productivity
• RTX 4070Ti Verto White (₱42,000) - 12GB GDDR6X, 7680 CUDA cores, ray tracing, DLSS 3.0, perfect for 1440p gaming
• Kingston FURY DDR5 32GB (₱6,500) - 6000MHz kit (2x16GB), CL36, optimized for Ryzen 7000 and Intel 12th gen+
• Kingston 1TB NVMe SSD (₱3,800) - PCIe 4.0, 7000MB/s read speeds, high-endurance for gaming and work
• ATX Mid Tower Case (₱2,800) - Tempered glass, RGB fans, excellent airflow, supports full-size GPUs
• ASUS TUF 850W PSU (₱6,200) - 80+ Gold efficiency, fully modular, 10-year warranty, powers high-end systems
• Intel Core i5-13600K (₱15,500) - 14-core/20-thread, 5.1GHz boost, LGA 1700 socket, great for gaming and multitasking

YOUR EXPERTISE AREAS:
- Hardware compatibility analysis
- Performance benchmarking insights  
- Budget optimization strategies
- Gaming vs productivity build recommendations
- Future-proofing advice
- Overclocking potential assessment
- Thermal management solutions
- Power consumption calculations

RESPONSE GUIDELINES:
✓ Analyze user needs deeply before recommending
✓ Explain technical reasons behind recommendations
✓ Consider price-to-performance ratios
✓ Account for real-world usage scenarios
✓ Provide upgrade path suggestions
✓ Address compatibility concerns proactively
✓ Use current market knowledge for comparisons
✓ Always answer with shortest sentences possible
✓ Be Straightforward and clear, don't be talkative
✓ Include relevant product links where applicable
✓ Be concise yet informative
✓ Offer multiple options when appropriate
✓ End every response with "Thank you for choosing PC Forge!"
✗ Never give generic or template responses
✗ Don't assume budget without asking
✗ Don't recommend products not in our catalog
✗ Don't make up prices or specifications
✗ Don't use asterisk signatures (*)
✗ Avoid using emojis or special characters


ALWAYS FOLLOW THE GUIDELINE ABOVE FOR ALL RESPONSES.

CONVERSATION CONTEXT:
User is asking: "${userMessage}"

Provide an intelligent, detailed response based on your expertise. Ask follow-up questions if needed to give better recommendations. Always end with "Thank you for choosing PC Forge!"`;

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.9
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Full API Response:', JSON.stringify(data, null, 2));
      
      // Check for different possible response structures
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else if (data.candidates?.[0]?.output) {
        return data.candidates[0].output;
      } else if (data.text) {
        return data.text;
      } else if (data.response) {
        return data.response;
      } else {
        console.error('Unexpected API response structure:', data);
        
        // Check if there's an error in the response
        if (data.error) {
          throw new Error(`API Error: ${data.error.message || data.error}`);
        }
        
        // Try to extract any text content from candidates
        if (data.candidates && data.candidates.length > 0) {
          const candidate = data.candidates[0];
          console.log('First candidate:', candidate);
          
          if (candidate.finishReason === 'SAFETY') {
            return "I apologize, but I cannot respond to that query due to safety guidelines. Please ask me about PC components, build recommendations, or technical specifications instead.\n\nThank you for choosing PC Forge!";
          }
          
          if (candidate.finishReason === 'MAX_TOKENS') {
            return "I apologize, but my response was too long and got cut off. Could you ask a more specific question about PC components? For example, you could ask about a specific processor comparison or a particular budget range for a gaming build.\n\nThank you for choosing PC Forge!";
          }
          
          // Try to find any text content in the candidate
          const textContent = this.extractTextFromCandidate(candidate);
          if (textContent) {
            return textContent;
          }
        }
        
        throw new Error(`Invalid API response structure. Received: ${JSON.stringify(data)}`);
      }

    } catch (error) {
      console.error('Gemini AI Error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Only use fallback for actual API failures, not for specific questions
      return `I'm experiencing technical difficulties right now. However, I'm here to help with PC component recommendations, compatibility questions, and build advice. 

Could you please rephrase your question? I'll do my best to assist you with our available products.

Thank you for choosing PC Forge!`;
    }
  }

  // Helper method to extract text from complex candidate structures
  extractTextFromCandidate(candidate) {
    if (candidate.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.text) return part.text;
        if (part.content) return part.content;
      }
    }
    
    if (candidate.text) return candidate.text;
    if (candidate.content) return candidate.content;
    
    return null;
  }
}

// Enhanced Chat Interface
class ChatUI {
  constructor() {
    this.ai = new PCForgeAI();
    this.isOpen = false;
    this.createUI();
    this.attachEvents();
  }

  createUI() {
    const html = `
      <div id="chat-btn" style="position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg,#b91c1c,#991b1b);color:white;padding:16px 24px;border-radius:30px;cursor:pointer;box-shadow:0 6px 20px rgba(185,28,28,0.4);font-weight:600;z-index:1000;transition:all 0.3s ease;border:none;">
        <span style="display:flex;align-items:center;gap:8px;">🤖 AI Assistant</span>
      </div>

      <div id="chat-box" style="display:none;position:fixed;bottom:90px;right:20px;width:400px;height:600px;background:white;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);z-index:1001;flex-direction:column;border:1px solid #e5e7eb;">
        
        <div style="background:linear-gradient(135deg,#b91c1c,#991b1b);color:white;padding:20px;border-radius:20px 20px 0 0;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:1.2rem;font-weight:700;">🤖 PC Forge AI</div>
            <div style="font-size:0.85rem;opacity:0.9;">Expert PC Building Assistant</div>
          </div>
          <button id="close-btn" style="background:rgba(255,255,255,0.2);border:none;color:white;font-size:20px;width:32px;height:32px;border-radius:50%;cursor:pointer;transition:all 0.2s;">×</button>
        </div>

        <div id="messages" style="flex:1;overflow-y:auto;padding:20px;background:#f8fafc;">
          <div style="display:flex;gap:12px;margin-bottom:20px;">
            <div style="width:40px;height:40px;background:linear-gradient(135deg,#b91c1c,#991b1b);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">🤖</div>
            <div style="background:white;padding:14px 18px;border-radius:18px;max-width:300px;box-shadow:0 2px 10px rgba(0,0,0,0.1);line-height:1.6;border:1px solid #f1f5f9;">
              Hello! I'm your AI PC building expert. I can help you choose the perfect components, check compatibility, compare specifications, and recommend complete builds based on your needs and budget. What would you like to know?
            </div>
          </div>
        </div>

        <div style="padding:20px;background:white;border-top:1px solid #e5e7eb;border-radius:0 0 20px 20px;">
          <div style="display:flex;gap:12px;align-items:center;">
            <input id="user-input" type="text" placeholder="Ask me about CPUs, GPUs, compatibility..." style="flex:1;padding:14px 18px;border:2px solid #e5e7eb;border-radius:25px;outline:none;font-size:0.95rem;transition:border-color 0.2s;" maxlength="300">
            <button id="send-btn" style="background:linear-gradient(135deg,#b91c1c,#991b1b);color:white;border:none;padding:14px 20px;border-radius:25px;cursor:pointer;font-weight:600;font-size:0.9rem;transition:all 0.2s;min-width:70px;">Send</button>
          </div>
        
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  attachEvents() {
    const chatBtn = document.getElementById('chat-btn');
    const closeBtn = document.getElementById('close-btn');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');

    chatBtn.onclick = () => this.toggleChat();
    closeBtn.onclick = () => this.closeChat();
    sendBtn.onclick = () => this.sendMessage();
    
    userInput.onkeypress = (e) => {
      if (e.key === 'Enter') this.sendMessage();
    };

    userInput.onfocus = () => {
      userInput.style.borderColor = '#b91c1c';
    };

    userInput.onblur = () => {
      userInput.style.borderColor = '#e5e7eb';
    };

    // Quick action buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
      btn.onclick = () => {
        userInput.value = btn.dataset.msg;
        this.sendMessage();
      };
      
      btn.onmouseover = () => {
        btn.style.background = '#e2e8f0';
        btn.style.borderColor = '#cbd5e1';
      };
      
      btn.onmouseout = () => {
        btn.style.background = '#f1f5f9';
        btn.style.borderColor = '#e5e7eb';
      };
    });

    // Hover effects
    chatBtn.onmouseover = () => {
      chatBtn.style.transform = 'translateY(-2px)';
      chatBtn.style.boxShadow = '0 8px 25px rgba(185,28,28,0.5)';
    };

    chatBtn.onmouseout = () => {
      chatBtn.style.transform = 'translateY(0)';
      chatBtn.style.boxShadow = '0 6px 20px rgba(185,28,28,0.4)';
    };
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const box = document.getElementById('chat-box');
    const btn = document.getElementById('chat-btn');
    
    if (this.isOpen) {
      box.style.display = 'flex';
      box.style.animation = 'slideUp 0.3s ease';
      btn.style.background = 'linear-gradient(135deg,#991b1b,#7f1d1d)';
      document.getElementById('user-input').focus();
    } else {
      box.style.display = 'none';
      btn.style.background = 'linear-gradient(135deg,#b91c1c,#991b1b)';
    }
  }

  closeChat() {
    this.isOpen = false;
    const box = document.getElementById('chat-box');
    const btn = document.getElementById('chat-btn');
    box.style.display = 'none';
    btn.style.background = 'linear-gradient(135deg,#b91c1c,#991b1b)';
  }

  async sendMessage() {
    const input = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Disable input during processing
    input.disabled = true;
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
    
    input.value = '';
    this.addMessage(message, 'user');
    this.showTyping();
    
    try {
      const response = await this.ai.sendMessage(message);
      this.hideTyping();
      this.addMessage(response, 'ai');
    } catch (error) {
      this.hideTyping();
      this.addMessage('Sorry, I encountered an error. Please try again.', 'ai');
    } finally {
      // Re-enable input
      input.disabled = false;
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send';
      input.focus();
    }
  }

  addMessage(text, sender) {
    const messagesDiv = document.getElementById('messages');
    const isUser = sender === 'user';
    
    const messageHTML = `
      <div style="display:flex;gap:12px;margin-bottom:20px;${isUser ? 'flex-direction:row-reverse;' : ''}">
        <div style="width:40px;height:40px;background:${isUser ? '#6b7280' : 'linear-gradient(135deg,#b91c1c,#991b1b)'};color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">
          ${isUser ? '👤' : '🤖'}
        </div>
        <div style="background:${isUser ? '#b91c1c' : 'white'};color:${isUser ? 'white' : '#1f2937'};padding:14px 18px;border-radius:18px;max-width:300px;box-shadow:0 2px 10px rgba(0,0,0,0.1);line-height:1.6;white-space:pre-wrap;${isUser ? '' : 'border:1px solid #f1f5f9;'}">
          ${text}
        </div>
      </div>
    `;
    
    messagesDiv.insertAdjacentHTML('beforeend', messageHTML);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  showTyping() {
    const messagesDiv = document.getElementById('messages');
    const typingHTML = `
      <div id="typing-indicator" style="display:flex;gap:12px;margin-bottom:20px;">
        <div style="width:40px;height:40px;background:linear-gradient(135deg,#b91c1c,#991b1b);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;">🤖</div>
        <div style="background:white;padding:14px 18px;border-radius:18px;box-shadow:0 2px 10px rgba(0,0,0,0.1);border:1px solid #f1f5f9;">
          <div style="display:flex;gap:4px;align-items:center;">
            <div class="typing-dot" style="width:6px;height:6px;background:#b91c1c;border-radius:50%;animation:typing 1.4s infinite;"></div>
            <div class="typing-dot" style="width:6px;height:6px;background:#b91c1c;border-radius:50%;animation:typing 1.4s infinite 0.2s;"></div>
            <div class="typing-dot" style="width:6px;height:6px;background:#b91c1c;border-radius:50%;animation:typing 1.4s infinite 0.4s;"></div>
          </div>
        </div>
      </div>
      <style>
        @keyframes typing {
          0%, 60%, 100% { opacity: 0.3; }
          30% { opacity: 1; }
        }
      </style>
    `;
    
    messagesDiv.insertAdjacentHTML('beforeend', typingHTML);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  hideTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ChatUI());
} else {
  new ChatUI();
}
