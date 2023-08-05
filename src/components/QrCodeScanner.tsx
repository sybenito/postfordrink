import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

const QRCodeScanner: React.FC = () => {
  const [scanResult, setScanResult] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  const handleScanResult = (result: Result) => {
    if (result) {
      // Handle the scanned QR code result here
      setScanResult(result.getText());
    }
  };

  useEffect(() => {
    const startScanner = async () => {
      try {
        const codeReader: BrowserMultiFormatReader = new BrowserMultiFormatReader();
        const mediaStream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          codeReaderRef.current = codeReader;

          // Start the scanner when the component mounts
          await codeReaderRef.current.decodeFromVideoElement(videoRef.current)
            .then((result) => handleScanResult(result))
            .catch((e) => console.error(e));
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startScanner();

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  return (
    <div className="qr-scanner">
      <video ref={videoRef} autoPlay playsInline><track kind="captions" /></video>
      {scanResult && <p>{scanResult}</p>}
    </div>
  );
};

export default QRCodeScanner;
