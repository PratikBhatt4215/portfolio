import React, { useState, useEffect, useRef } from 'react';
import { Rss, ExternalLink, RefreshCw, Clock, ChevronDown } from 'lucide-react';

const TECH_TAGS = [
  { label: 'Java',        tag: 'java',       color: '#f89820' },
  { label: 'Spring Boot', tag: 'spring',     color: '#6db33f' },
  { label: 'AWS',         tag: 'aws',        color: '#ff9900' },
  { label: 'React',       tag: 'react',      color: '#61dafb' },
  { label: 'CSS',         tag: 'css',        color: '#264de4' },
  { label: 'Vue',         tag: 'vue',        color: '#42b883' },
];

export default function TechNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTag, setActiveTag] = useState('java');
  const [activeColor, setActiveColor] = useState('#f89820');
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef(null);

  const PER_PAGE = 6;

  const fetchNews = async (tag, pageNum = 1, append = false) => {
    append ? setLoadingMore(true) : setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://dev.to/api/articles?tag=${tag}&per_page=${PER_PAGE}&page=${pageNum}`,
        { headers: { 'Accept': 'application/json' } }
      );
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setArticles(prev => append ? [...prev, ...data] : data);
      setHasMore(data.length === PER_PAGE);
    } catch {
      setError('Could not load articles. Check your connection.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setArticles([]);
    fetchNews(activeTag, 1, false);
  }, [activeTag]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(activeTag, nextPage, true);
    // Smooth scroll to bottom of list after a tick
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
      }
    }, 400);
  };

  const handleTagSwitch = (t) => {
    setActiveTag(t.tag);
    setActiveColor(t.color);
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'just now';
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return d === 1 ? '1d ago' : `${d}d ago`;
  };

  return (
    <div className="flex flex-col bg-[rgba(18,22,40,0.65)] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl" style={{ minHeight: '440px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <Rss size={15} style={{ color: activeColor }} />
          <span className="font-bold text-sm text-[#f0f3fe]">Live Tech News</span>
          <span className="text-[0.62rem] font-mono px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#94a3b8]">dev.to</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[0.62rem] text-[#94a3b8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f] animate-pulse" />
            Live
          </span>
          <button
            onClick={() => { setPage(1); fetchNews(activeTag, 1, false); }}
            className="text-[#94a3b8] hover:text-[#f0f3fe] transition-colors cursor-pointer bg-transparent border-none p-1 rounded"
            title="Refresh"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tag filter tabs */}
      <div className="flex gap-1.5 px-4 py-2.5 border-b border-white/10 overflow-x-auto shrink-0" style={{ scrollbarWidth: 'none' }}>
        {TECH_TAGS.map(t => (
          <button
            key={t.tag}
            onClick={() => handleTagSwitch(t)}
            className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer border transition-all"
            style={{
              background:  activeTag === t.tag ? t.color + '20' : 'rgba(255,255,255,0.04)',
              borderColor: activeTag === t.tag ? t.color         : 'rgba(255,255,255,0.10)',
              color:       activeTag === t.tag ? t.color         : '#94a3b8',
              boxShadow:   activeTag === t.tag ? `0 0 10px ${t.color}40` : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Articles list */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3" style={{ maxHeight: '320px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[60px] rounded-xl bg-white/5 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-[#94a3b8] text-sm">{error}</div>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-2">
            {articles.map((art, i) => (
              <a
                key={`${art.id}-${i}`}
                href={art.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 p-3 rounded-xl no-underline group transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = activeColor + '40'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-[#f0f3fe] leading-snug line-clamp-2 flex-1 group-hover:text-[#00f0ff] transition-colors">
                    {art.title}
                  </p>
                  <ExternalLink size={10} className="shrink-0 text-[#94a3b8] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[0.62rem] text-[#94a3b8]">
                    <Clock size={9} /> {timeAgo(art.published_at)}
                  </span>
                  <span className="text-[0.62rem] text-[#94a3b8]">{art.reading_time_minutes} min read</span>
                  <span className="text-[0.62rem] font-semibold" style={{ color: activeColor }}>♥ {art.positive_reactions_count}</span>
                </div>
              </a>
            ))}

            {/* Load more skeleton while fetching next page */}
            {loadingMore && (
              <div className="flex flex-col gap-2 mt-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-[60px] rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Load More / No More footer ── */}
      <div className="px-4 pb-4 pt-2 shrink-0 border-t border-white/10">
        {!loading && !error && hasMore && (
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="w-full py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 border disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `${activeColor}15`,
              borderColor: `${activeColor}40`,
              color: activeColor,
            }}
            onMouseEnter={e => { if (!loadingMore) e.currentTarget.style.background = activeColor + '28'; }}
            onMouseLeave={e => { e.currentTarget.style.background = activeColor + '15'; }}
          >
            {loadingMore ? (
              <>
                <RefreshCw size={12} className="animate-spin" /> Loading more...
              </>
            ) : (
              <>
                <ChevronDown size={14} /> Load More {activeTag.charAt(0).toUpperCase() + activeTag.slice(1)} Articles
              </>
            )}
          </button>
        )}

        {!loading && !error && !hasMore && articles.length > 0 && (
          <p className="text-center text-[0.65rem] text-[#94a3b8] py-1">
            ✓ All articles loaded for <span style={{ color: activeColor }}>#{activeTag}</span>
          </p>
        )}
      </div>
    </div>
  );
}
