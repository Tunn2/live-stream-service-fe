import { useMediaQuery } from "usehooks-ts";
import { useChatSidebar } from "./use-chat-sidebar";
import {
  useChat,
  useConnectionState,
  useRemoteParticipant,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { useEffect, useMemo, useState } from "react";
import { ChatHeader } from "./chat-header";
import { ChatForm } from "./chat-form";
import { ChatList } from "./chat-list";
import { useSelector } from "react-redux";
import api from "../../configs/axios";

interface ChatProps {
  hostName: string;
  hostIdentity: string;
  viewerName: string;
  isChatEnabled: boolean;
  streamId: string,
}

export const Chat = ({
  hostName,
  hostIdentity,
  viewerName,
  isChatEnabled,
  streamId,
}: ChatProps) => {
  const user = useSelector((store) => store.user);
  const matches = useMediaQuery("( max-width: 1024px )");
  const { onExpand } = useChatSidebar((state) => state);
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);

  const isOnline = participant && connectionState === ConnectionState.Connected;
  const isHidden = !isChatEnabled || !isOnline;

  const [value, setValue] = useState("");
  const { chatMessages: messages, send } = useChat();

  useEffect(() => {
    if (matches) {
      onExpand();
    }
  }, [onExpand, matches]);

  const onSubmit = async () => {
    if (!send || !user._id) return;

    send(value);

    try {
      await api.post("/messages", {
        userId: user._id,
        streamId: streamId,
        content: value,
      });
    } catch (error) {
      console.error("Failed to save the message:", error);
    }

    setValue("");
  };

  const onChange = (value: string) => {
    setValue(value);
  };

  return (
    <div className="d-flex flex-column justify-content-between h-100">
      <ChatHeader />
      <ChatList
        messages={messages}
        isHidden={isHidden}
      />
      <ChatForm
        onSubmit={onSubmit}
        value={value}
        onChange={onChange}
        isHidden={isHidden}
      />
    </div>
  );
};
