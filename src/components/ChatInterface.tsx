import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import cfnLogo from '@/assets/cfn-logo.png';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Bienvenido! Soy tu asistente bíblico de CFN Zumpango Tizayuca. Estoy aquí para ayudarte con preguntas sobre la Biblia, estudios bíblicos y temas de fe. ¿En qué puedo ayudarte hoy?',
      type: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Aquí iría la llamada a tu API
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: inputValue })
      // });
      // const data = await response.json();

      // Simulando respuesta de la API por ahora
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Gracias por tu pregunta sobre "${inputValue}". Como tu asistente bíblico, estoy aquí para ayudarte con estudios de la palabra de Dios. Por favor conecta esta interfaz a tu API para recibir respuestas completas basadas en las Escrituras.`,
          type: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Floating Header with Glassmorphism */}
      <div className="relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20"></div>
        <div className="relative glass border-b border-white/10 backdrop-blur-2xl">
          <div className="flex items-center justify-center gap-4 px-6 py-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-primary/50 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <img 
                src={cfnLogo} 
                alt="CFN Zumpango Tizayuca" 
                className="relative h-12 w-auto rounded-lg bg-white/10 p-2 backdrop-blur-sm"
              />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent">
                CFN Zumpango Tizayuca
              </h1>
              <p className="text-sm text-white/70 font-light flex items-center gap-1 justify-center">
                <Sparkles className="w-3 h-3" />
                Asistente Bíblico AI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area with Glass Background */}
      <ScrollArea className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="relative px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-4 animate-fade-in ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {message.type === 'ai' && (
                  <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center flex-shrink-0 mt-1 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Bot className="w-5 h-5 text-accent relative z-10" />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] relative group ${
                    message.type === 'user'
                      ? 'animate-slide-up'
                      : 'animate-fade-in'
                  }`}
                >
                  <div
                    className={`rounded-2xl px-5 py-4 relative overflow-hidden backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] ${
                      message.type === 'user'
                        ? 'bg-primary/90 text-primary-foreground border-primary/50 shadow-lg shadow-primary/25'
                        : 'glass-card text-foreground shadow-xl'
                    }`}
                  >
                    {message.type === 'user' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    )}
                    <p className="text-sm leading-relaxed relative z-10 font-medium">{message.content}</p>
                    <span className={`text-xs mt-3 block relative z-10 ${
                      message.type === 'user' 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-primary/25 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <User className="w-5 h-5 text-primary-foreground relative z-10" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 justify-start animate-fade-in">
                <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center flex-shrink-0 animate-glow">
                  <Bot className="w-5 h-5 text-accent" />
                </div>
                <div className="glass-card rounded-2xl px-5 py-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    <span className="text-sm text-muted-foreground font-medium">Escribiendo...</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-accent rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-1 h-1 bg-accent rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-1 h-1 bg-accent rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </ScrollArea>

      {/* Floating Input Area */}
      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-4 shadow-2xl border border-white/20">
            <div className="flex gap-4 items-end">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta bíblica aquí..."
                  className="glass-input pr-4 py-4 text-base rounded-xl border-0 bg-white/5 backdrop-blur-sm placeholder:text-white/50 text-foreground focus:ring-2 focus:ring-accent/50 transition-all duration-300"
                  disabled={isLoading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 pointer-events-none"></div>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="rounded-xl px-6 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary border border-primary/50 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Send className="w-5 h-5 relative z-10" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-4 font-light">
              Presiona <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Enter</kbd> para enviar • CFN Zumpango Tizayuca
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};