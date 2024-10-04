import { useConnectionState, useRemoteParticipant, useTracks } from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";
import { OfflineVideo } from "./OfflineVideo";
import { LoadingVideo } from "./LoadingVideo";
import { LiveVideo } from "./LiveVideo";

interface VideoProps {
    hostName: string;
    hostIdentity: string;
};

export const Video = ({
    hostName,
    hostIdentity
}: VideoProps) => {
    const connectionState = useConnectionState();
    const participant = useRemoteParticipant(hostIdentity);
    
    const tracks = useTracks([
        Track.Source.Camera,
        Track.Source.Microphone
    ])

    let content;

    if (!participant && connectionState === ConnectionState.Connected) {
        content = <OfflineVideo username={hostName} />
    } else if (!participant || tracks.length === 0) {
        content = <LoadingVideo label={connectionState} />
    } else {
        content = <LiveVideo participant={participant} />
    }

    return (
        <div>
            {content}
        </div>
    );
}