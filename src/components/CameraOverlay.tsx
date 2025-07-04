import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Dropdown, Form } from 'react-bootstrap';

interface CameraOverlayProps {
  onSpeak: (text: string) => void;
  className?: string;
}

const CameraOverlay: React.FC<CameraOverlayProps> = ({ onSpeak, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Get available cameras
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);
        if (videoDevices.length > 0 && !selectedCamera) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error getting cameras:', error);
      }
    };

    getCameras();
  }, [selectedCamera]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        const constraints = {
          video: selectedCamera ? { deviceId: selectedCamera } : true
        };

        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(newStream);

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        onSpeak('Camera access failed. Please check permissions and try again.');
      }
    };

    if (selectedCamera) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedCamera]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const handleLoadedMetadata = () => {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        drawArrows();
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, []);

  const drawArrows = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#28a745';
    ctx.lineWidth = 6;
    ctx.fillStyle = '#28a745';

    // Arrow 1: Forward (middle top)
    drawArrow(ctx, canvas.width / 2, canvas.height * 0.7, canvas.width / 2, canvas.height * 0.3);

    // Arrow 2: Left
    drawArrow(ctx, canvas.width * 0.4, canvas.height * 0.8, canvas.width * 0.2, canvas.height * 0.6);

    // Arrow 3: Right
    drawArrow(ctx, canvas.width * 0.6, canvas.height * 0.8, canvas.width * 0.8, canvas.height * 0.6);
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    const headlen = 20;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6),
               y2 - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6),
               y2 - headlen * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(x2, y2);
    ctx.fill();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Card className={`h-100 ${className}`}>
      <Card.Header className="d-flex justify-content-between align-items-center bg-dark text-white">
        <div className="d-flex align-items-center">
          <i className="bi bi-camera-video me-2"></i>
          <span className="fw-bold">Live Camera Feed</span>
        </div>
        <div className="d-flex gap-2">
          <Dropdown show={isSettingsOpen} onToggle={setIsSettingsOpen}>
            <Dropdown.Toggle variant="outline-light" size="sm">
              <i className="bi bi-gear"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>Select Camera</Dropdown.Header>
              {cameras.map((camera) => (
                <Dropdown.Item
                  key={camera.deviceId}
                  active={selectedCamera === camera.deviceId}
                  onClick={() => setSelectedCamera(camera.deviceId)}
                >
                  {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button
            variant="outline-light"
            size="sm"
            onClick={toggleFullscreen}
          >
            <i className={`bi ${isFullscreen ? 'bi-fullscreen-exit' : 'bi-fullscreen'}`}></i>
          </Button>
        </div>
      </Card.Header>
      
      <Card.Body className="p-0 position-relative bg-black" style={{ minHeight: '400px' }}>
        <div 
          className={`position-relative w-100 h-100 ${isFullscreen ? 'position-fixed top-0 start-0 w-100 h-100' : ''}`}
          style={{ zIndex: isFullscreen ? 9999 : 'auto' }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
          <canvas
            ref={canvasRef}
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ pointerEvents: 'none' }}
          />
          
          {/* Camera Status Indicator */}
          <div className="position-absolute bottom-0 start-0 m-3">
            <span className="badge bg-success d-flex align-items-center">
              <i className="bi bi-record-circle me-1"></i>
              LIVE
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CameraOverlay;