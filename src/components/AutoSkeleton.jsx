import React, { useRef, useState, useLayoutEffect, useMemo } from 'react';
import './AutoSkeleton.css';

/* ── Default config ── */
const DEFAULT_CONFIG = {
  animation: 'pulse',
  baseColor: null,
  borderRadius: 4,
  minTextHeight: 12,
  maxDepth: 50
};

/* ══════════════════════════════════════════════
   DOM Scanner
   ══════════════════════════════════════════════ */

const LEAF_TAGS = new Set(['IMG', 'SVG', 'INPUT', 'TEXTAREA', 'BUTTON', 'SELECT', 'VIDEO', 'CANVAS', 'HR']);
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'META', 'LINK', 'BR']);

function scanDOM(el, cfg, depth = 0) {
  if (!el || depth > cfg.maxDepth) return null;

  const tag = el.tagName;
  if (SKIP_TAGS.has(tag)) return null;

  const cs = getComputedStyle(el);
  if (cs.display === 'none') return null;

  // Skip invisible elements (tooltips, hidden overlays)
  if (cs.opacity === '0') return null;

  // Skip fixed elements (page-level overlays, modals)
  if (cs.position === 'fixed') return null;

  const isAbsolute = cs.position === 'absolute';

  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;

  // Leaf: known leaf tags
  if (LEAF_TAGS.has(tag)) return makeLeaf(rect, cs, cfg, isAbsolute);

  // Leaf: icon elements
  if (isIcon(el)) return makeLeaf(rect, cs, cfg, isAbsolute);

  // Leaf: text-only node (no child elements)
  if (el.children.length === 0 && el.textContent?.trim()) {
    const w = textWidth(el, cs, rect.width);
    return makeLeaf({ width: w, height: rect.height }, cs, cfg, isAbsolute);
  }

  // Container → recurse children
  const children = [];
  for (const child of el.children) {
    const node = scanDOM(child, cfg, depth + 1);
    if (node) children.push(node);
  }

  // Empty container with text or visible background → leaf
  if (children.length === 0) {
    const hasText = el.textContent?.trim();
    const hasBg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
    if (hasText || hasBg) {
      const w = hasText ? textWidth(el, cs, rect.width) : rect.width;
      return makeLeaf({ width: w, height: rect.height }, cs, cfg, isAbsolute);
    }
    return null;
  }

  return {
    type: 'container',
    layout: extractLayout(cs, rect, depth === 0),
    className: el.className || undefined,
    children
  };
}

function makeLeaf(rect, cs, cfg, isAbsolute = false) {
  const scannedMargin = resolveBox(cs, 'margin');
  const leaf = {
    type: 'leaf',
    width: rect.width,
    height: isAbsolute ? rect.height : Math.max(rect.height, cfg.minTextHeight),
    borderRadius: parseBR(cs, cfg.borderRadius),
    margin: scannedMargin || '0px 0px 6px 0px'
  };

  if (isAbsolute) {
    leaf.position = 'absolute';
    if (cs.top !== 'auto') leaf.top = cs.top;
    if (cs.left !== 'auto') leaf.left = cs.left;
    if (cs.right !== 'auto') leaf.right = cs.right;
    if (cs.bottom !== 'auto') leaf.bottom = cs.bottom;
  }

  return leaf;
}

function isIcon(el) {
  const cl = el.classList;
  return cl?.contains('lucide') || el.className?.toString?.().match?.(/(?:^|\s)pi-/);
}

function parseBR(cs, fallback) {
  const br = cs.borderRadius;
  return br && br !== '0px' ? br : `${fallback}px`;
}

function textWidth(el, cs, fallbackW) {
  if (cs.display !== 'block' && cs.display !== 'list-item') return fallbackW;
  try {
    const range = document.createRange();
    range.selectNodeContents(el);
    const tw = range.getBoundingClientRect().width;
    range.detach();
    if (tw > 0 && tw < fallbackW) return tw;
  } catch (_) {
    /* fallback */
  }
  return fallbackW;
}

function resolveBox(cs, prop) {
  const t = cs[prop + 'Top'],
    r = cs[prop + 'Right'],
    b = cs[prop + 'Bottom'],
    l = cs[prop + 'Left'];
  if (t === '0px' && r === '0px' && b === '0px' && l === '0px') return undefined;
  return `${t} ${r} ${b} ${l}`;
}

function extractLayout(cs, rect, isRoot = false) {
  const s = {};

  const pos = cs.position;
  if (pos === 'relative' || pos === 'absolute') {
    s.position = pos;
  }
  if (pos === 'absolute') {
    if (cs.top !== 'auto') s.top = cs.top;
    if (cs.left !== 'auto') s.left = cs.left;
    if (cs.right !== 'auto') s.right = cs.right;
    if (cs.bottom !== 'auto') s.bottom = cs.bottom;
  }

  const d = cs.display;

  if (d.includes('flex')) {
    s.display = 'flex';
    s.flexDirection = cs.flexDirection;
    s.alignItems = cs.alignItems;
    s.justifyContent = cs.justifyContent;
    s.flexWrap = cs.flexWrap;
    if (cs.gap !== 'normal') s.gap = cs.gap;
  } else if (d.includes('grid')) {
    s.display = 'grid';
    s.gridTemplateColumns = cs.gridTemplateColumns;
    if (cs.gap !== 'normal') s.gap = cs.gap;
  }

  if (!s.display) {
    s.display = 'flex';
    s.flexDirection = 'column';
  }

  if (cs.flexGrow !== '0') s.flexGrow = cs.flexGrow;
  if (cs.flexShrink !== '1') s.flexShrink = cs.flexShrink;
  if (cs.flexBasis !== 'auto' && cs.flexBasis !== '0px') s.flexBasis = cs.flexBasis;

  const gc = cs.gridColumn;
  if (gc && gc !== 'auto' && gc !== 'auto / auto') s.gridColumn = gc;
  const gr = cs.gridRow;
  if (gr && gr !== 'auto' && gr !== 'auto / auto') s.gridRow = gr;

  const padding = resolveBox(cs, 'padding');
  if (padding) s.padding = padding;
  const margin = resolveBox(cs, 'margin');
  if (margin) s.margin = margin;

  s.width = isRoot ? '100%' : rect.width;

  const ov = cs.overflow;
  if (ov && ov !== 'visible') s.overflow = ov;

  if (cs.minHeight !== '0px' && cs.minHeight !== 'auto') {
    s.minHeight = cs.minHeight;
  }

  const bg = cs.backgroundColor;
  if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
    s.backgroundColor = bg;
  }
  const br = cs.borderRadius;
  if (br && br !== '0px') s.borderRadius = br;

  if (cs.borderStyle !== 'none' && cs.borderWidth !== '0px') {
    s.borderWidth = cs.borderWidth;
    s.borderStyle = cs.borderStyle;
    s.borderColor = 'var(--color-neutral-300, #d1d5db)';
  }

  return s;
}

/* ══════════════════════════════════════════════
   Skeleton Renderer
   ══════════════════════════════════════════════ */

function renderNode(node, cfg, key) {
  if (!node) return null;

  if (node.type === 'leaf') {
    const style = {
      width: node.width,
      height: node.height,
      borderRadius: node.borderRadius,
      margin: node.margin,
      flexShrink: 0,
      ...(cfg.baseColor ? { backgroundColor: cfg.baseColor } : {})
    };

    if (node.position) {
      style.position = node.position;
      if (node.top !== undefined) style.top = node.top;
      if (node.left !== undefined) style.left = node.left;
      if (node.right !== undefined) style.right = node.right;
      if (node.bottom !== undefined) style.bottom = node.bottom;
    }

    return <div key={key} className="auto-skeleton__bone" style={style} />;
  }

  return (
    <div key={key} className={node.className} style={node.layout}>
      {node.children.map((child, i) => renderNode(child, cfg, i))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   Repeat Sub-component
   ══════════════════════════════════════════════ */

function Repeat({ children }) {
  return <>{children}</>;
}
Repeat.displayName = 'AutoSkeleton.Repeat';
Repeat.__autoSkeletonRepeat = true;

function processRepeats(element) {
  if (!React.isValidElement(element)) return element;

  if (element.type?.__autoSkeletonRepeat) {
    const count = element.props.count || 1;
    const tpl = element.props.children;
    return Array.from({ length: count }, (_, i) => {
      const child = React.isValidElement(tpl) ? tpl : <>{tpl}</>;
      return React.cloneElement(child, { key: `__sk_${i}` });
    });
  }

  if (element.props?.children) {
    const next = React.Children.map(element.props.children, (c) => (React.isValidElement(c) ? processRepeats(c) : c));
    return React.cloneElement(element, {}, ...React.Children.toArray(next));
  }

  return element;
}

/* ══════════════════════════════════════════════
   AutoSkeleton Component
   ══════════════════════════════════════════════ */

const AutoSkeleton = React.memo(function AutoSkeleton({ loading = false, config = {}, children }) {
  const cfg = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(config)]
  );
  const containerRef = useRef(null);
  const [tree, setTree] = useState(null);

  const rendered = useMemo(() => {
    if (!loading) return children;
    return React.Children.map(children, (c) => (React.isValidElement(c) ? processRepeats(c) : c));
  }, [loading, children]);

  useLayoutEffect(() => {
    if (!loading) {
      setTree(null);
      return;
    }
    const wrapper = containerRef.current;
    if (!wrapper) return;
    const hidden = wrapper.querySelector('[data-sk-hidden]');
    if (!hidden?.firstElementChild) return;

    setTree(scanDOM(hidden.firstElementChild, cfg));
  }, [loading, cfg]);

  if (!loading) return <>{children}</>;

  const ANIM_CLASSES = {
    shimmer: 'auto-skeleton--shimmer',
    pulse: 'auto-skeleton--pulse',
    wave: 'auto-skeleton--wave',
    fade: 'auto-skeleton--fade',
    slide: 'auto-skeleton--slide',
    none: 'auto-skeleton--none'
  };
  const animCls = ANIM_CLASSES[cfg.animation] || '';

  const wrapperStyle = { position: 'relative' };
  if (cfg.baseColor) {
    wrapperStyle['--auto-sk-base'] = cfg.baseColor;
  }

  return (
    <div ref={containerRef} className="auto-skeleton" style={wrapperStyle}>
      <div
        data-sk-hidden=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          width: '100%',
          pointerEvents: 'none',
          zIndex: -1,
          overflow: 'hidden'
        }}
      >
        {rendered}
      </div>

      {tree ? (
        <div className={animCls} role="presentation" aria-hidden="true" style={{ width: '100%' }}>
          {renderNode(tree, cfg, 'root')}
        </div>
      ) : (
        <div style={{ minHeight: 48 }} />
      )}
    </div>
  );
});

AutoSkeleton.displayName = 'AutoSkeleton';
AutoSkeleton.Repeat = Repeat;

export default AutoSkeleton;
