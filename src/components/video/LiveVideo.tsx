import { useTracks } from "@livekit/components-react";
import { Participant, Track } from "livekit-client";
import "./LiveVideo.scss"
import { useEffect, useRef, useState } from "react";
import { FullscreenControl } from "./fullscreen-control";
import { useEventListener } from "usehooks-ts";
import { VolumeControl } from "./volume-control";

interface LiveVideoProps {
    participant: Participant;
}

export const LiveVideo = ({
    participant,
}: LiveVideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [volume, setVolume] = useState(50);

    const onVolumeChange = (value: number) => {
        setVolume(value);
        if (videoRef?.current) {
            videoRef.current.muted = value === 0;
            videoRef.current.volume = value * 0.01;
        }
    }

    const toggleMute = () => {
        const isMuted = volume === 0;

        setVolume(isMuted ? 50 : 0);
        
        if (videoRef?.current) {
            videoRef.current.muted = !isMuted;
            videoRef.current.volume = isMuted ? 0.5 : 0
        }
    }

    useEffect(() => {
        onVolumeChange(0);
    }, [])

    const toggleFullscreen = () => {
        if (isFullscreen) {
            document.exitFullscreen();
        } else if (wrapperRef?.current) {
            wrapperRef.current.requestFullscreen();
        }
    }

    const handleFullscreenChange = () => {
        const isCurrentlyFullscreen = document.fullscreenElement !== null;
        setIsFullscreen(isCurrentlyFullscreen);
    }

    useEventListener("fullscreenchange", handleFullscreenChange, wrapperRef);

    useTracks([Track.Source.Camera, Track.Source.Microphone])
    .filter((track) => track.participant.identity === participant.identity)
    .forEach((track) => {
        if (videoRef.current) {
            track.publication.track?.attach(videoRef.current);
        }
    })

    return (
        <div ref={wrapperRef} className="videoWrapper" style={{ width: "100%", borderBottom: "1px solid white", borderRight: "1px solid white" }}>
            <video ref={videoRef} />
            <div className="fullscreenControl">
                <VolumeControl value={volume} onChange={onVolumeChange} onToggle={toggleMute} />
                <FullscreenControl isFullscreen={isFullscreen} onToggle={toggleFullscreen}/>
            </div>
        </div>
    )
}