import React, { useState } from 'react';
import { 
  Book, 
  Search, 
  Bookmark, 
  Heart, 
  Calendar, 
  Users, 
  Settings, 
  ChevronDown,
  Cross,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToolsMenuProps {
  onToolSelect: (tool: string) => void;
}

export const ToolsMenu: React.FC<ToolsMenuProps> = ({ onToolSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tools = [
    { id: 'verse-search', icon: Search, label: 'Buscar Versículos', color: 'from-blue-500 to-blue-600' },
    { id: 'bible-study', icon: Book, label: 'Estudio Bíblico', color: 'from-green-500 to-green-600' },
    { id: 'devotional', icon: Heart, label: 'Devocional', color: 'from-red-500 to-red-600' },
    { id: 'prayer-request', icon: Cross, label: 'Petición de Oración', color: 'from-purple-500 to-purple-600' },
    { id: 'events', icon: Calendar, label: 'Eventos', color: 'from-yellow-500 to-yellow-600' },
    { id: 'community', icon: Users, label: 'Comunidad', color: 'from-indigo-500 to-indigo-600' },
  ];

  return (
    <div className="relative">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="glass-card rounded-2xl px-6 py-3 bg-gradient-to-r from-accent/20 to-accent/30 hover:from-accent/30 hover:to-accent/40 border border-accent/30 shadow-lg transition-all duration-300 group"
      >
        <Sparkles className="w-5 h-5 text-accent mr-2" />
        <span className="text-foreground font-medium">Herramientas</span>
        <ChevronDown className={`w-4 h-4 ml-2 text-accent transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </Button>

      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 w-80 glass-card rounded-2xl p-4 border border-white/20 shadow-2xl z-50 animate-fade-in">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Herramientas Espirituales
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  onToolSelect(tool.id);
                  setIsExpanded(false);
                }}
                className="group relative overflow-hidden rounded-xl p-4 glass border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <tool.icon className="w-6 h-6 text-accent group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium text-foreground text-center leading-tight">
                    {tool.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <button className="w-full glass rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors duration-300">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Configuración</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};