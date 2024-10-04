import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { useChatSidebar } from "./use-chat-sidebar";
import { Button } from "antd";

export const ChatToggle = () => {
  const { collapsed, onExpand, onCollapse } = useChatSidebar((state) => state);

  const Icon = collapsed ? ArrowLeftFromLine : ArrowRightFromLine;

  const onToggle = () => {
    if (collapsed) {
      onExpand();
    } else {
      onCollapse();
    }
  };

  const label = collapsed ? "Expand" : "Collapse";

  return (
    <Button
      onClick={onToggle}
      className="p-2 h-auto bg-transparent border-0 text-white"
    >
      <Icon aria-label={label}/>
    </Button>
  );
};
