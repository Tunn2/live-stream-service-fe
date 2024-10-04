import { Button, Slider } from "antd";
import {
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";

interface VolumeControlProps {
  onChange: (value: number) => void;
  onToggle: () => void;
  value: number;
}

export const VolumeControl = ({
  onChange,
  onToggle,
  value,
}: VolumeControlProps) => {
  const isMuted = value === 0;
  const isAboveHalf = value > 50;

  let Icon = Volume1;

  if (isMuted) {
    Icon = VolumeX;
  } else if (isAboveHalf) {
    Icon = Volume2;
  }

  const label = isMuted ? "Unmute" : "Mute";

  return (
    <div style={{ display: "flex", gap: "1em", border: "1px solid black", borderRadius: "5px" }}>
      <Button onClick={onToggle} style={{ color: "black", background: "none", border: "none" }}>
        <Icon aria-label={label} />
      </Button>
      <Slider value={value} onChange={onChange} min={0} max={100} step={1}  style={{ width: "50px" }}/>
    </div>
  );
};
