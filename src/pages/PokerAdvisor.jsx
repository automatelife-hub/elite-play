import React, { useState, useEffect, useRef } from "react";
import { db } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User as UserIcon, Loader2, MessageSquare, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import MessageBubble from "../components/advisor/MessageBubble";

export default function PokerAdvisor() {
  const [user, setUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = async () => {
    try {
      const currentUser = await db.auth.me();
      setUser(currentUser);

      const conversations = await db.agents.listConversations({
        agent_name: "poker_advisor"
      });

      let conv;
      if (conversations.length > 0) {
        conv = await db.agents.getConversation(conversations[0].id);
      } else {
        conv = await db.agents.createConversation({
          agent_name: "poker_advisor",
          metadata: {
            name: "Poker Advisor Chat",
            description: "Chat with your personal poker advisor"
          }
        });
      }

      setConversation(conv);
      setMessages(conv.messages || []);

      const unsubscribe = db.agents.subscribeToConversation(conv.id, (data) => {
        setMessages(data.messages);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error initializing chat:", error);
      toast.error("Failed to initialize chat");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !conversation) return;

    setSending(true);
    const messageContent = inputMessage;
    setInputMessage("");

    try {
      await db.agents.addMessage(conversation, {
        role: "user",
        content: messageContent
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setInputMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  const whatsappURL = db.agents.getWhatsAppConnectURL('poker_advisor');

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your poker advisor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Bot className="w-10 h-10 text-yellow-400" />
                Poker Advisor AI
              </h1>
              <p className="text-gray-400">Get expert advice on poker sites, strategies, and your performance</p>
            </div>
            <a href={whatsappURL} target="_blank" rel="noopener noreferrer">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>

        <Card className="bg-gray-900 border-gray-800 shadow-2xl">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              Chat with PokerPro AI
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Bot className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-300">Start a conversation</h3>
                    <p className="text-gray-500 mb-6">Ask me anything about poker sites, strategies, or your stats!</p>
                    <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                      <Button
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 justify-start"
                        onClick={() => setInputMessage("What's the best poker site for beginners?")}
                      >
                        What's the best poker site for beginners?
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 justify-start"
                        onClick={() => setInputMessage("Explain the welcome bonuses available")}
                      >
                        Explain the welcome bonuses available
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 justify-start"
                        onClick={() => setInputMessage("How can I improve my poker game?")}
                      >
                        How can I improve my poker game?
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 justify-start"
                        onClick={() => setInputMessage("Analyze my recent performance")}
                      >
                        Analyze my recent performance
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <MessageBubble key={index} message={message} />
                    ))}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-800 p-4 bg-gray-900/50">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about poker sites, strategies, bonuses..."
                    className="bg-gray-800 border-gray-700 text-white flex-1"
                    disabled={sending}
                  />
                  <Button
                    type="submit"
                    disabled={sending || !inputMessage.trim()}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  AI-powered advice • Always gamble responsibly
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}