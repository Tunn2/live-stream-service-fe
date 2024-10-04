import { MessageSquare } from "lucide-react";
import { ChatToggle } from "./chat-toggle";

export const ChatHeader = () => {
  return (
    <div className="position-relative p-3 border-bottom w-100 d-flex align-items-center justify-content-between">
      <ChatToggle />
      <p className="fw-bold text-white text-center mb-0">Stream Chat</p>
      <MessageSquare />
    </div>
  );
};
