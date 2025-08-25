import React, { useState, useRef, useEffect } from 'react';
import { Crown, Shield, Star } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToolsMenu } from './ToolsMenu';
import { MessageDisplay } from './MessageDisplay';
import { InputArea } from './InputArea';
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
      content: 'Bienvenido al Santuario Digital de CFN Zumpango Tizayuca. Soy tu guía espiritual con IA, especializado en estudios bíblicos, teología pentecostal y crecimiento espiritual. ¿Cómo puedo acompañarte en tu caminar con Cristo hoy?',
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
      // API call placeholder - mantiene la funcionalidad exacta
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `He recibido tu consulta sobre "${inputValue}". Como tu guía espiritual digital, estoy procesando tu petición a través de mis conocimientos bíblicos y teológicos. Esta interfaz está lista para conectarse con tu API personalizada para brindarte respuestas profundas basadas en las Sagradas Escrituras.`,
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

  const handleToolSelect = (toolId: string) => {
    // Funcionalidad para cuando se selecciona una herramienta
    const toolMessages = {
      'verse-search': 'Quiero buscar versículos bíblicos específicos',
      'bible-study': 'Me gustaría hacer un estudio bíblico profundo',
      'devotional': 'Necesito una reflexión devocional',
      'prayer-request': 'Tengo una petición de oración',
      'events': 'Quiero saber sobre eventos de la iglesia',
      'community': 'Me interesa conectar con la comunidad'
    };

    const toolMessage = toolMessages[toolId as keyof typeof toolMessages];
    if (toolMessage) {
      setInputValue(toolMessage);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden relative">
      {/* Cosmic background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]"></div>
      
      {/* Sacred Header */}
      <div className="relative z-10">
        <div className="glass border-b border-white/10 backdrop-blur-3xl">
          <div className="flex items-center justify-between px-8 py-6">
            {/* Logo and Title Section */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-accent/50 via-primary/50 to-accent/50 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
                <div className="relative glass-card rounded-2xl p-3 border border-accent/30">
                  <img 
                    src={cfnLogo} 
                    alt="CFN Zumpango Tizayuca" 
                    className="h-12 w-auto"
                  />
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent">
                    CFN Zumpango Tizayuca
                  </h1>
                  <Crown className="w-5 h-5 text-accent" />
                </div>
                <p className="text-sm text-white/60 font-medium flex items-center gap-2 mt-1">
                  <Shield className="w-4 h-4" />
                  Santuario Digital · Guía Espiritual IA
                  <Star className="w-3 h-3 animate-pulse" />
                </p>
              </div>
            </div>

            {/* Tools Menu */}
            <ToolsMenu onToolSelect={handleToolSelect} />
          </div>
        </div>
      </div>

      {/* Sanctuary Content Area */}
      <ScrollArea className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent"></div>
        <div className="relative px-8 py-12">
          <div className="max-w-5xl mx-auto">
            <MessageDisplay messages={messages} isLoading={isLoading} />
            <div ref={messagesEndRef} />
          </div>
        </div>
      </ScrollArea>

      {/* Sacred Input Sanctuary */}
      <div className="relative z-10 p-8">
        <div className="max-w-5xl mx-auto">
          <InputArea
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            isLoading={isLoading}
            inputRef={inputRef}
          />
        </div>
      </div>
    </div>
  );
};