import { ReceivedChatMessage } from "@livekit/components-react";

interface ChatMessageProps {
  data: ReceivedChatMessage;
}

export const ChatMessage = ({ data }: ChatMessageProps) => {
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(1) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  };

  const color = stringToColor(data.from?.name || "");

  return (
    <div className="d-flex p-2" style={{ width: "100%" }}>
      <div className="d-flex flex-wrap gap-1 flex-grow-1" style={{ maxWidth: '90%', wordWrap: "break-word", wordBreak: "break-all" }}>
        <p className="mb-0 text-nowrap text-truncate">
          <span style={{ color: color }}>{data.from?.name}</span>:
        </p>
        <p className="mb-0 text-wrap text-truncate">{data.message}</p>
      </div>
    </div>
  );
};
