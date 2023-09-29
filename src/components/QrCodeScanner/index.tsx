import React, { useEffect, useRef, useState, useCallback } from "react";
import type { FC } from "react";
import { BrowserMultiFormatReader, Result } from "@zxing/library";

interface QRCodeScannerProps {
  scanResultAction: (result: string) => void;
}

const QRCodeScanner: FC<QRCodeScannerProps> = ({ scanResultAction }) => {
  const [isCameraSupported, setIsCameraSupported] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  const handleScanResult = useCallback(
    (result: Result) => {
      if (result) {
        // Handle the scanned QR code result here
        scanResultAction(result.getText());
      }
    },
    [scanResultAction]
  );

  useEffect(() => {
    const startScanner = async () => {
      try {
        const codeReader: BrowserMultiFormatReader = new BrowserMultiFormatReader();
        const facingMode = { exact: "environment" }; // Use 'environment' for the back camera
        const mediaStream: MediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          codeReaderRef.current = codeReader;

          // Start the scanner when the component mounts
          await codeReaderRef.current
            .decodeFromVideoElement(videoRef.current)
            .then((result) => {
              handleScanResult(result);
              setIsCameraSupported(true);
            })
            .catch((e) => {
              setIsCameraSupported(false);
              console.error("Error decoding video element", e);
            });
        }
      } catch (e) {
        setIsCameraSupported(false);
      }
    };

    startScanner();

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, [handleScanResult]);

  return (
    <div className="qr-scanner">
      {!isCameraSupported && <p>Scanner not supported on this device</p>}
      {isCameraSupported && (
        <video ref={videoRef} autoPlay playsInline>
          <track kind="captions" />
        </video>
      )}
    </div>
  );
};

export default QRCodeScanner;
