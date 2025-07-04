import React, { useState, useRef } from 'react';
import { Modal, Button, Alert, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../contexts/TTSContext';

const PhotoCapture = ({ show, onHide, onPhotoTaken, title = "Take Photo" }) => {
  const { t } = useTranslation();
  const { speak } = useTTS();
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    try {
      setError(null);
      setIsCapturing(true);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      speak('Camera started');
    } catch (err) {
      setError('Camera access denied or not available');
      speak('Camera not available');
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    canvas.toBlob((blob) => {
      const photoUrl = URL.createObjectURL(blob);
      setCapturedPhoto({
        blob,
        url: photoUrl,
        timestamp: new Date().toISOString()
      });
      speak('Photo captured');
    }, 'image/jpeg', 0.8);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const photoUrl = URL.createObjectURL(file);
      setCapturedPhoto({
        blob: file,
        url: photoUrl,
        timestamp: new Date().toISOString()
      });
      speak('Photo uploaded');
    } else {
      setError('Please select a valid image file');
      speak('Invalid file selected');
    }
  };

  const savePhoto = () => {
    if (capturedPhoto && onPhotoTaken) {
      onPhotoTaken(capturedPhoto);
      handleClose();
      speak('Photo saved');
    }
  };

  const retakePhoto = () => {
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto.url);
      setCapturedPhoto(null);
    }
    speak('Ready to take another photo');
  };

  const handleClose = () => {
    stopCamera();
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto.url);
      setCapturedPhoto(null);
    }
    setError(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-camera me-2"></i>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {!isCapturing && !capturedPhoto && (
          <div className="text-center">
            <div className="mb-4">
              <i className="bi bi-camera display-1 text-muted"></i>
              <h5 className="mt-3">Choose Photo Method</h5>
            </div>
            
            <div className="d-grid gap-3">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={startCamera}
                className="d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-camera-video me-2"></i>
                Take Photo with Camera
              </Button>
              
              <Button 
                variant="outline-secondary" 
                size="lg"
                onClick={() => fileInputRef.current?.click()}
                className="d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-upload me-2"></i>
                Upload from Gallery
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {isCapturing && !capturedPhoto && (
          <div className="text-center">
            <div className="position-relative mb-3">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-100 rounded"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
              <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                <Button
                  variant="warning"
                  size="lg"
                  onClick={capturePhoto}
                  className="rounded-circle"
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className="bi bi-camera" style={{ fontSize: '2rem' }}></i>
                </Button>
              </div>
            </div>
            
            <Button variant="secondary" onClick={stopCamera}>
              <i className="bi bi-x-circle me-2"></i>
              Cancel
            </Button>
          </div>
        )}

        {capturedPhoto && (
          <div className="text-center">
            <Card className="mb-3">
              <Card.Body>
                <img
                  src={capturedPhoto.url}
                  alt="Captured"
                  className="img-fluid rounded"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                />
              </Card.Body>
            </Card>
            
            <div className="d-flex gap-2 justify-content-center">
              <Button variant="success" size="lg" onClick={savePhoto}>
                <i className="bi bi-check-circle me-2"></i>
                Save Photo
              </Button>
              <Button variant="outline-secondary" size="lg" onClick={retakePhoto}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Retake
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </Modal.Body>
    </Modal>
  );
};

export default PhotoCapture;