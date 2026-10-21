import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HelpCircle, MessageSquare, ChevronDown, ChevronUp, BookOpen, Send, ShieldCheck } from 'lucide-react';

interface FAQ {
  q: string;
  a: string;
  category: string;
}

export const HelpCenterView: React.FC = () => {
  const { user } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [chatMessages, setChatMessages] = useState<
    { sender: 'bot' | 'user'; text: string; time: string }[]
  >([
    {
      sender: 'bot',
      text: 'Hello! Welcome to Zenith Arena 24/7 Sandbox Support. How can we assist you with our sportsbook, casino originals, or Telebirr gateway today?',
      time: '12:00',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const faqs: FAQ[] = [
    {
      category: 'Telebirr & Payments',
      q: 'How does the Telebirr Sandbox deposit work?',
      a: 'The Telebirr integration simulates the official Ethio Telecom Direct Pay and H5 Web flow. You enter a valid Ethiopian mobile number (09... or 07...) and deposit amount. A simulated USSD push authorization notification is dispatched. Once confirmed, virtual ETB demo credits are immediately added to your ledger.',
    },
    {
      category: 'Sports Betting',
      q: 'How are Accumulator (Parlay) odds and potential payouts calculated?',
      a: 'In an Accumulator bet, the odds of each individual selection are multiplied together to determine the total multiplier. If all selected events win, your stake is multiplied by the combined odds. If any selection loses, the entire accumulator is settled as Lost.',
    },
    {
      category: 'Sports Betting',
      q: 'What is the Early Cash Out feature?',
      a: 'Early Cash Out allows you to lock in returns or limit potential losses while a sports fixture is still in progress. The cash out amount updates dynamically according to the live score and remaining match time.',
    },
    {
      category: 'Casino Originals',
      q: 'Are the casino games provably fair?',
      a: 'Yes. All Zenith Originals (Aviator Crash, Fruit Slots, Royal Keno, European Roulette) generate round results using a cryptographic seed pair and HMAC-SHA256 nonces. Players can audit any round result independently in the provably fair inspector.',
    },
    {
      category: 'Compliance',
      q: 'Can virtual credits be redeemed for real money?',
      a: 'No. All virtual balances, payouts, and transaction references in this platform are strictly for demonstration, developer integration, and sandbox testing without real-money transfers.',
    },
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const input = chatInput.toLowerCase();
    setChatInput('');

    // Automated smart simulation bot response
    setTimeout(() => {
      let botReply =
        'Thank you for reaching out. A Zenith customer agent has verified your request and confirmed your sandbox account status is in good standing.';
      if (input.includes('telebirr') || input.includes('deposit')) {
        botReply =
          'Regarding Telebirr: Sandbox deposits simulate the official Ethio Telecom USSD push protocol. Check the "Wallet" tab or Telebirr Modal documentation for live merchant prerequisites.';
      } else if (input.includes('crash') || input.includes('multiplier')) {
        botReply =
          'Zenith Aviator Crash is designed with a 97.0% RTP curve. Auto-cashout can be set on any round to lock in multipliers automatically!';
      } else if (input.includes('odds') || input.includes('payout')) {
        botReply =
          'Sportsbook odds update automatically in real-time via the integrated Sportradar and Zenith provider adapter feeds.';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-emerald-400" />
          <span>Zenith Help Center & Live Assistance</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore frequently asked questions, game rule manuals, and interactive 24/7 sandbox support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left 3 cols: FAQs & Guides */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Frequently Asked Questions</span>
          </h2>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#0F1420] border border-[#1E2638] rounded-xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-500" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-[#171F2E] pt-3">
                      <p>{faq.a}</p>
                      <div className="mt-2 text-[10px] text-emerald-400 font-mono">
                        Category: {faq.category}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 cols: Live Chat Simulation Widget */}
        <div className="lg:col-span-2 bg-[#0F1420] border border-[#1E2638] rounded-2xl flex flex-col h-[460px] shadow-xl overflow-hidden">
          {/* Chat Header */}
          <div className="p-3.5 bg-[#0B0E16] border-b border-[#1A2233] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white">Live Support Agent</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Avg Reply: &lt; 1 min</span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-black font-medium'
                      : 'bg-[#151D2C] text-slate-200 border border-[#212E42]'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleSendChat} className="p-3 bg-[#0A0D15] border-t border-[#1A2233] flex gap-2">
            <input
              type="text"
              placeholder="Ask support about odds, games or Telebirr..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-[#141B28] border border-[#222E42] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg text-xs font-bold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
