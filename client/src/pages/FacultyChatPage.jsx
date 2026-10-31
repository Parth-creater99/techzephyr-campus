import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  User,
  CheckCheck,
  Sparkles,
  Phone,
  Video,
  Info,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import {
  getStoredFacultyList,
  INITIAL_FACULTY_CHATS,
} from '../services/mockData';
import './FacultyChatPage.css';

export function FacultyChatPage({ currentUser, initialFacultyName, onNavigate }) {
  const [facultyList] = useState(getStoredFacultyList);
  const [activeFaculty, setActiveFaculty] = useState(() => {
    if (initialFacultyName) {
      const match = facultyList.find((f) => f.name === initialFacultyName);
      if (match) return match;
    }
    return facultyList[0] || { name: 'Dr. A. Sharma', dept: 'CSE', designation: 'Professor & Head', cabin: 'A-201' };
  });

  const [chatThreads, setChatThreads] = useState(() => {
    try {
      const saved = localStorage.getItem('cit_faculty_chats_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_FACULTY_CHATS;
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchFaculty, setSearchFaculty] = useState('');

  const messagesEndRef = useRef(null);

  const activeMessages = chatThreads[activeFaculty.name] || [
    {
      id: 'default-welcome',
      sender: 'them',
      text: `Hello! I am ${activeFaculty.name} from ${activeFaculty.dept} department. How can I assist you with scheduling or lectures today?`,
      time: 'Just now',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, isTyping]);

  useEffect(() => {
    if (initialFacultyName) {
      const found = facultyList.find((f) => f.name === initialFacultyName);
      if (found) setActiveFaculty(found);
    }
  }, [initialFacultyName, facultyList]);

  const handleSendMessage = (textToSend = inputText) => {
    const text = textToSend.trim();
    if (!text) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedThread = [...activeMessages, newMsg];
    const newChatThreads = {
      ...chatThreads,
      [activeFaculty.name]: updatedThread,
    };

    setChatThreads(newChatThreads);
    localStorage.setItem('cit_faculty_chats_v2', JSON.stringify(newChatThreads));
    setInputText('');

    // Simulate authentic responsive faculty reply
    setIsTyping(true);
    setTimeout(() => {
      let replyText = `Thanks for your note regarding CIT scheduling. I have noted this and will coordinate with the department office.`;
      const lower = text.toLowerCase();
      if (lower.includes('swap') || lower.includes('reschedule')) {
        replyText = `Understood! I will approve your lecture swap request for that period on the Smart.CIT portal. No clash detected!`;
      } else if (lower.includes('lab') || lower.includes('room') || lower.includes('venue')) {
        replyText = `Confirmed! The venue is free and available during that period window. Projector and workstations are ready.`;
      } else if (lower.includes('spectra') || lower.includes('event')) {
        replyText = `Excellent. I have verified the Spectra booking request for P10–P13 at the Central Auditorium. Best of luck!`;
      } else if (lower.includes('exam') || lower.includes('midsem')) {
        replyText = `The 41 mid-sem exam hall seatings have been mapped. Invigilation roster is synchronized.`;
      }

      const facultyReply = {
        id: `reply-${Date.now()}`,
        sender: 'them',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const withReplyThread = [...updatedThread, facultyReply];
      const finalizedChats = {
        ...newChatThreads,
        [activeFaculty.name]: withReplyThread,
      };

      setChatThreads(finalizedChats);
      localStorage.setItem('cit_faculty_chats_v2', JSON.stringify(finalizedChats));
      setIsTyping(false);
    }, 1200);
  };

  const quickPrompts = [
    'Can we swap Thursday P3 slot?',
    'Is Computing Lab-1 available during P6?',
    'Confirm Spectra event supervision for P11.',
    'Sharing updated Midsem question paper format.',
  ];

  const filteredFaculty = facultyList.filter((f) =>
    f.name.toLowerCase().includes(searchFaculty.toLowerCase()) ||
    f.dept.toLowerCase().includes(searchFaculty.toLowerCase())
  );

  return (
    <div className="subpage-container animate-fade-in-up">
      <div className="faculty-chat-layout">
        {/* Left Sidebar: Faculty Conversation List */}
        <div className="chat-faculty-sidebar">
          <div className="chat-sidebar-header">
            <h2 className="chat-title">Faculty Conversations</h2>
            <span className="chat-count-pill">{facultyList.length} Teachers Online</span>
          </div>

          <div className="chat-search-bar">
            <Search size={16} className="chat-search-icon" />
            <input
              type="text"
              placeholder="Search faculty or dept..."
              value={searchFaculty}
              onChange={(e) => setSearchFaculty(e.target.value)}
              className="chat-search-input"
            />
          </div>

          <div className="chat-faculty-list-scroll">
            {filteredFaculty.map((f) => {
              const isSelected = activeFaculty.name === f.name;
              return (
                <div
                  key={f.id}
                  className={`chat-faculty-item ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveFaculty(f)}
                >
                  <div className="chat-item-avatar">
                    {f.name.replace('Dr. ', '').replace('Prof. ', '').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="chat-item-info">
                    <div className="chat-item-name-row">
                      <span className="chat-item-name">{f.name}</span>
                      <span className="chat-item-dept">{f.dept}</span>
                    </div>
                    <span className="chat-item-snippet">
                      Cabin: {f.cabin} &bull; {f.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Main Chat Canvas */}
        <div className="chat-main-window">
          {/* Active Chat Header */}
          <div className="chat-header-bar">
            <div className="chat-header-faculty-info">
              <div className="active-header-avatar">
                {activeFaculty.name.replace('Dr. ', '').replace('Prof. ', '').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="active-faculty-name">{activeFaculty.name}</h3>
                <span className="active-faculty-sub">
                  {activeFaculty.designation} &bull; Department of {activeFaculty.dept} &bull; Cabin: {activeFaculty.cabin}
                </span>
              </div>
            </div>

            <div className="chat-header-actions">
              <button
                type="button"
                className="chat-quick-action-btn"
                onClick={() => onNavigate?.('timetable')}
                title="View in Timetable"
              >
                <Calendar size={16} />
                <span>View Schedule</span>
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="chat-quick-chips">
            <span className="quick-chip-label">Quick Prompts:</span>
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                className="prompt-chip-btn"
                onClick={() => handleSendMessage(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Thread Container */}
          <div className="chat-messages-container">
            {activeMessages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div
                  key={msg.id}
                  className={`chat-bubble-row ${isMe ? 'row-outgoing' : 'row-incoming'}`}
                >
                  <div className={`chat-bubble ${isMe ? 'bubble-outgoing' : 'bubble-incoming'}`}>
                    <div className="bubble-text">{msg.text}</div>
                    <div className="bubble-meta">
                      <span className="bubble-time">{msg.time}</span>
                      {isMe && <CheckCheck size={14} className="check-icon" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="chat-bubble-row row-incoming">
                <div className="chat-bubble bubble-incoming typing-indicator">
                  <span>{activeFaculty.name} is typing</span>
                  <span className="dot dot-1" />
                  <span className="dot dot-2" />
                  <span className="dot dot-3" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            className="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              placeholder={`Message ${activeFaculty.name} as ${currentUser?.name || 'Faculty'}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="chat-input-field"
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!inputText.trim()}
              aria-label="Send message"
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FacultyChatPage;
