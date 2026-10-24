import { useEffect, useState } from 'react';
// Ảnh dự phòng có kích thước thật (width/height) nên khung phóng to không bị xẹp về 0
const FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="#ffe9a8"/><circle cx="200" cy="230" r="80" fill="#f9c846"/><circle cx="200" cy="230" r="42" fill="#65483a"/><rect x="194" y="300" width="12" height="150" fill="#4e7b42"/><text x="200" y="480" font-family="serif" font-size="20" text-anchor="middle" fill="#65483a">Không tải được ảnh – kiểm tra tên file</text></svg>');
export default function Photo({ src, alt, className, fallbackSrc }: { src: string; alt: string; className?: string; fallbackSrc?: string }) {
  const fallback = fallbackSrc || FALLBACK;
  const [s, setS] = useState(src);
  useEffect(() => { setS(src); }, [src]);
  return (
    <img className={className} src={s} alt={alt} draggable={false} decoding="async"
      onError={() => { if (s !== fallback) { console.warn('[Photo] Không tải được ảnh:', src); setS(fallback); } }} />
  );
}