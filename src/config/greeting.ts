// Sửa nội dung tại đây; không cần đụng vào logic animation.
export type GreetingConfig = {
  title: string; subtitle: string;
  /** Hiện trong thư, ví dụ "Gửi bạn" */
  recipient: string;
  message: string[]; signature: string;
  photos: [string, ...string[]]; photoFallback: string; photoAlt: string; photoCaption: string;
  flowerHint: string; envelopeHint: string; letterPeekHint: string; letterHint: string; photoHint: string;
  dedication: string;
};

export const greetingConfig: GreetingConfig = {
  // ===== Phần thư (giữ nguyên nội dung của bạn) =====
  title: '20/10 Vui vẻee',
  subtitle: '',
  recipient: 'Há loo',
  message: [
    '20/10 năm nay rơi vào cái ngày gì đâu khom áaa Hogg có chúc được đúng ngàyy 😔',
    'Tiếc cái làa 20/10 nàyy tuii hog chuẩn bị gì nhiềuuu 😔 Cóa gì cho tuii xloi nhaaa',
    'Chúcccc Bông cóa một ngày 20/10 vuii vẻee nèee luonn xinh đẹppp và tỏa sángg!',
    'Dù khom phải đóa hoa đẹp nhấttt nhưng vẫn mạnh mẽ vương mình lên như cỏ dại =)))',
    'Luôn nở nụ cười trên môiii và khomm cóo khóc nữa nghennn💗'
  ],
  signature: '---VAK---',
  photos: [
    `${import.meta.env.BASE_URL}images/greeting-photo.png`,
    `${import.meta.env.BASE_URL}images/2.jpeg`,
    `${import.meta.env.BASE_URL}images/3.jpeg`
  ],
  photoFallback: `${import.meta.env.BASE_URL}images/greeting-photo-fallback.svg`,
  photoAlt: 'Ảnh kèm theo thư',
  photoCaption: '20 · 10 — Ngày Phụ nữ Việt Nam',

  // ===== Phần mở đầu (từ repo suytttt) =====
  flowerHint: 'Bấm vào bông hoa ikk',
  envelopeHint: 'Là lá laaa Mèo máy thông minh đáng iu ghê',
  letterPeekHint: 'Chạm vào lá thư để mở nhé…',
  letterHint: 'Chạm vào lá thư để đọc lời chúc',
  photoHint: 'Chạm vào ảnh để xem rõ hơn',
  dedication: ''
};
