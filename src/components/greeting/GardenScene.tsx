import { useEffect, useRef, useState } from "react";
import { greetingConfig } from "@/config/greeting";
import {
  startGardenScene,
  heroRadiusFor,
  type GardenSceneHandle,
} from "@/lib/garden-scene";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface GardenSceneProps {
  active: boolean; // chỉ bắt đầu hiệu ứng nở sau khi người dùng bấm Bắt đầu
  interactive: boolean; // còn ở giai đoạn "flower" thì mới bấm được
  onFlowerClick: () => void;
}

export default function GardenScene({ active, interactive, onFlowerClick }: GardenSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<GardenSceneHandle | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [flowerSize, setFlowerSize] = useState(230);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handle = startGardenScene(canvas, { reducedMotion });
    sceneRef.current = handle;
    return () => {
      handle.destroy();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    if (active) sceneRef.current?.start();
  }, [active]);

  useEffect(() => {
    const update = () =>
      setFlowerSize(heroRadiusFor(window.innerWidth, window.innerHeight) * 2.42);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleClick = () => {
    sceneRef.current?.burst(); // bụi sáng tại bông hoa
    sceneRef.current?.bloom(); // cả vườn nở ra như bản cũ
    onFlowerClick();
  };

  return (
    <>
      <div className="garden-scene" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
      {interactive && (
        <button
          type="button"
          className="flower-button"
          style={{ ["--flower-size" as string]: `${flowerSize}px` }}
          onClick={handleClick}
          aria-label={greetingConfig.flowerHint}
        />
      )}
    </>
  );
}
