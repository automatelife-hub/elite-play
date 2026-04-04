import React, { useState, useEffect, useRef } from "react";
import { db } from "@/api/supabaseClient";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, MessageSquare, Zap, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import MessageBubble from "@/components/advisor/MessageBubble";
import GIAMascot from "@/components/ui/GIAMascot";
import MissionButton from "@/components/ui/MissionButton";
import TacticalBadge from "@/components/ui/TacticalBadge";
import HUDCard from "@/components/ui/HUDCard";
import { generateQuickIntel, QUICK_INTEL_TOPICS } from "@/api/huggingFaceService";

// ─── Loading screen ───────────────────────────────────────────────────────────

function TacticalLoader() {
  const lines = [
    'INITIALIZING GIA SYSTEMS...',
    'ESTABLISHING SECURE CHANNEL...',
    'LOADING POKER INTELLIGENCE DB...',
    'READY.',
  ];
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    lines.forEach((_, i) => {
      setTimeout(() => setVisible(v => [...v, i]), i * 500);
    });
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#0A0E27' }}
    >
      <div className="text-center">
        <GIAMascot size="large" status="active" showMessage={false} />
        <div className="mt-6 space-y-2">
          {lines.map((line, i) => (
            <div
              key={i}
              className="text-sm transition-opacity duration-500"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                color: i === lines.length - 1 ? '#00FF41' : 'rgba(0,217,255,0.7)',
                opacity: visible.includes(i) ? 1 : 0,
                letterSpacing: '2px',
              }}
            >
              ▸ {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Quick Intel panel ────────────────────────────────────────────────────────

function QuickIntelPanel() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [intelResult, setIntelResult] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!selectedTopic) return;
    setGenerating(true);
    setIntelResult('');
    setError('');

    try {
      const topic = QUICK_INTEL_TOPICS.find(t => t.id === selectedTopic);
      const text = await generateQuickIntel(topic.prompt());
      setIntelResult(text);
    } catch (err) {
      const msgs = {
        HF_RATE_LIMIT: 'Rate limit reached. Add VITE_HF_TOKEN to your .env for higher limits.',
        HF_AUTH:       'Invalid HF token. Check your VITE_HF_TOKEN env variable.',
        HF_ERROR:      'Could not reach HuggingFace API. Check your connection.',
      };
      setError(msgs[err.message] || 'Unknown error generating intel.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <HUDCard glow="gold" className="mb-6">
      <HUDCard.Header>
        <HUDCard.Title style={{ color: '#FFD700', textShadow: '0 0 8px rgba(255,215,0,0.4)' }}>
          <Zap className="inline w-4 h-4 mr-2" />
          QUICK INTEL — Open Source AI
        </HUDCard.Title>
        <TacticalBadge level="intel">Mistral-7B</TacticalBadge>
      </HUDCard.Header>

      <HUDCard.Content>
        <p className="text-xs mb-4 text-gray-500" style={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}>
          ONE-SHOT INTELLIGENCE FROM AN OPEN SOURCE MODEL (HUGGING FACE)
        </p>

        {/* Topic selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {QUICK_INTEL_TOPICS.map(topic => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className="px-3 py-1.5 text-xs transition-all duration-200"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '1px',
                border: `1px solid ${selectedTopic === topic.id ? '#FFD700' : 'rgba(0,217,255,0.3)'}`,
                background: selectedTopic === topic.id ? 'rgba(255,215,0,0.1)' : 'transparent',
                color: selectedTopic === topic.id ? '#FFD700' : 'rgba(0,217,255,0.7)',
                cursor: 'pointer',
              }}
            >
              {topic.label}
            </button>
          ))}
        </div>

        <MissionButton
          variant="gold"
          size="sm"
          onClick={handleGenerate}
          disabled={!selectedTopic || generating}
        >
          {generating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> GENERATING INTEL...</>
          ) : (
            <><ChevronRight className="w-4 h-4" /> GENERATE INTEL</>
          )}
        </MissionButton>

        {/* Result */}
        {intelResult && (
          <div
            className="mt-4 p-3 text-xs leading-relaxed whitespace-pre-wrap"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: '#00D9FF',
              border: '1px solid rgba(0,217,255,0.2)',
              background: 'rgba(0,217,255,0.03)',
              letterSpacing: '0.5px',
            }}
          >
            {intelResult}
          </div>
        )}

        {error && (
          <div
            className="mt-4 p-3 text-xs"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: '#FF0033',
              border: '1px solid rgba(255,0,51,0.3)',
              background: 'rgba(255,0,51,0.05)',
            }}
          >
            ⚠ {error}
          </div>
        )}
      </HUDCard.Content>
    </HUDCard>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PokerAdvisor() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { initializeChat(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const initializeChat = async () => {
    try {
      const conversations = await db.agents.listConversations({ agent_name: "poker_advisor" });
      let conv;
      if (conversations.length > 0) {
        conv = await db.agents.getConversation(conversations[0].id);
      } else {
        conv = await db.agents.createConversation({
          agent_name: "poker_advisor",
          metadata: { name: "Poker Advisor Chat", description: "Chat with GIA — your personal poker advisor" }
        });
      }
      setConversation(conv);
      setMessages(conv.messages || []);
      const unsubscribe = db.agents.subscribeToConversation(conv.id, (data) => {
        setMessages(data.messages);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error("Error initializing chat:", err);
      toast.error("Failed to initialize GIA channel");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !conversation) return;
    setSending(true);
    const content = inputMessage;
    setInputMessage("");
    try {
      await db.agents.addMessage(conversation, { role: "user", content });
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
      setInputMessage(content);
    } finally {
      setSending(false);
    }
  };

  const whatsappURL = db.agents.getWhatsAppConnectURL('poker_advisor');

  if (loading) return <TacticalLoader />;

  const PROMPT_SUGGESTIONS = [
    "Best poker site for beginners?",
    "Explain the top welcome bonuses",
    "How do I improve my poker game?",
    "Bankroll management basics",
  ];

  return (
    <div className="min-h-screen py-10" style={{ background: '#0A0E27' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <GIAMascot size="small" status="active" />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1
                  className="text-2xl md:text-3xl font-bold"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: '#00D9FF',
                    textShadow: '0 0 15px rgba(0,217,255,0.5)',
                    letterSpacing: '3px',
                  }}
                >
                  GIA INTELLIGENCE ADVISOR
                </h1>
                <TacticalBadge level="active" glow>ONLINE</TacticalBadge>
              </div>
              <p
                className="text-xs tracking-widest"
                style={{ fontFamily: "'Share Tech Mono', monospace", color: 'rgba(0,217,255,0.5)' }}
              >
                SECURE CHANNEL • AI-POWERED POKER & iGAMING INTELLIGENCE
              </p>
            </div>
          </div>
          <a href={whatsappURL} target="_blank" rel="noopener noreferrer">
            <MissionButton variant="secondary" size="sm">
              <MessageSquare className="w-4 h-4" />
              WHATSAPP
            </MissionButton>
          </a>
        </div>

        {/* ── Quick Intel Panel (open source model) ── */}
        <QuickIntelPanel />

        {/* ── Chat panel ── */}
        <HUDCard glow="cyan">
          <HUDCard.Header>
            <HUDCard.Title>LIVE INTELLIGENCE CHANNEL</HUDCard.Title>
            <TacticalBadge level="topSecret">CLASSIFIED</TacticalBadge>
          </HUDCard.Header>

          <div style={{ height: '560px', display: 'flex', flexDirection: 'column' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-10">
                  <GIAMascot size="medium" status="active" showMessage={true} message="AWAITING YOUR QUERY" />
                  <p
                    className="text-sm mt-4 mb-6"
                    style={{ fontFamily: "'Share Tech Mono', monospace", color: 'rgba(0,217,255,0.5)', letterSpacing: '1px' }}
                  >
                    ASK ME ANYTHING ABOUT POKER SITES, STRATEGIES, OR BONUSES
                  </p>
                  <div className="grid md:grid-cols-2 gap-2 max-w-2xl mx-auto">
                    {PROMPT_SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setInputMessage(s)}
                        className="text-left px-3 py-2 text-xs transition-all duration-200 hover:border-cyan-400"
                        style={{
                          fontFamily: "'Share Tech Mono', monospace",
                          color: 'rgba(0,217,255,0.7)',
                          border: '1px solid rgba(0,217,255,0.2)',
                          background: 'rgba(0,217,255,0.03)',
                          letterSpacing: '0.5px',
                          cursor: 'pointer',
                        }}
                      >
                        ▸ {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <MessageBubble key={index} message={message} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="p-4"
              style={{ borderTop: '1px solid rgba(0,217,255,0.2)', background: 'rgba(0,217,255,0.02)' }}
            >
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="TRANSMIT YOUR QUERY..."
                  disabled={sending}
                  className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    color: '#00D9FF',
                    border: '1px solid rgba(0,217,255,0.3)',
                    letterSpacing: '1px',
                  }}
                />
                <MissionButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={sending || !inputMessage.trim()}
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </MissionButton>
              </form>
              <p
                className="text-xs mt-2 text-center"
                style={{ fontFamily: "'Share Tech Mono', monospace", color: 'rgba(0,217,255,0.3)', letterSpacing: '1px' }}
              >
                GIA INTELLIGENCE • ALWAYS GAMBLE RESPONSIBLY
              </p>
            </div>
          </div>
        </HUDCard>
      </div>
    </div>
  );
}
