import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VITE_API_URL = process.env.VITE_API_URL;

// Constants for video progress tracking
const ALLOW_BUFFER = 3; // Seconds allowed to skip ahead
const COMPLETE_RATIO = 0.9; // 90% completion threshold

// Fetch video information from the server
const fetchVideoInfo = async (videoId) => {
  try {
    const response = await fetch(`${VITE_API_URL}/video-student/api/watch-video/${videoId}`);
    if (!response.ok) throw new Error('Failed to fetch video info');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Initialize YouTube player
const initializePlayer = (videoId, playerRef, onReady, onStateChange) => {
  return new window.YT.Player(playerRef.current, {
    videoId,
    width: 640,
    height: 390,
    playerVars: { controls: 1, disablekb: 0, modestbranding: 1 },
    events: { onReady, onStateChange },
  });
};

// Save progress to localStorage
const saveProgress = (videoId, currentTime) => {
  const keyMax = `progress_${videoId}`;
  const keyLast = `last_${videoId}`;
  const max = parseFloat(localStorage.getItem(keyMax)) || 0;
  if (currentTime > max) localStorage.setItem(keyMax, currentTime);
  localStorage.setItem(keyLast, currentTime);
};

// Mark video as completed on server
const markVideoCompleted = async (studentId, videoRequirementId) => {
  try {
    const response = await fetch(`${VITE_API_URL}/video-student/api/finish-video/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        video_requirement_id: videoRequirementId,
      }),
    });
    if (!response.ok) throw new Error('Failed to mark video as completed');
    return true;
  } catch (error) {
    throw error;
  }
};

const Watch = () => {
  const navigate = useNavigate();
  const { videoId } = useParams(); // Extract videoId from URL
  const [searchParams] = useSearchParams(); // Extract query params
  const studentId = searchParams.get('student_id'); // Get student_id from query
  const classId = searchParams.get('class_id'); // Get class_id from query
  const [videoInfo, setVideoInfo] = useState(null); // Store video info
  const [isPlayerReady, setIsPlayerReady] = useState(false); // Track player readiness
  const playerRef = useRef(null); // Reference to player DOM element
  const playerInstance = useRef(null); // Reference to YouTube player instance
  const durationRef = useRef(0); // Video duration
  const [showQuizButton, setShowQuizButton] = useState(false); // Show/hide quiz button
  const saveTimer = useRef(null); // Timer for progress tracking

  // Load YouTube IFrame API
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(script);
    window.onYouTubeIframeAPIReady = () => setIsPlayerReady(true);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch video info when component mounts
  useEffect(() => {
    const loadVideoInfo = async () => {
      try {
        const info = await fetchVideoInfo(videoId);
        setVideoInfo(info);
      } catch (error) {
        toast.error('Không thể tải thông tin video');
        console.error(error);
      }
    };
    loadVideoInfo();
  }, [videoId]);

  // Initialize player when API and video info are ready
  useEffect(() => {
    if (isPlayerReady && videoInfo) {
      playerInstance.current = initializePlayer(
        videoInfo.video_embed,
        playerRef,
        handlePlayerReady,
        handlePlayerStateChange
      );
    }
  }, [isPlayerReady, videoInfo]);

  // Handle player ready event
  const handlePlayerReady = () => {
    const resumeTime = parseFloat(localStorage.getItem(`last_${videoInfo.video_embed}`)) || 0;
    durationRef.current = playerInstance.current.getDuration();
    playerInstance.current.seekTo(resumeTime, true);
  };

  // Handle player state changes
  const handlePlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      saveTimer.current = setInterval(() => trackProgress(), 1000);
    } else {
      clearInterval(saveTimer.current);
    }
    if (event.data === window.YT.PlayerState.ENDED) {
      setShowQuizButton(true);
      localStorage.removeItem(`last_${videoInfo.video_embed}`);
    }
  };

  // Track video progress and restrict seeking
  const trackProgress = () => {
    const currentTime = playerInstance.current.getCurrentTime();
    const maxProgress = parseFloat(localStorage.getItem(`progress_${videoInfo.video_embed}`)) || 0;
    const allowedTime = maxProgress + ALLOW_BUFFER;

    // Restrict seeking beyond allowed buffer
    if (currentTime > allowedTime) {
      playerInstance.current.seekTo(Math.max(allowedTime - 5, 0), true);
      return;
    }

    // Save current progress
    saveProgress(videoInfo.video_embed, currentTime);

    // Check if video is 90% complete
    const keyDone = `completed_${videoInfo.video_embed}`;
    if (
      !localStorage.getItem(keyDone) &&
      durationRef.current &&
      currentTime >= durationRef.current * COMPLETE_RATIO
    ) {
      markVideoCompleted(studentId, videoInfo._id)
        .then(() => {
          localStorage.setItem(keyDone, '1');
          toast.success('Ghi nhận đã hoàn thành!');
        })
        .catch((error) => {
          toast.error('Không thể ghi nhận hoàn thành video');
          console.error(error);
        });
    }
  };

  // Pause video when tab is hidden or blurred
  useEffect(() => {
    const pauseIfHidden = () => {
      if (document.hidden && playerInstance.current?.pauseVideo) {
        playerInstance.current.pauseVideo();
      }
    };
    const pauseIfBlur = () => {
      playerInstance.current?.pauseVideo?.();
    };

    document.addEventListener('visibilitychange', pauseIfHidden);
    window.addEventListener('blur', pauseIfBlur);

    return () => {
      document.removeEventListener('visibilitychange', pauseIfHidden);
      window.removeEventListener('blur', pauseIfBlur);
      clearInterval(saveTimer.current);
    };
  }, []);

  return (
    <div className="container mx-auto mt-5 flex flex-col items-center justify-center text-center">
      <h4 className="mb-1 text-xl font-semibold">
        Vui lòng xem video và chỉ được tua trong phần đã xem
      </h4>
      <div ref={playerRef} className="mx-auto my-4" />
      <button
        className={`btn bg-primary-from hover:bg-primary-to w-30 cursor-pointer rounded-xl px-4 py-2 font-bold text-white shadow-2xl ${
          showQuizButton ? 'block' : 'hidden'
        }`}
        onClick={() => navigate(`/class-student/${classId}/video`)}
      >
        Về lớp học
      </button>
    </div>
  );
};

export default Watch;
