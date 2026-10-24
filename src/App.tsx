import { useEffect, useRef, useState } from "react";
import { greetingConfig as cfg } from "@/config/greeting";
import { useGreetingFlow } from "@/hooks/useGreetingFlow";
import { playBloom, playFlap, playReveal, playTick, setMuted } from "@/lib/sounds";
import BackgroundEffects from "./components/greeting/BackgroundEffects";
import GardenScene from "./components/greeting/GardenScene";
import SoundToggle from "./components/greeting/SoundToggle";
import Envelope from "./components/Envelope"; // lá thư CŨ của bạn, giữ nguyên
import Modals from "./components/Modals";     // modal thư/ảnh CŨ của bạn, giữ nguyên


export default function App() {
  const f = useGreetingFlow(); // hook CŨ của bạn, giữ nguyên
  const [muted, setMutedState] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [assetsReady, setAssetsReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(8);
  const [musicUnavailable, setMusicUnavailable] = useState(false);
  const musicRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let cancelled = false;
    let audioTimeout: number | undefined;
    let readyTimeout: number | undefined;
    let finishAudioLoad = () => {};
    const audio = musicRef.current;
    const imageTasks = [...cfg.photos, cfg.photoFallback].map((src) =>
      new Promise<void>((resolve) => {
        const image = new Image();
        image.onload = () => resolve();
        image.onerror = () => resolve();
        image.src = src;
        if (image.complete) resolve();
      }),
    );
    const fontTask = "fonts" in document
      ? document.fonts.ready.then(() => undefined).catch(() => undefined)
      : Promise.resolve();
    const audioTask = new Promise<void>((resolve) => {
      if (!audio) {
        resolve();
        return;
      }
      const finish = () => {
        audio.removeEventListener("canplay", onCanPlay);
        audio.removeEventListener("error", onError);
        if (audioTimeout !== undefined) window.clearTimeout(audioTimeout);
        resolve();
      };
      const onCanPlay = () => {
        setMusicUnavailable(false);
        finish();
      };
      const onError = () => {
        setMusicUnavailable(true);
        finish();
      };
      finishAudioLoad = finish;
      audio.addEventListener("canplay", onCanPlay);
      audio.addEventListener("error", onError);
      audio.load();
      audioTimeout = window.setTimeout(finish, 6500);
    });
    const progressTimer = window.setInterval(() => {
      setLoadingProgress((progress) => Math.min(progress + 7, 92));
    }, 250);

    Promise.allSettled([...imageTasks, fontTask, audioTask]).then(() => {
      window.clearInterval(progressTimer);
      if (cancelled) return;
      setLoadingProgress(100);
      readyTimeout = window.setTimeout(() => {
        if (!cancelled) setAssetsReady(true);
      }, 250);
    });

    return () => {
      cancelled = true;
      window.clearInterval(progressTimer);
      if (readyTimeout !== undefined) window.clearTimeout(readyTimeout);
      finishAudioLoad();
    };
  }, []);

  const handleMusicError = (error: unknown) => {
    console.warn("Không thể phát nhạc nền:", error);
    setMuted(true);
    setMutedState(true);
    setMusicUnavailable(true);
  };

  const startExperience = () => {
    const audio = musicRef.current;
    let playback: Promise<void> | undefined;
    if (audio && !muted) {
      audio.volume = volume;
      playback = audio.play();
    }
    setStarted(true);
    playTick();
    void playback?.catch(handleMusicError);
  };

  const onPick = () => {
    playBloom();
    f.pickFlower();
  };
  const onReveal = () => {
    playFlap();
    window.setTimeout(playReveal, 420);
    f.reveal();
  };
  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    const audio = musicRef.current;
    if (audio) {
      if (next) audio.pause();
      else {
        audio.volume = volume;
        void audio.play().catch(handleMusicError);
      }
    }
    if (!next) playTick();
  };
  const changeVolume = (nextVolume: number) => {
    setVolume(nextVolume);
    if (musicRef.current) musicRef.current.volume = nextVolume;
  };

  return (
    <main className="stage">
      {started && f.stage !== "flower" && <BackgroundEffects />}

      <header className="page-header" style={{ visibility: started ? "visible" : "hidden" }}>
        <p className="dedication">{cfg.dedication}</p>
        <p className="date-block">
          <span>20 / 10</span>
          Gửi Bônggg 💗
        </p>
      </header>

      {/* Vườn hoa luôn ở lại phía sau (không còn unmount như trước) */}
      <div className="garden-wrap" style={{ position: "absolute", inset: 0, zIndex: 10, visibility: started ? "visible" : "hidden" }}>
        <GardenScene active={started} interactive={started && f.stage === "flower"} onFlowerClick={onPick} />
      </div>

      {started && f.stage !== "flower" && <div className="veil" />}

      {started && f.stage !== "flower" && (
        <div className="object-layer">
          <Envelope
            stage={f.stage}
            cfg={cfg}
            onReveal={onReveal}
            onPhoto={() => { playTick(); f.open("photo"); }}
            onLetter={() => { playTick(); f.open("letter"); }}
          />
        </div>
      )}

      {started && f.stage === "flower" && <p className="hint-line">{cfg.flowerHint}</p>}

      {started && <Modals modal={f.modal} cfg={cfg} onClose={f.close} />}
      <audio ref={musicRef} src="/music/HuongDuong.mp3" loop preload="auto" />
      {started && <SoundToggle muted={muted} volume={volume} onToggle={toggleSound} onVolumeChange={changeVolume} />}

      {!started && (
        <section className="welcome-screen" aria-live="polite">
          <div className="welcome-card">
            <p className="welcome-eyebrow">MỘT ĐIỀU NHỎ NHOI TẶNG BNN</p>
            <h1>{assetsReady ? "Mọi thứ đã sẵn sàng" : "Đang chuẩn bị khu vườn…"}</h1>
            <p className="welcome-description">
              {assetsReady
                ? musicUnavailable
                  ? "Chưa tải được nhạc nền. Bạn vẫn có thể bắt đầu; hãy kiểm tra file nhạc nếu muốn nghe nhạc."
                  : "Bấm bắt đầuuu nèee"
                : "Đang tải hình ảnh, hiệu ứng và nhạc nền. Chờ một chút nha."}
            </p>
            <div className="loading-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={loadingProgress}>
              <span style={{ width: `${loadingProgress}%` }} />
            </div>
            <p className="loading-percent">
              {assetsReady ? musicUnavailable ? "NHẠC CHƯA SẴN SÀNG" : "SẴN SÀNG 100%" : `ĐANG TẢI ${loadingProgress}%`}
            </p>
            {assetsReady && <button className="start-button" type="button" onClick={startExperience}>Bắt đầu <span aria-hidden="true">→</span></button>}
          </div>
          <p className="welcome-footer">20 · 10 <span>✦</span> Gửi một lời chúc dịu dàng</p>
        </section>
      )}
    </main>
  );
}
