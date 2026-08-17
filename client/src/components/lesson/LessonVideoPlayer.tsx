"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Download, Gauge, Loader2 } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Video } from "@/src/types/interfaces/lesson.interface";
import { Course } from "@/src/types/interfaces/course.interface";

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export interface LessonVideoPlayerProps {
  lessonVideo?: Video | null
  lessonCourse?: Course | null;
  onProgressChange?: (
    watchedSeconds: number,
    duration: number
  ) => void;
  // downloadHref?: string;
}

const playbackSpeeds = ["0.5x", "0.75x", "1x", "1.25x", "1.5x", "2x"];

export function LessonVideoPlayer({
  lessonVideo,
  lessonCourse,
  onProgressChange
}: LessonVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [speed, setSpeed] = useState("1x");

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play();
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;

    if (!video) return;

    onProgressChange?.(
      video.currentTime,
      video.duration
    );
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;

    if (!video) return;

    onProgressChange?.(
      video.currentTime,
      video.duration
    );
  };

  const handleSpeedChange = (value: string) => {
    setSpeed(value);
    const video = videoRef.current;
    if (video) {
      video.playbackRate = parseFloat(value.replace("x", ""));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="overflow-hidden border-border bg-card p-0 shadow-sm">
        <div className="relative aspect-video w-full bg-muted">
          {isLoading ? (
            <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
          ) : null}

          <video
            ref={videoRef}
            src={lessonVideo?.url}
            poster={lessonCourse?.thumbnail.url}
            controls
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            aria-label={lessonCourse?.title}
            onLoadedData={() => setIsLoading(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="h-full w-full object-cover"
          >
            <track kind="captions" />
          </video>

          <AnimatePresence>
            {!isPlaying && !isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Image
                  src={lessonCourse?.thumbnail.url ?? ""}
                  alt={`${lessonCourse?.title} video thumbnail`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-foreground/30" aria-hidden="true" />
                <Button
                  type="button"
                  size="icon"
                  onClick={handlePlay}
                  aria-label={`Play ${lessonCourse?.title}`}
                  className="relative h-16 w-16 rounded-full shadow-lg transition-transform hover:scale-105"
                >
                  <Play className="h-7 w-7 fill-current" strokeWidth={1.75} aria-hidden="true" />
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2
                className="h-8 w-8 animate-spin text-primary-foreground"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </div>
          ) : null}
        </div>

        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <span className="text-sm text-muted-foreground">{formatDuration(lessonVideo?.duration as number)}</span>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 font-medium"
                  aria-label="Playback speed"
                >
                  <Gauge className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  {speed}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {playbackSpeeds.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onSelect={() => handleSpeedChange(option)}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}