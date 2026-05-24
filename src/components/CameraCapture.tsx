import React, { useRef, useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { T } from './TranslationProvider';

interface CameraCaptureProps {
  onCapture: (photo: string) => void;
  onClose: () => void;
  label: string;
}

export function CameraCapture({ onCapture, onClose, label }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const photo = canvas.toDataURL('image/jpeg');
      onCapture(photo);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="p-4 flex justify-between items-center text-white">
        <span className="font-bold"><T>{label}</T></span>
        <button onClick={onClose}><X /></button>
      </div>
      <video ref={videoRef} autoPlay playsInline className="flex-grow w-full object-cover" />
      <div className="p-8 flex justify-center">
        <button onClick={takePhoto} className="bg-white p-4 rounded-full">
            <Camera size={32} className="text-black" />
        </button>
      </div>
    </div>
  );
}
