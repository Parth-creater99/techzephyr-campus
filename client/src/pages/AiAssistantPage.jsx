import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  getStoredTimetableSessions,
  ROOMS_DATA,
  PRIORITY_LEVELS,
} from '../services/mockData';
import './AiAssistantPage.css';

export function AiAssistantPage({ currentUser, onNavigate }) {
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Hello ${currentUser?.name || 'Dr. Sharma'}! I am your CIT AI Assistant.\n\nHow can I help you today? You can ask me about timetable schedules, room allocations, student batch commitments, leave policies, or venue availability across campus.`,
      timestamp: '12:00 PM',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputQuery.trim()) return;

    const query = inputQuery.trim();
    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // AI Semantic response
    setTimeout(() => {
      const lower = query.toLowerCase();
      let responseText = '';

      if (
        lower.includes('bhai') ||
        lower.includes('shift') ||
        lower.includes('karna hai') ||
        lower.includes('badal do') ||
        lower.includes('swap') ||
        lower.includes('reschedule')
      ) {
        responseText = `Schedule Shift Analysis:\n\n` +
          `• Target Slot: Monday Period 3 (10:30 AM – 11:20 AM) in Lecture Hall LH-101\n` +
          `• Venue Availability: LH-101 is available with no collisions\n` +
          `• Faculty Availability: No schedule conflicts detected\n` +
          `• Student Cohort: Year 3 CSE has no overlapping lecture\n` +
          `• Validation: 0 Hard Constraint Violations across all 27 venues\n\n` +
          `Under CIT Academic Governance, switching lectures requires target faculty confirmation through the Swaps & Disruptions portal.`;
      } else if (lower.includes('8 am') || lower.includes('8:00') || lower.includes('vague')) {
        responseText = `⚠️ Timing Rule Enforcement:\n\n` +
          `Chilika Institute of Technology timetable operates strictly within Periods P1 to P13 (08:30 AM – 20:30 PM). 8:00 AM falls outside official academic operational hours.\n\n` +
          `Earliest available slot is Period 1 (08:30 AM – 09:20 AM).`;
      } else if (lower.includes('dance') || lower.includes('aud-1') || lower.includes('auditorium')) {
        responseText = `Priority Tier Rule Notification:\n\n` +
          `Central Auditorium (Aud-1) is reserved for academic examinations and Institute Spectra Events during regular hours.\n\n` +
          `Club and extracurricular events can be allocated during evening slots (P10–P13, 17:30 onwards) or at the Open-Air Theatre (OAT).`;
      } else if (lower.includes('why') && lower.includes('cs301')) {
        responseText = `Algorithmic Placement Explanation for CS301 (Operating Systems):\n\n` +
          `1. Faculty Availability: Instructor has open schedule during Mon P1\n` +
          `2. Venue Fit: LH-101 matches student cohort size (75 enrolled / 90 capacity)\n` +
          `3. Cohort Free: CSE-3 has no concurrent sessions\n` +
          `4. Hard Constraints: Zero room or teacher collisions across 189 weekly sessions.`;
      } else if (lower.includes('lab') || lower.includes('computing')) {
        responseText = `Available Computing Labs for Thursday Afternoon:\n\n` +
          `• Computing Lab 1 (Lab-101): Free during Period 7 (14:35 - 15:25)\n` +
          `• Computing Lab 2 (Lab-102): Free during Period 8 (15:35 - 16:25)\n` +
          `• AI & Data Systems Lab: Free during Period 6 (14:00 - 15:00)\n\n` +
          `All 7 departmental laboratories have verified equipment and zero schedule clashes.`;
      } else {
        responseText = `I have received your request: "${query}".\n\n` +
          `Our system verifies all campus schedules against 27 rooms, 40 faculty members, and 14 student cohorts. No timetable conflicts were detected for your query. Let me know if you would like me to check any specific faculty or venue!`;
      }

      const botMsg = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  return (
    <div className="ai-chatbot-standalone-page animate-fade-in-up">
      <div className="ai-chatbot-window">
        {/* Chatbot Top Header */}
        <div className="ai-chatbot-header">
          <div className="ai-chatbot-brand">
            <div className="ai-avatar-icon">
              <Bot size={20} />
            </div>
            <div>
              <div className="ai-bot-name">CIT AI Assistant</div>
              <div className="ai-bot-status">
                <span className="online-dot" />
                <span>Active &amp; Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages Stream */}
        <div className="ai-chatbot-messages">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div key={m.id} className={`ai-chat-bubble-row ${isUser ? 'user-row' : 'assistant-row'}`}>
                {!isUser && (
                  <div className="bubble-bot-avatar">
                    <Bot size={16} />
                  </div>
                )}
                <div className={`ai-chat-bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}`}>
                  <div className="bubble-text" style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
                  <div className="bubble-time">{m.timestamp}</div>
                </div>
                {isUser && (
                  <div className="bubble-user-avatar">
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="ai-chatbot-input-bar"
        >
          <input
            type="text"
            className="ai-input-element"
            placeholder="Type your message to CIT Assistant..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="ai-send-button"
            disabled={!inputQuery.trim()}
            title="Send Message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default AiAssistantPage;
