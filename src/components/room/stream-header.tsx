import { UserOutlined } from "@ant-design/icons";
import {
  useParticipants,
} from "@livekit/components-react";
import { Avatar, Button } from "antd";
import api from "../../configs/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LikeButton from "../like-button";

interface StreamerHeaderProps {
  hostName: string;
  hostIdentity: string;
  viewerIdentity: string;
  avatarUrl: string;
  streamTitle: string;
  like: boolean,
  likeCount: number,
  streamId: string,
}

export const StreamerHeader = ({
  hostName,
  hostIdentity,
  viewerIdentity,
  avatarUrl,
  streamTitle,
  like,
  likeCount,
  streamId,
}: StreamerHeaderProps) => {
  const participants = useParticipants();
  const participantCount = participants.length - 1;

  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const handleFollowUser = async () => {
    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);
    setIsFollowingLoading(true);

    try {
      if (newIsFollowing) {
        await api.put(`/users/follow/${viewerIdentity}/${hostIdentity}`);
      } else {
        await api.put(`/users/unfollow/${viewerIdentity}/${hostIdentity}`);
      }
    } catch (error) {
      console.error(error);
      setIsFollowing(!newIsFollowing);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-between p-3">
      <div className="d-flex align-items-center gap-3">
        <Avatar
          src={avatarUrl}
          icon={<UserOutlined />}
          size={"large"}
          onClick={() => {
            navigate(`/profile/${hostIdentity}`);
          }}
          style={{ cursor: "pointer" }}
        />
        <div className="d-flex flex-column">
          <p className="m-1">{hostName}</p>
          <p className="m-1">
            {participantCount} {participantCount > 0 ? "viewers" : "viewer"}
          </p>
        </div>
      </div>
      <div className="d-flex align-items-center gap-2">
        {hostIdentity !== viewerIdentity && (
            <>
                <LikeButton
                streamId={streamId}
                userId={viewerIdentity}
                likeCount={likeCount}
                like={like}
                />
                <Button
                type="primary"
                onClick={handleFollowUser}
                loading={isFollowingLoading}
                >
                {isFollowing ? "Followed" : "Follow"}
                </Button>
            </>
        )}
      </div>
    </div>
  );
};
