import React, { useState, useMemo } from 'react';
import {
  Heart,
  Sparkles,
  BookOpen,
  Flower2,
  Eye,
  Share2,
  Check,
  RotateCcw,
  Calendar,
  Search,
  Maximize2,
  Minimize2,
  Compass,
  Bookmark,
  Quote
} from 'lucide-react';
import { QUOTES, CATEGORIES, EYE_COMPLIMENTS } from './data/quotes';
import { WhiteLilySVG, CornerGarlandSVG, FloatingPetals } from './components/LilyIllustrations';
import Garden3D from './components/Garden3D';
import { useDailyQuote } from './hooks/useDailyQuote';

export default function App() {
  const {
    state,
    currentQuote,
    bloomAnotherLily,
    toggleFavorite,
    selectQuoteFromGarden,
    resetCycle,
  } = useDailyQuote();

  const [activeTab, setActiveTab] = useState('today');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostcardMode, setIsPostcardMode] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [eyeComplimentIndex, setEyeComplimentIndex] = useState(null);
  const [isBloomingAnim, setIsBloomingAnim] = useState(false);

  const totalQuotes = QUOTES.length; // 500 citações
  const isFavorite = state.favorites.includes(currentQuote.id);
  const progressCount = state.seenIds.length;
  const progressPercent = Math.min(100, Math.round((progressCount / totalQuotes) * 100));

  const handleBloomAnother = () => {
    setIsBloomingAnim(true);
    setTimeout(() => {
      bloomAnotherLily();
      setIsBloomingAnim(false);
    }, 320);
  };

  const handleCopyQuote = async () => {
    const shareText = `"${currentQuote.text}"\n— ${currentQuote.author} (${currentQuote.source})\n\n🎄🤍 Jardim Natalino de Lírios Brancos`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2500);
    } catch {
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2500);
    }
  };

  const triggerEyeCompliment = () => {
    setEyeComplimentIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % EYE_COMPLIMENTS.length;
    });
  };

  const unlockedQuotes = useMemo(() => {
    return state.seenIds
      .map((id, idx) => {
        const q = QUOTES.find((item) => item.id === id);
        return q ? { ...q, orderIndex: idx + 1 } : null;
      })
      .filter(Boolean)
      .reverse();
  }, [state.seenIds]);

  const filteredGardenQuotes = useMemo(() => {
    const baseList = activeTab === 'favorites'
      ? QUOTES.filter((q) => state.favorites.includes(q.id))
      : unlockedQuotes;

    return baseList.filter((q) => {
      const matchesCat = selectedCategory === 'all' || q.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.source.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeTab, unlockedQuotes, state.favorites, selectedCategory, searchQuery]);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date());
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans-clean relative selection:bg-[#FEE2E2] selection:text-[#991B1B] pb-28">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 10%, rgba(254, 226, 226, 0.55) 0%, rgba(220, 252, 231, 0.35) 45%, rgba(241, 245, 249, 1) 100%)',
        }}
      />
      <FloatingPetals />

      <div className="relative z-10 max-w-xl mx-auto px-4 pt-6 sm:pt-10">
        {!isPostcardMode && (
          <header className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#FECACA] shadow-2xs mb-3">
              <span className="text-sm">🎄</span>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#991B1B]">
                Jardim de Natal & Lírios Brancos
              </span>
              <span className="text-[#D97706]">•</span>
              <span className="text-xs font-bold text-[#14532D]">
                {progressCount} / {totalQuotes} Lírios
              </span>
            </div>

            <h1 className="font-serif-romantic text-3xl sm:text-4xl font-semibold text-[#14532D] tracking-tight">
              Para o Olhar Mais Lindo
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-1 capitalize">
              {formattedDate} ❄️
            </p>

            <div className="max-w-xs mx-auto mt-3.5">
              <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#15803D] via-[#D97706] to-[#DC2626] rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                {progressCount >= totalQuotes
                  ? 'Todos os 500 lírios de Natal floresceram para você! 🎄🤍'
                  : `Faltam ${totalQuotes - progressCount} citações inéditas para completar os 500 lírios`}
              </p>
            </div>
          </header>
        )}

        {activeTab === 'today' && (
          <main className="transition-all duration-500">
            <div
              className={`relative bg-white/90 backdrop-blur-xl rounded-[32px] border border-[#E2E8F0] shadow-[0_20px_60px_-15px_rgba(20,83,45,0.14)] overflow-hidden transition-all duration-300 ${
                isBloomingAnim ? 'opacity-40 scale-98' : 'opacity-100 scale-100'
              } ${isPostcardMode ? 'p-8 sm:p-12 my-6 border-[#D97706]/50' : 'p-6 sm:p-10'}`}
            >
              <CornerGarlandSVG className="w-28 h-28 sm:w-36 sm:h-36 absolute -top-2 -left-2 pointer-events-none" />
              <CornerGarlandSVG className="w-28 h-28 sm:w-36 sm:h-36 absolute -top-2 -right-2 scale-x-[-1] pointer-events-none" />
              <CornerGarlandSVG className="w-28 h-28 sm:w-36 sm:h-36 absolute -bottom-2 -left-2 scale-y-[-1] pointer-events-none" />
              <CornerGarlandSVG className="w-28 h-28 sm:w-36 sm:h-36 absolute -bottom-2 -right-2 scale-[-1] pointer-events-none" />

              <button
                onClick={() => setIsPostcardMode(!isPostcardMode)}
                title={isPostcardMode ? 'Sair do modo postal' : 'Modo Cartão-Postal para Print'}
                className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F8FAF8]/90 hover:bg-white text-[#14532D] border border-[#CBD5E1] shadow-2xs transition cursor-pointer"
              >
                {isPostcardMode ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Voltar</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Postal</span>
                  </>
                )}
              </button>

              <div className="relative z-10 flex flex-col items-center">
                <div className="animate-gentle-pulse">
                  <WhiteLilySVG className="w-28 h-28 sm:w-32 sm:h-32" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[11px] font-semibold tracking-wide mt-1 mb-5">
                  <Sparkles className="w-3 h-3 text-[#D97706]" />
                  <span>Lírio Branco Nº {currentQuote.id} de {totalQuotes}</span>
                </div>

                <div className="relative max-w-md mx-auto text-center px-2 sm:px-4">
                  <Quote className="w-6 h-6 text-[#D97706]/35 mx-auto mb-2 rotate-180" />
                  <blockquote className="font-serif-romantic italic text-2xl sm:text-[28px] leading-[1.45] text-[#0F172A] font-normal">
                    “{currentQuote.text}”
                  </blockquote>
                </div>

                <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D97706]/60 to-transparent my-6" />

                <div className="text-center">
                  <p className="font-serif-romantic font-semibold text-lg text-[#14532D]">
                    {currentQuote.author}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#475569] mt-1 bg-[#F1F5F9] px-3 py-1 rounded-full border border-[#E2E8F0]">
                    <BookOpen className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Extraído de: <strong className="font-medium text-[#1E293B]">{currentQuote.source}</strong></span>
                  </div>
                </div>

                {!isPostcardMode ? (
                  <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8 w-full">
                    <button
                      onClick={() => toggleFavorite(currentQuote.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition shadow-2xs cursor-pointer ${
                        isFavorite
                          ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                          : 'bg-white hover:bg-[#F8FAF9] text-[#334155] border border-[#CBD5E1]'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform ${
                          isFavorite ? 'fill-[#EF4444] text-[#EF4444] scale-110' : 'text-[#64748B]'
                        }`}
                      />
                      <span>{isFavorite ? 'Guardada no Coração' : 'Favoritar'}</span>
                    </button>

                    <button
                      onClick={handleCopyQuote}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-white hover:bg-[#F8FAF9] text-[#334155] border border-[#CBD5E1] transition shadow-2xs cursor-pointer"
                    >
                      {copiedFeedback ? (
                        <>
                          <Check className="w-4 h-4 text-[#16A34A]" />
                          <span className="text-[#16A34A]">Copiada com carinho!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 text-[#64748B]" />
                          <span>Copiar Citação</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleBloomAnother}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#14532D] to-[#991B1B] hover:opacity-95 text-white transition shadow-sm cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#FEF08A]" />
                      <span>Desabrochar outro lírio ❄️</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] tracking-widest uppercase text-[#64748B] mt-8">
                    🎄 Com carinho • Jardim de Lírios Brancos
                  </p>
                )}
              </div>
            </div>

            {!isPostcardMode && (
              <div className="mt-5 bg-gradient-to-r from-[#FEF2F2]/90 via-white to-[#F0FDF4]/90 rounded-2xl p-4 sm:p-5 border border-[#FECACA]/70 shadow-2xs">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#FECACA] flex items-center justify-center shrink-0 shadow-2xs">
                      <Eye className="w-5 h-5 text-[#991B1B]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-[#14532D]">
                        Espelho do Seu Olhar
                      </h2>
                      <p className="text-xs text-[#64748B]">
                        Um lembrete instantâneo da luz que mora nos seus olhos
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={triggerEyeCompliment}
                    className="w-full sm:w-auto px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] transition shadow-2xs shrink-0 cursor-pointer"
                  >
                    {eyeComplimentIndex === null ? 'Ver elogio para o seu olhar ✨' : 'Outro elogio 🎄'}
                  </button>
                </div>

                {eyeComplimentIndex !== null && (
                  <div className="mt-3.5 pt-3.5 border-t border-[#FECACA]/50 text-center">
                    <p className="font-serif-romantic italic text-lg text-[#991B1B]">
                      “{EYE_COMPLIMENTS[eyeComplimentIndex]}”
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
        )}

        {activeTab === 'garden3d' && (
          <Garden3D
            seenIds={state.seenIds}
            favorites={state.favorites}
            onToggleFavorite={toggleFavorite}
            onOpenInMainCard={(id) => {
              selectQuoteFromGarden(id);
              setActiveTab('today');
            }}
          />
        )}

        {(activeTab === 'garden' || activeTab === 'favorites') && (
          <section className="space-y-4">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-serif-romantic text-2xl font-semibold text-[#14532D]">
                    {activeTab === 'favorites' ? 'Lírios Guardados no Coração' : 'Jardim de Memórias'}
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    {activeTab === 'favorites'
                      ? `Você marcou ${state.favorites.length} citações especiais`
                      : `Você já desbloqueou ${unlockedQuotes.length} de ${totalQuotes} citações sem repetição`}
                  </p>
                </div>

                {activeTab === 'garden' && unlockedQuotes.length >= totalQuotes && (
                  <button
                    onClick={resetCycle}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reiniciar Ciclo</span>
                  </button>
                )}
              </div>

              <div className="relative mb-3">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar entre os lírios desbloqueados..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#15803D]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#14532D] text-white'
                        : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredGardenQuotes.length === 0 ? (
              <div className="bg-white/85 rounded-2xl p-10 text-center border border-[#E2E8F0]">
                <WhiteLilySVG className="w-16 h-16 mx-auto opacity-60 mb-2" />
                <p className="font-serif-romantic text-xl text-[#14532D]">
                  Nenhuma flor encontrada neste filtro
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGardenQuotes.map((q) => {
                  const fav = state.favorites.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      className="bg-white/95 hover:bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-2xs transition"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#14532D] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full">
                          <Flower2 className="w-3 h-3" />
                          Lírio Nº {q.id} de {totalQuotes}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              selectQuoteFromGarden(q.id);
                              setActiveTab('today');
                            }}
                            className="text-[11px] font-medium text-[#991B1B] hover:underline px-2 py-1 cursor-pointer"
                          >
                            Abrir no Cartão
                          </button>
                          <button
                            onClick={() => toggleFavorite(q.id)}
                            className="p-1.5 rounded-full hover:bg-[#FEF2F2] transition cursor-pointer"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                fav ? 'fill-[#EF4444] text-[#EF4444]' : 'text-[#94A3B8]'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <p className="font-serif-romantic italic text-xl text-[#0F172A] leading-snug mb-3">
                        “{q.text}”
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#F1F5F9] text-xs text-[#64748B]">
                        <span className="font-semibold text-[#14532D]">{q.author}</span>
                        <span className="text-[11px] italic">{q.source}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>

      {!isPostcardMode && (
        <nav className="fixed bottom-4 inset-x-0 z-30 max-w-lg mx-auto px-3">
          <div className="bg-white/95 backdrop-blur-xl border border-[#CBD5E1] rounded-full shadow-[0_10px_30px_rgba(15,23,42,0.15)] p-1.5 grid grid-cols-4 gap-1">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-[#14532D] text-white shadow-xs'
                  : 'text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="truncate">Hoje</span>
            </button>

            <button
              onClick={() => setActiveTab('garden3d')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                activeTab === 'garden3d'
                  ? 'bg-[#991B1B] text-white shadow-xs'
                  : 'text-[#475569] hover:bg-[#FEF2F2]'
              }`}
            >
              <Flower2 className="w-4 h-4 shrink-0" />
              <span className="truncate">Natal 3D 🎄</span>
            </button>

            <button
              onClick={() => setActiveTab('garden')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                activeTab === 'garden'
                  ? 'bg-[#14532D] text-white shadow-xs'
                  : 'text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span className="truncate">Lista ({progressCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-[#991B1B] text-white shadow-xs'
                  : 'text-[#475569] hover:bg-[#FEF2F2]'
              }`}
            >
              <Bookmark className="w-4 h-4 shrink-0" />
              <span className="truncate">Salvas ({state.favorites.length})</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
