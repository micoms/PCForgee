// PC Forge AI Chat Assistant
class PCForgeAI {
  constructor() {
    this.apiKey = 'AIzaSyDyATR1eA3ZjynRfdaXQrptp6XvpajwNgo'; // PUT YOUR API KEY HERE
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  }

  async sendMessage(userMessage) {
    const prompt = `You are a helpful PC building assistant for PC Forge store in the Philippines.
    
Available Products:
- AMD Ryzen 7 7700X (₱18,500) - High performance processor
- RTX 4070Ti (₱42,000) - Premium graphics card for gaming
- Kingston FURY DDR5 32GB (₱6,500) - Fast gaming memory
- Kingston 1TB NVMe SSD (₱3,800) - Fast storage

Help customers with:
- Product recommendations based on budget
- PC build advice
- Gaming setup suggestions
- Compatibility questions

Rules:
- Be concise and clear
- Avoid technical jargon unless asked
- Provide only relevant information
- Don't make assumptions about customer's needs or preferences
- Don't recommend products not in the available products list
- Only respond with product names from the available products list
- Always end responses with "Thank you!"
- If you don't know the answer, say "I don't know, but I can help you find more information!"
- Do not include links or URLs
- Keep responses short and sweet
- Respond within 1 minute of receiving user message
- Don't use **bold** formatting
- Don't use **italics** formatting
- Don't use **underline** formatting
- Don't use **strikethrough** formatting
- Don't use **code blocks**
- Don't use **lists**
- Don't use **blockquotes**
- Don't use **horizontal rules**
- Don't use **emoji**

Be friendly and helpful. Use Philippine Peso (₱) for prices.

User question: ${userMessage}`;

   
    }
  }

// Chat Interface
class ChatUI {
  constructor() {
    this.ai = new PCForgeAI();
    this.isOpen = false;
    this.createUI();
    this.attachEvents();
  }

  createUI() {
    const html = `
      <div id="chat-btn" style="position:fixed;bottom:20px;right:20px;background:#b91c1c;color:white;padding:15px 25px;border-radius:30px;cursor:pointer;box-shadow:0 4px 15px rgba(185,28,28,0.4);font-weight:600;z-index:1000;">
        🤖 Chat with AI
      </div>

      <div id="chat-box" style="display:none;position:fixed;bottom:90px;right:20px;width:380px;height:550px;background:white;border-radius:15px;box-shadow:0 10px 40px rgba(0,0,0,0.3);z-index:1001;flex-direction:column;">
        <div style="background:#b91c1c;color:white;padding:20px;border-radius:15px 15px 0 0;display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:1.1rem;font-weight:600;">🤖 PC Forge AI</div>
          <button id="close-btn" style="background:rgba(255,255,255,0.2);border:none;color:white;font-size:24px;width:35px;height:35px;border-radius:50%;cursor:pointer;">×</button>
        </div>

        <div id="messages" style="flex:1;overflow-y:auto;padding:20px;background:#f9fafb;">
          <div style="display:flex;gap:10px;margin-bottom:15px;">
            <div style="width:35px;height:35px;background:#b91c1c;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;">🤖</div>
            <div style="background:white;padding:12px 16px;border-radius:15px;max-width:280px;box-shadow:0 2px 8px rgba(0,0,0,0.1);line-height:1.5;">
              Hi! I'm your PC building assistant. I can help you choose components, check compatibility, and recommend builds. What are you looking for?
            </div>
          </div>
        </div>

        <div style="padding:15px;background:white;border-top:1px solid #e5e7eb;">
          <div style="display:flex;gap:10px;">
            <input id="user-input" type="text" placeholder="Ask me anything..." style="flex:1;padding:12px 16px;border:1px solid #e5e7eb;border-radius:25px;outline:none;font-size:0.95rem;">
            <button id="send-btn" style="background:#b91c1c;color:white;border:none;padding:12px 20px;border-radius:25px;cursor:pointer;font-weight:600;">Send</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  attachEvents() {
    document.getElementById('chat-btn').onclick = () => this.toggleChat();
    document.getElementById('close-btn').onclick = () => this.closeChat();
    document.getElementById('send-btn').onclick = () => this.sendMessage();
    document.getElementById('user-input').onkeypress = (e) => {
      if (e.key === 'Enter') this.sendMessage();
    };
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const box = document.getElementById('chat-box');
    box.style.display = this.isOpen ? 'flex' : 'none';
    if (this.isOpen) {
      document.getElementById('user-input').focus();
    }
  }

  closeChat() {
    this.isOpen = false;
    document.getElementById('chat-box').style.display = 'none';
  }

  async sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    input.value = '';
    this.addMessage(message, 'user');
    this.showTyping();
    
    const response = await this.ai.sendMessage(message);
    this.hideTyping();
    this.addMessage(response, 'ai');
  }

  addMessage(text, sender) {
    const messagesDiv = document.getElementById('messages');
    const isUser = sender === 'user';
    
    const messageHTML = `
      <div style="display:flex;gap:10px;margin-bottom:15px;${isUser ? 'flex-direction:row-reverse;' : ''}">
        <div style="width:35px;height:35px;background:${isUser ? '#6b7280' : '#b91c1c'};color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">
          ${isUser ? '👤' : '🤖'}
        </div>
        <div style="background:${isUser ? '#b91c1c' : 'white'};color:${isUser ? 'white' : 'black'};padding:12px 16px;border-radius:15px;max-width:280px;box-shadow:0 2px 8px rgba(0,0,0,0.1);line-height:1.5;">
          ${text}
        </div>
      </div>
    `;
    
    messagesDiv.insertAdjacentHTML('beforeend', messageHTML);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  showTyping() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.insertAdjacentHTML('beforeend', `
      <div id="typing" style="display:flex;gap:10px;margin-bottom:15px;">
        <div style="width:35px;height:35px;background:#b91c1c;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;">🤖</div>
        <div style="background:white;padding:12px 16px;border-radius:15px;box-shadow:0 2px 8px rgba(0,0,0,0.1);color:#6b7280;font-style:italic;">
          Typing...
        </div>
      </div>
    `);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  hideTyping() {
    const typing = document.getElementById('typing');
    if (typing) typing.remove();
  }
}

// Start the chat when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ChatUI();
  });
} else {
  new ChatUI();
}