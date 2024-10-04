import { Button } from "antd";
import { Maximize, Minimize } from "lucide-react";

interface FullscreenControlProps {
  isFullscreen: boolean;
  onToggle: () => void;
}

export const FullscreenControl = ({
  isFullscreen,
  onToggle,
}: FullscreenControlProps) => {
  const Icon = isFullscreen ? Minimize : Maximize;

  const label = isFullscreen ? "Exit fullscreen" : "Enter fullscreen";

  return (
    <div>
      <Button onClick={onToggle} style={{ color: "black", background: "none", border: "1px solid black", borderRadius: "5px" }}>
        <Icon aria-label={label} />
      </Button>
    </div>
  );
};
