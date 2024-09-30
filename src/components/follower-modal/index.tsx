import { Avatar, Button, List, Modal } from "antd";
import { replace, useNavigate } from "react-router-dom";

interface Follower {
  _id: string;
  name: string;
  avatarUrl: string;
  isFollowing: boolean;
}

interface FollowModalProps {
  title: string;
  open: boolean;
  followers: Follower[];
  onClose: () => void;
}

function FollowModal({
  title,
  open = false,
  followers,
  onClose,
}: FollowModalProps) {
  const navigate = useNavigate();
  return (
    <>
      <Modal
        open={open}
        title={title}
        onCancel={onClose}
        footer={null}
        bodyStyle={{ maxHeight: "400px", overflowY: "auto", padding: "0" }} // Scrollable modal
        width={400}
      >
        <List
          itemLayout="horizontal"
          dataSource={followers}
          renderItem={(follower) => (
            <List.Item
              key={follower._id}
              style={{
                padding: "10px 15px",
                borderBottom: "1px solid #f0f0f0",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate(`/profile/${follower._id}`);
                window.location.reload();
              }}
            >
              <List.Item.Meta
                avatar={<Avatar src={follower.avatarUrl} />}
                title={<span>{follower.name}</span>}
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
}

export default FollowModal;
