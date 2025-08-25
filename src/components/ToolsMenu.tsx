// src/components/ToolsMenuFloating.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Book,
  Search,
  Heart,
  Users,
  Wrench,
  Image,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  size,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
} from "@floating-ui/react";

interface ToolsMenuProps {
  /** Texto o id que se enviará al chat (puede ser id o descripción). */
  onToolSelect: (payload: string) => void;
}

/* ------------------------------------------------------------------ */
export const ToolsMenu: React.FC<ToolsMenuProps> = ({ onToolSelect }) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* ---------- Detectar pantalla móvil ---------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ---------- Floating‑UI (posición del panel) ---------- */
  const {
    x,
    y,
    strategy,
    refs,
    context,
  } = useFloating({
    placement: isMobile ? "bottom-start" : "left-start",
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ availableWidth, availableHeight }) {
          Object.assign(refs.floating?.current?.style ?? {}, {
            maxWidth: `${availableWidth - 16}px`,
            maxHeight: `${availableHeight - 16}px`,
          });
        },
      }),
    ],
  });

  /* ---------- Interacciones (click fuera, ESC, role) ---------- */
  const click = useClick(context);
  const dismiss = useDismiss(context, { escapeKey: true });
  const role = useRole(context, { role: "dialog" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  /* ---------- Herramientas (con sus gradientes) ---------- */
  const tools = [
    {
      id: "verse-search",
      icon: Search,
      label: "Buscar versículos",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "bible-study",
      icon: Book,
      label: "Estudio bíblico",
      color: "from-green-500 to-green-600",
    },
    {
      id: "devotional",
      icon: Heart,
      label: "Devocional",
      color: "from-red-500 to-red-600",
    },
    {
      id: "community",
      icon: Users,
      label: "Comunidad",
      color: "from-indigo-500 to-indigo-600",
       }
    //,
    // {
    //   id: "create-images",
    //   icon: Image,
    //   label: "Crear imágenes",
    //   color: "from-pink-500 to-rose-600",
    // },
  ];

  /* ---------- Envío al chat ---------- */
  const handleSelect = (tool: typeof tools[0]) => {
    // Siempre enviamos el **id** a quien consuma la herramienta.
    // El componente padre decide qué texto poner en el textarea.
    onToolSelect(tool.id);
    setOpen(false);
  };

  /* ---------- Lógica del carousel (flechas) ---------- */
  const updateScrollIndicators = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(
      Math.abs(el.scrollWidth - el.clientWidth - el.scrollLeft) > 1
    );
  };
  useEffect(() => {
    if (open) {
      const el = scrollRef.current;
      if (el) {
        el.scrollTo({ left: 0, behavior: "smooth" });
        updateScrollIndicators();
      }
    }
  }, [open]);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => updateScrollIndicators();
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  const slide = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.8; // 80 % del ancho visible
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* ==================== BOTÓN FLOTANTE ==================== */}
      <Button
        {...getReferenceProps()}
        ref={refs.setReference}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`
          fixed right-6 top-[55%] -translate-y-1/2 z-40
          rounded-full p-3
          bg-gradient-to-r from-accent/20 to-accent/30
          hover:from-accent/30 hover:to-accent/40
          border border-accent/30 shadow-lg
          transition-transform duration-200
        `}
      >
        <Wrench className="w-6 h-6 text-accent" />
      </Button>

      {/* ==================== PANEL DESPLEGABLE ==================== */}
      {open && (
        <div
          {...getFloatingProps()}
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: "20rem",
            overflow: "hidden",
            zIndex: 50,
          }}
          className={`
            bg-gray-800 rounded-2xl p-4 border border-gray-600
            shadow-2xl animate-fade-in relative
          `}
        >
          {/* ----- Cabecera ----- */}
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-accent" />
            Herramientas espirituales
          </h3>

          {/* ----- CONTENEDOR DESLIZABLE ----- */}
          <div className="relative">
            {/* Flecha izquierda */}
            {canScrollLeft && (
              <button
                onClick={() => slide("left")}
                className={`
                  absolute inset-y-0 left-0 z-10 flex items-center justify-center
                  w-8 h-full bg-gray-700 hover:bg-gray-600
                  rounded-l-xl transition-colors
                `}
                aria-label="Mostrar opciones anteriores"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
            )}
            {/* Flecha derecha */}
            {canScrollRight && (
              <button
                onClick={() => slide("right")}
                className={`
                  absolute inset-y-0 right-0 z-10 flex items-center justify-center
                  w-8 h-full bg-gray-700 hover:bg-gray-600
                  rounded-r-xl transition-colors
                `}
                aria-label="Mostrar más opciones"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            )}

            {/* ---------- LISTA DE HERRAMIENTAS (carousel) ---------- */}
            <div
              ref={scrollRef}
              className={`
                flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2
              `}
            >
              {tools.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelect(t)}
                    className={`
                      flex-shrink-0 w-28 snap-center
                      group relative overflow-hidden rounded-xl p-4
                      border border-gray-600 hover:border-gray-400
                      transition-all duration-300 hover:scale-105
                      bg-gradient-to-br ${t.color}
                    `}
                  >
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-sm font-medium text-white text-center leading-tight">
                        {t.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};