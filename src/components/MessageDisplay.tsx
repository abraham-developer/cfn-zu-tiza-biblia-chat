import React from 'react';
import { Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
}

interface MessageDisplayProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages, isLoading }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-8">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex gap-6 animate-fade-in ${
            message.type === 'user' ? 'justify-end' : 'justify-start'
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {message.type === 'ai' && (
            <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center flex-shrink-0 mt-1 relative overflow-hidden group border border-accent/30">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Bot className="w-6 h-6 text-accent relative z-10" />
            </div>
          )}
          
          <div className={`max-w-[70%] relative group ${message.type === 'user' ? 'animate-slide-up' : 'animate-fade-in'}`}>
            <div className={`rounded-3xl px-6 py-5 relative overflow-hidden backdrop-blur-xl border transition-all duration-300 ${
              message.type === 'user'
                ? 'bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground border-primary/50 shadow-xl shadow-primary/25'
                : 'glass-card text-foreground shadow-2xl border-white/20'
            }`}>
              {message.type === 'user' && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent"></div>
              )}
              
              <div className="relative z-10">
                <p className="text-base leading-relaxed font-medium mb-3">{message.content}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${
                    message.type === 'user' 
                      ? 'text-primary-foreground/60' 
                      : 'text-muted-foreground'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
                      <span className="text-xs text-accent font-medium">CFN Assistant</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {message.type === 'user' && (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 mt-1 shadow-xl shadow-primary/30 relative overflow-hidden group border border-primary/50">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <User className="w-6 h-6 text-primary-foreground relative z-10" />
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex gap-6 justify-start animate-fade-in">
          <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center flex-shrink-0 animate-pulse border border-accent/30">
            <Bot className="w-6 h-6 text-accent" />
          </div>
          <div className="glass-card rounded-3xl px-6 py-5 shadow-2xl border border-white/20">
            <div className="flex items-center gap-4">
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
              <span className="text-base text-muted-foreground font-medium">Consultando las Escrituras...</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{animationDelay: '200ms'}}></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{animationDelay: '400ms'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};