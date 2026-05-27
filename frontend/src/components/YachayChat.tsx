import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface Props {
  courseSlug?: string;
}

export default function YachayChat({ courseSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: '¡Allillanchu! Soy Yachay, tu asistente de aprendizaje. ¿En qué puedo ayudarte hoy? 🌄' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post<{ reply: string }>('/yachay/chat', { message: text, courseSlug });
      setMessages((m) => [...m, { role: 'assistant', text: res.reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: 'Lo siento, no pude conectarme. Verifica que el servidor esté corriendo.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-andean-600 hover:bg-andean-700 text-white rounded-full shadow-lg p-4 transition-all duration-300 ${open ? 'scale-0' : 'scale-100'}`}
        aria-label="Hablar con Yachay"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-forest-500 rounded-full animate-pulse" />
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden" style={{ maxHeight: '520px' }}>
          {/* Header */}
          <div className="bg-andean-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-andean-500 rounded-full flex items-center justify-center text-sm font-bold">Y</div>
              <div>
                <p className="font-semibold text-sm">Yachay</p>
                <p className="text-xs text-andean-200">Asistente de Allin Yachay</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="hover:bg-andean-600 p-1 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-andean-600 text-white rounded-br-sm'
                      : 'bg-white text-stone-700 shadow-sm border border-stone-100 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm border border-stone-100">
                  <Loader2 className="w-4 h-4 animate-spin text-andean-500" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-stone-200 bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 text-sm border border-stone-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-andean-300 focus:border-andean-400 transition-all"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="bg-andean-600 hover:bg-andean-700 disabled:opacity-40 text-white p-2 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
