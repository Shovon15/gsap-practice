"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Code,
  Columns2,
  Copy,
  Download,
  LayoutGrid,
  Link,
  ListTree,
  Loader2,
  Mail,
  Maximize,
  Minimize,
  Palette,
  Pause,
  Play,
  Printer,
  RectangleVertical,
  Search,
  Share2,
  Volume2,
  VolumeX,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import styles from "./flipbook.module.css";

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;
const AUTOPLAY_DELAY = 3000;
// px width each PDF page is rasterised at (keeps zoom crisp). Smaller on phones to save memory.
const getRenderWidth = () => (window.innerWidth < 768 ? 1000 : 1400);

const THEMES = [
  { id: "night", label: "Night" },
  { id: "ocean", label: "Ocean" },
  { id: "wood", label: "Wood" },
  { id: "paper", label: "Paper" },
  { id: "sunset", label: "Sunset" },
];

/* ---------- helpers ---------- */

function playFlipSound(ctxRef) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!ctxRef.current) ctxRef.current = new AudioCtx();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const duration = 0.38;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      // paper "swish": noise with a fast attack and a soft tail
      data[i] = (Math.random() * 2 - 1) * Math.pow(Math.sin(Math.PI * t), 2) * (1 - t * 0.6);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 0.8;
    filter.frequency.setValueAtTime(900, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + duration);

    const gain = ctx.createGain();
    gain.gain.value = 0.35;

    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();
  } catch {
    /* audio is a nice-to-have */
  }
}

async function resolveOutline(pdf, items) {
  if (!items) return [];
  const result = [];
  for (const item of items) {
    let pageIndex = null;
    try {
      let dest = item.dest;
      if (typeof dest === "string") dest = await pdf.getDestination(dest);
      if (Array.isArray(dest) && dest[0]) {
        pageIndex =
          typeof dest[0] === "number" ? dest[0] : await pdf.getPageIndex(dest[0]);
      }
    } catch {
      pageIndex = null;
    }
    result.push({
      title: item.title,
      pageIndex,
      children: await resolveOutline(pdf, item.items),
    });
  }
  return result;
}

function makeSnippet(text, index, length) {
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + length + 40);
  return {
    before: (start > 0 ? "…" : "") + text.slice(start, index),
    match: text.slice(index, index + length),
    after: text.slice(index + length, end) + (end < text.length ? "…" : ""),
  };
}

/* ---------- component ---------- */

export default function FlipBook({ src, title = "Flip Book" }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const holderRef = useRef(null);
  const pageFlipRef = useRef(null);
  const audioCtxRef = useRef(null);
  const soundRef = useRef(true);
  const panRef = useRef(null);

  const [pages, setPages] = useState([]); // [{ src, text }]
  const [pageRatio, setPageRatio] = useState(0.707); // width / height
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const [error, setError] = useState(null);
  const [outline, setOutline] = useState([]);

  const [current, setCurrent] = useState(0);
  const [orientation, setOrientation] = useState("landscape");
  const [viewMode, setViewMode] = useState("double");
  const [zoom, setZoom] = useState(1);
  const [panel, setPanel] = useState(null); // 'thumbs' | 'toc' | 'search' | null
  const [autoplay, setAutoplay] = useState(false);
  const [sound, setSound] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState("night");
  const [themeMenu, setThemeMenu] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(null);
  const [query, setQuery] = useState("");
  const [pageInput, setPageInput] = useState("1");

  const total = pages.length;
  const isReady = total > 0;

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  // Default to single page view on narrow screens.
  useEffect(() => {
    if (window.innerWidth < 768) setViewMode("single");
  }, []);

  /* ---------- load + rasterise the PDF ---------- */
  useEffect(() => {
    let cancelled = false;
    let loadingTask;

    (async () => {
      try {
        // Legacy build = transpiled for older mobile browsers (iOS Safari, older Android Chrome).
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();

        // pdf.js v6 no longer accepts a bare URL string — it must be an options object.
        loadingTask = pdfjs.getDocument({ url: new URL(src, window.location.href).href });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        setProgress({ loaded: 0, total: pdf.numPages });
        const rendered = [];

        for (let n = 1; n <= pdf.numPages; n++) {
          const page = await pdf.getPage(n);
          const base = page.getViewport({ scale: 1 });
          if (n === 1) setPageRatio(base.width / base.height);

          const viewport = page.getViewport({ scale: getRenderWidth() / base.width });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          const context = canvas.getContext("2d");
          context.fillStyle = "#fff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvas, canvasContext: context, viewport }).promise;

          const textContent = await page.getTextContent();
          const text = textContent.items
            .map((item) => item.str)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();

          rendered.push({ src: canvas.toDataURL("image/jpeg", 0.88), text });
          page.cleanup();
          if (cancelled) return;
          setProgress({ loaded: n, total: pdf.numPages });
        }

        const tree = await resolveOutline(pdf, await pdf.getOutline());
        if (cancelled) return;
        setOutline(tree);
        setPages(rendered);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Could not load the PDF.");
      }
    })();

    return () => {
      cancelled = true;
      loadingTask?.destroy();
    };
  }, [src]);

  /* ---------- size the book to fit the stage ---------- */
  const fitBook = useCallback(() => {
    const stage = stageRef.current;
    const holder = holderRef.current;
    if (!stage || !holder) return;
    const style = getComputedStyle(stage);
    const availW = stage.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const availH = stage.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    const spreadRatio = pageRatio * (viewMode === "double" ? 2 : 1);
    const baseWidth = Math.max(200, Math.min(availW, availH * spreadRatio));
    holder.style.width = `${Math.floor(baseWidth * zoom)}px`;
    pageFlipRef.current?.update();
  }, [pageRatio, viewMode, zoom]);

  useEffect(() => {
    fitBook();
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(() => fitBook());
    observer.observe(stage);
    return () => observer.disconnect();
  }, [fitBook]);

  /* ---------- create the page-flip instance ---------- */
  useEffect(() => {
    if (!isReady || !holderRef.current) return;
    let pf;
    let bookEl;
    let disposed = false;

    (async () => {
      try {
      const { PageFlip } = await import("page-flip");
      if (disposed) return;

      bookEl = document.createElement("div");
      bookEl.className = styles.book;
      holderRef.current.appendChild(bookEl);

      const single = viewMode === "single";
      pf = new PageFlip(bookEl, {
        width: 1000,
        height: Math.round(1000 / pageRatio),
        size: "stretch",
        // A huge minWidth forces portrait (one page) mode in "single" view.
        minWidth: single ? 100000 : 100,
        maxWidth: 4000,
        minHeight: 100,
        maxHeight: 6000,
        startPage: Math.min(current, pages.length - 1),
        showCover: true,
        usePortrait: true,
        drawShadow: true,
        maxShadowOpacity: 0.5,
        flippingTime: 800,
        mobileScrollSupport: false,
        showPageCorners: true,
      });
      pf.on("flip", (e) => setCurrent(e.data));
      pf.on("changeOrientation", (e) => setOrientation(e.data));
      pf.on("init", (e) => setOrientation(e.data.mode));
      pf.on("changeState", (e) => {
        if (e.data === "flipping" && soundRef.current) playFlipSound(audioCtxRef);
      });

      pf.loadFromImages(pages.map((p) => p.src));
      // page-flip builds its UI inside loadFromImages() and sets the element's
      // min-width to `minWidth` (100000px in single view). Reset it *after* loading,
      // otherwise the canvas becomes 100000px wide and mobile browsers can't draw it.
      bookEl.style.minWidth = "0";
      bookEl.style.minHeight = "0";
      pf.update();
      pageFlipRef.current = pf;
      fitBook();

      gsap.fromTo(
        bookEl,
        { autoAlpha: 0, y: 30, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" }
      );
      } catch (err) {
        if (!disposed) setError(err?.message || "Could not start the flip book.");
      }
    })();

    return () => {
      disposed = true;
      try {
        pf?.destroy();
      } catch {
        /* already gone */
      }
      bookEl?.remove();
      if (pageFlipRef.current === pf) pageFlipRef.current = null;
    };
    // `current` is intentionally read once as the start page when rebuilding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, pages, viewMode, pageRatio]);

  // Toolbar entrance
  useEffect(() => {
    if (!isReady) return;
    gsap.fromTo(
      `.${styles.toolbar}`,
      { y: 40, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6, delay: 0.2, ease: "power3.out" }
    );
  }, [isReady]);

  /* ---------- navigation ---------- */
  const goTo = useCallback(
    (index) => {
      const pf = pageFlipRef.current;
      if (!pf || !total) return;
      const target = Math.max(0, Math.min(total - 1, index));
      if (Math.abs(target - pf.getCurrentPageIndex()) <= 2) pf.flip(target);
      else {
        pf.turnToPage(target);
        setCurrent(target);
        if (soundRef.current) playFlipSound(audioCtxRef);
      }
    },
    [total]
  );
  const next = useCallback(() => pageFlipRef.current?.flipNext(), []);
  const prev = useCallback(() => pageFlipRef.current?.flipPrev(), []);
  const first = useCallback(() => goTo(0), [goTo]);
  const last = useCallback(() => goTo(total - 1), [goTo, total]);

  // Pages currently visible (for labels + thumbnail highlighting)
  const visiblePages = useMemo(() => {
    if (!total) return [];
    if (orientation === "portrait") return [current];
    if (current === 0) return [0];
    const left = current % 2 === 1 ? current : current - 1;
    return [left, left + 1].filter((i) => i < total);
  }, [current, orientation, total]);

  const pageLabel = visiblePages.map((i) => i + 1).join("-");

  useEffect(() => {
    setPageInput(pageLabel || "1");
  }, [pageLabel]);

  const submitPageInput = (e) => {
    e.preventDefault();
    const n = parseInt(pageInput, 10);
    if (!Number.isNaN(n)) goTo(n - 1);
    else setPageInput(pageLabel);
  };

  const atStart = visiblePages[0] === 0;
  const atEnd = visiblePages[visiblePages.length - 1] === total - 1;

  /* ---------- autoplay ---------- */
  useEffect(() => {
    if (!autoplay) return;
    if (atEnd) {
      setAutoplay(false);
      return;
    }
    const id = setTimeout(() => pageFlipRef.current?.flipNext(), AUTOPLAY_DELAY);
    return () => clearTimeout(id);
  }, [autoplay, current, atEnd]);

  /* ---------- zoom ---------- */
  const zoomIn = useCallback(() => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2))), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2))), []);
  const zoomReset = useCallback(() => setZoom(1), []);

  // Drag-to-pan while zoomed in
  const onPanStart = (e) => {
    const stage = stageRef.current;
    panRef.current = { x: e.clientX, y: e.clientY, left: stage.scrollLeft, top: stage.scrollTop };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPanMove = (e) => {
    if (!panRef.current) return;
    const stage = stageRef.current;
    stage.scrollLeft = panRef.current.left - (e.clientX - panRef.current.x);
    stage.scrollTop = panRef.current.top - (e.clientY - panRef.current.y);
  };
  const onPanEnd = () => {
    panRef.current = null;
  };

  /* ---------- fullscreen ---------- */
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else rootRef.current?.requestFullscreen?.();
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  /* ---------- print / download / share ---------- */
  const printBook = () => {
    if (!total) return;
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
    iframe.srcdoc = `<!doctype html><html><head><title>${title}</title><style>
      @page { margin: 0; } body { margin: 0; }
      img { display:block; width:100%; height:auto; page-break-after:always; }
    </style></head><body>${pages.map((p) => `<img src="${p.src}" />`).join("")}</body></html>`;
    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => iframe.remove(), 1000);
    };
    document.body.appendChild(iframe);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const embedCode = `<iframe src="${shareUrl}" width="100%" height="600" style="border:0" allowfullscreen></iframe>`;

  const copyText = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url: shareUrl });
    } catch {
      /* cancelled */
    }
  };

  /* ---------- search ---------- */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const out = [];
    pages.forEach((p, pageIndex) => {
      const lower = p.text.toLowerCase();
      let idx = lower.indexOf(q);
      let count = 0;
      while (idx !== -1 && count < 5) {
        out.push({ pageIndex, ...makeSnippet(p.text, idx, q.length), key: `${pageIndex}-${idx}` });
        idx = lower.indexOf(q, idx + q.length);
        count++;
      }
    });
    return out;
  }, [query, pages]);

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.("input, textarea")) return;
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          prev();
          break;
        case "Home":
          first();
          break;
        case "End":
          last();
          break;
        case "+":
        case "=":
          zoomIn();
          break;
        case "-":
          zoomOut();
          break;
        case "0":
          zoomReset();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "Escape":
          setPanel(null);
          setShareOpen(false);
          setThemeMenu(false);
          break;
        default:
          return;
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, first, last, zoomIn, zoomOut, zoomReset, toggleFullscreen]);

  const togglePanel = (name) => setPanel((p) => (p === name ? null : name));

  const tocItems = outline.length
    ? outline
    : pages.map((p, i) => ({
        title: p.text ? p.text.slice(0, 60) + (p.text.length > 60 ? "…" : "") : `Page ${i + 1}`,
        pageIndex: i,
        children: [],
      }));

  const renderToc = (items, depth = 0) =>
    items.map((item, i) => (
      <li key={`${depth}-${i}`}>
        <button
          type="button"
          className={styles.tocItem}
          style={{ paddingLeft: 12 + depth * 14 }}
          disabled={item.pageIndex == null}
          onClick={() => item.pageIndex != null && goTo(item.pageIndex)}
        >
          <span className={styles.tocTitle}>{item.title}</span>
          {item.pageIndex != null && <span className={styles.tocPage}>{item.pageIndex + 1}</span>}
        </button>
        {item.children?.length > 0 && <ul>{renderToc(item.children, depth + 1)}</ul>}
      </li>
    ));

  /* ---------- render ---------- */
  return (
    <div ref={rootRef} className={`${styles.root} ${styles[`theme_${theme}`]}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <BookOpen size={20} />
          <span className={styles.title}>{title}</span>
          {isReady && <span className={styles.badge}>{total} pages</span>}
        </div>
        <div className={styles.headerActions}>
          <a className={styles.headerBtn} href={src} download title="Download PDF">
            <Download size={16} /> <span>Download</span>
          </a>
          <button type="button" className={styles.headerBtnPrimary} onClick={() => setShareOpen(true)}>
            <Share2 size={16} /> <span>Share</span>
          </button>
        </div>
      </header>

      <div className={styles.body}>
        {/* Side panel */}
        <aside className={`${styles.panel} ${panel ? styles.panelOpen : ""}`} aria-hidden={!panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTabs}>
              <button
                type="button"
                className={panel === "thumbs" ? styles.tabActive : styles.tab}
                onClick={() => setPanel("thumbs")}
              >
                <LayoutGrid size={14} /> Pages
              </button>
              <button
                type="button"
                className={panel === "toc" ? styles.tabActive : styles.tab}
                onClick={() => setPanel("toc")}
              >
                <ListTree size={14} /> Contents
              </button>
              <button
                type="button"
                className={panel === "search" ? styles.tabActive : styles.tab}
                onClick={() => setPanel("search")}
              >
                <Search size={14} /> Search
              </button>
            </div>
            <button type="button" className={styles.iconBtnSm} onClick={() => setPanel(null)} aria-label="Close panel">
              <X size={16} />
            </button>
          </div>

          <div className={styles.panelBody}>
            {panel === "thumbs" && (
              <div className={styles.thumbGrid}>
                {pages.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.thumb} ${visiblePages.includes(i) ? styles.thumbActive : ""}`}
                    onClick={() => goTo(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.src} alt={`Page ${i + 1}`} />
                    <span>{i + 1}</span>
                  </button>
                ))}
              </div>
            )}

            {panel === "toc" && (
              <>
                {!outline.length && (
                  <p className={styles.muted}>This PDF has no bookmarks — showing pages instead.</p>
                )}
                <ul className={styles.toc}>{renderToc(tocItems)}</ul>
              </>
            )}

            {panel === "search" && (
              <div className={styles.searchWrap}>
                <div className={styles.searchBox}>
                  <Search size={16} />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search in book…"
                  />
                  {query && (
                    <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                      <X size={14} />
                    </button>
                  )}
                </div>
                {query.trim().length >= 2 && (
                  <p className={styles.muted}>
                    {results.length} result{results.length === 1 ? "" : "s"}
                  </p>
                )}
                <ul className={styles.results}>
                  {results.map((r) => (
                    <li key={r.key}>
                      <button type="button" onClick={() => goTo(r.pageIndex)}>
                        <span className={styles.resultPage}>Page {r.pageIndex + 1}</span>
                        <span className={styles.resultText}>
                          {r.before}
                          <mark>{r.match}</mark>
                          {r.after}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>

        {/* Stage */}
        <main className={styles.main}>
          <div ref={stageRef} className={`${styles.stage} ${zoom > 1 ? styles.stageZoomed : ""}`}>
            <div ref={holderRef} className={styles.holder} />
            {zoom > 1 && (
              <div
                className={styles.panLayer}
                onPointerDown={onPanStart}
                onPointerMove={onPanMove}
                onPointerUp={onPanEnd}
                onPointerCancel={onPanEnd}
                title="Drag to move"
              />
            )}
          </div>

          {isReady && (
            <>
              <button
                type="button"
                className={`${styles.sideArrow} ${styles.sideArrowLeft}`}
                onClick={prev}
                disabled={atStart}
                aria-label="Previous page"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                className={`${styles.sideArrow} ${styles.sideArrowRight}`}
                onClick={next}
                disabled={atEnd}
                aria-label="Next page"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {!isReady && !error && (
            <div className={styles.loader}>
              <Loader2 className={styles.spin} size={36} />
              <p>
                {progress.total
                  ? `Preparing page ${progress.loaded} of ${progress.total}…`
                  : "Loading book…"}
              </p>
              <div className={styles.progress}>
                <div
                  style={{
                    width: progress.total ? `${(progress.loaded / progress.total) * 100}%` : "8%",
                  }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className={styles.loader}>
              <p className={styles.error}>Couldn&apos;t open this book: {error}</p>
            </div>
          )}
        </main>
      </div>

      {/* Toolbar */}
      <footer className={styles.toolbar} style={{ visibility: isReady ? undefined : "hidden" }}>
        <div className={styles.group}>
          <ToolBtn label="Thumbnails" active={panel === "thumbs"} onClick={() => togglePanel("thumbs")}>
            <LayoutGrid size={18} />
          </ToolBtn>
          <ToolBtn label="Table of contents" active={panel === "toc"} onClick={() => togglePanel("toc")}>
            <ListTree size={18} />
          </ToolBtn>
          <ToolBtn label="Search" active={panel === "search"} onClick={() => togglePanel("search")}>
            <Search size={18} />
          </ToolBtn>
        </div>

        <div className={styles.group}>
          <ToolBtn label="Zoom out (-)" onClick={zoomOut} disabled={zoom <= ZOOM_MIN}>
            <ZoomOut size={18} />
          </ToolBtn>
          <button type="button" className={styles.zoomValue} onClick={zoomReset} title="Reset zoom (0)">
            {Math.round(zoom * 100)}%
          </button>
          <ToolBtn label="Zoom in (+)" onClick={zoomIn} disabled={zoom >= ZOOM_MAX}>
            <ZoomIn size={18} />
          </ToolBtn>
        </div>

        <div className={`${styles.group} ${styles.navGroup}`}>
          <ToolBtn label="First page (Home)" onClick={first} disabled={atStart}>
            <ChevronsLeft size={18} />
          </ToolBtn>
          <ToolBtn label="Previous page (←)" onClick={prev} disabled={atStart}>
            <ChevronLeft size={18} />
          </ToolBtn>
          <form onSubmit={submitPageInput} className={styles.pageForm}>
            <input
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onFocus={(e) => e.target.select()}
              onBlur={() => setPageInput(pageLabel)}
              aria-label="Page number"
            />
            <span>/ {total}</span>
          </form>
          <ToolBtn label="Next page (→)" onClick={next} disabled={atEnd}>
            <ChevronRight size={18} />
          </ToolBtn>
          <ToolBtn label="Last page (End)" onClick={last} disabled={atEnd}>
            <ChevronsRight size={18} />
          </ToolBtn>
        </div>

        <div className={styles.group}>
          <ToolBtn
            label={autoplay ? "Stop auto flip" : "Auto flip"}
            active={autoplay}
            onClick={() => {
              if (!autoplay && atEnd) first();
              setAutoplay((a) => !a);
            }}
          >
            {autoplay ? <Pause size={18} /> : <Play size={18} />}
          </ToolBtn>
          <ToolBtn label={sound ? "Mute flip sound" : "Enable flip sound"} onClick={() => setSound((s) => !s)}>
            {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </ToolBtn>
          <ToolBtn
            label={viewMode === "double" ? "Single page view" : "Double page view"}
            onClick={() => setViewMode((m) => (m === "double" ? "single" : "double"))}
          >
            {viewMode === "double" ? <RectangleVertical size={18} /> : <Columns2 size={18} />}
          </ToolBtn>
          <ToolBtn label="Background" active={themeMenu} onClick={() => setThemeMenu((t) => !t)}>
            <Palette size={18} />
          </ToolBtn>
        </div>

        <div className={styles.group}>
          <ToolBtn label="Print" onClick={printBook}>
            <Printer size={18} />
          </ToolBtn>
          <a className={styles.toolBtn} href={src} download title="Download">
            <Download size={18} />
          </a>
          <ToolBtn label="Share" onClick={() => setShareOpen(true)}>
            <Share2 size={18} />
          </ToolBtn>
          <ToolBtn label={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"} onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </ToolBtn>
        </div>
      </footer>

      {themeMenu && (
        <div className={styles.themeMenu}>
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.swatch} ${styles[`swatch_${t.id}`]} ${theme === t.id ? styles.swatchActive : ""}`}
              onClick={() => {
                setTheme(t.id);
                setThemeMenu(false);
              }}
              title={t.label}
              aria-label={`${t.label} background`}
            />
          ))}
        </div>
      )}

      {/* Share dialog */}
      {shareOpen && (
        <div className={styles.modalBackdrop} onClick={() => setShareOpen(false)}>
          <div className={styles.modal} role="dialog" aria-label="Share this book" onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Share this book</h2>
              <button type="button" className={styles.iconBtnSm} onClick={() => setShareOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className={styles.socials}>
              <a
                className={styles.social}
                style={{ background: "#1877f2" }}
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
              >
                f
              </a>
              <a
                className={styles.social}
                style={{ background: "#000" }}
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noreferrer"
              >
                𝕏
              </a>
              <a
                className={styles.social}
                style={{ background: "#0a66c2" }}
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
              >
                in
              </a>
              <a
                className={styles.social}
                style={{ background: "#25d366" }}
                href={`https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
              >
                W
              </a>
              <a
                className={styles.social}
                style={{ background: "#6b7280" }}
                href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`}
              >
                <Mail size={18} />
              </a>
              {typeof navigator !== "undefined" && navigator.share && (
                <button type="button" className={styles.social} style={{ background: "#8b5cf6" }} onClick={nativeShare}>
                  <Share2 size={18} />
                </button>
              )}
            </div>

            <label className={styles.fieldLabel}>
              <Link size={14} /> Book link
            </label>
            <div className={styles.copyRow}>
              <input readOnly value={shareUrl} onFocus={(e) => e.target.select()} />
              <button type="button" onClick={() => copyText(shareUrl, "link")}>
                {copied === "link" ? <Check size={16} /> : <Copy size={16} />}
                {copied === "link" ? "Copied" : "Copy"}
              </button>
            </div>

            <label className={styles.fieldLabel}>
              <Code size={14} /> Embed code
            </label>
            <div className={styles.copyRow}>
              <textarea readOnly rows={3} value={embedCode} onFocus={(e) => e.target.select()} />
              <button type="button" onClick={() => copyText(embedCode, "embed")}>
                {copied === "embed" ? <Check size={16} /> : <Copy size={16} />}
                {copied === "embed" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolBtn({ label, active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      className={`${styles.toolBtn} ${active ? styles.toolBtnActive : ""}`}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active || undefined}
    >
      {children}
    </button>
  );
}
