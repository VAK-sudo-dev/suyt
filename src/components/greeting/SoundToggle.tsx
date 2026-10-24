
import { Volume2, VolumeX } from "lucide-react";

interface SoundToggleProps {
  muted: boolean;
  volume: number;
  onToggle: () => void;
  onVolumeChange: (volume: number) => void;
}

/** Cụm điều khiển âm thanh với thanh trượt đủ rộng để dùng trên màn hình cảm ứng. */
export default function SoundToggle({ muted, volume, onToggle, onVolumeChange }: SoundToggleProps) {
  return (
    <div className="sound-control">
      <button
        type="button"
        className="sound-toggle"
        onClick={onToggle}
        aria-label={muted ? "Bật âm thanh" : "Tắt âm thanh"}
        aria-pressed={!muted}
      >
        {muted ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
      </button>
      <label className="volume-control">
        <span className="sr-only">Âm lượng nhạc</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) => onVolumeChange(Number(event.currentTarget.value))}
          aria-label="Âm lượng nhạc"
        />
        <output>{Math.round(volume * 100)}%</output>
      </label>
    </div>
  );
}
