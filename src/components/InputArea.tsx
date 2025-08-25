import React from 'react';
import { Send, Mic, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const InputArea: React.FC<InputAreaProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  isLoading,
  inputRef
}) => {
  return (
    <div className="relative">
      <div className="glass-card rounded-3xl p-6 shadow-2xl border border-white/20 relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex gap-4 items-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="glass rounded-full p-3 hover:bg-white/10 transition-colors duration-300"
            >
              <Plus className="w-5 h-5 text-muted-foreground" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyPress={onKeyPress}
                placeholder="Comparte tu consulta espiritual o pregunta bíblica..."
                className="glass-input pr-16 py-5 text-base rounded-2xl border-0 bg-white/5 backdrop-blur-sm placeholder:text-white/40 text-foreground focus:ring-2 focus:ring-accent/50 transition-all duration-300 font-medium"
                disabled={isLoading}
              />
              
              {/* Voice input button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 glass rounded-xl p-2 hover:bg-white/10 transition-colors duration-300"
              >
                <Mic className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

            <Button
              onClick={onSend}
              disabled={!value.trim() || isLoading}
              className="rounded-2xl px-8 py-5 bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 border border-primary/50 shadow-xl shadow-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Send className="w-5 h-5 relative z-10" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>Presiona <kbd className="px-2 py-1 bg-white/10 rounded-lg text-xs">Enter</kbd> para enviar</span>
              <span>•</span>
              <span>IA entrenada en teología cristiana</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Conectado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};