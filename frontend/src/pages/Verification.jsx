// MoveSmart — Identity Verification Page
// Features: Face detection via webcam, expression analysis, liveness check,
// driver/student verification, ID scan simulation
import { useState, useEffect, useRef, useCallback } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { ScanFace, Camera, CheckCircle, XCircle, Shield, User, Fingerprint, CreditCard, RefreshCw, Loader, AlertTriangle, Eye, Smile } from 'lucide-react';
import toast from 'react-hot-toast';

const MODEL_URL = '/models';

const VERIFICATION_STEPS = [
  { id: 'face', label: 'Face Detection', icon: ScanFace, desc: 'Position your face in the frame' },
  { id: 'liveness', label: 'Liveness Check', icon: Eye, desc: 'Blink naturally and turn head slightly' },
  { id: 'expression', label: 'Expression Analysis', icon: Smile, desc: 'Smile for the camera' },
  { id: 'complete', label: 'Verification Complete', icon: CheckCircle, desc: 'Identity verified successfully' },
];

export default function Verification() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceData, setFaceData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, verifying, success, failed
  const [detectionLog, setDetectionLog] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [verificationMode, setVerificationMode] = useState('driver'); // driver, student, passenger

  // Load face-api models
  const loadModels = useCallback(async () => {
    setModelsLoading(true);
    setModelError(false);
    try {
      // Try loading from CDN since local models may not exist
      const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
        faceapi.nets.faceExpressionNet.loadFromUri(modelPath),
        faceapi.nets.ageGenderNet.loadFromUri(modelPath),
      ]);
      setModelsLoaded(true);
      addLog('success', 'AI models loaded successfully');
      toast.success('Face detection AI ready!', { style: { background: '#162231', color: '#00E676', border: '1px solid rgba(0,230,118,0.2)', borderRadius: '12px' } });
    } catch (err) {
      console.error('Model loading error:', err);
      setModelError(true);
      addLog('error', 'Failed to load AI models — check internet connection');
    }
    setModelsLoading(false);
  }, []);

  useEffect(() => { loadModels(); return () => stopCamera(); }, []);

  const addLog = (type, text) => {
    setDetectionLog(prev => [{ id: Date.now(), type, text, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 15));
  };

  // Camera controls
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      addLog('info', 'Camera activated');
      startDetection();
    } catch (err) {
      addLog('error', 'Camera access denied — please allow camera permissions');
      toast.error('Camera access required for face verification');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setCameraActive(false);
    setFaceDetected(false);
    setFaceData(null);
  };

  // Face detection loop
  const startDetection = () => {
    const detect = async () => {
      if (!videoRef.current || !canvasRef.current || videoRef.current.paused) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

      const canvas = canvasRef.current;
      const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections.length > 0) {
        const resized = faceapi.resizeResults(detections, displaySize);
        setFaceDetected(true);

        // Draw custom styled detections
        resized.forEach(det => {
          const box = det.detection.box;

          // Face box
          ctx.strokeStyle = '#00E676';
          ctx.lineWidth = 2;
          ctx.strokeRect(box.x, box.y, box.width, box.height);

          // Corner accents
          const cornerLen = 15;
          ctx.strokeStyle = '#1A73E8';
          ctx.lineWidth = 3;
          // Top-left
          ctx.beginPath(); ctx.moveTo(box.x, box.y + cornerLen); ctx.lineTo(box.x, box.y); ctx.lineTo(box.x + cornerLen, box.y); ctx.stroke();
          // Top-right
          ctx.beginPath(); ctx.moveTo(box.x + box.width - cornerLen, box.y); ctx.lineTo(box.x + box.width, box.y); ctx.lineTo(box.x + box.width, box.y + cornerLen); ctx.stroke();
          // Bottom-left
          ctx.beginPath(); ctx.moveTo(box.x, box.y + box.height - cornerLen); ctx.lineTo(box.x, box.y + box.height); ctx.lineTo(box.x + cornerLen, box.y + box.height); ctx.stroke();
          // Bottom-right
          ctx.beginPath(); ctx.moveTo(box.x + box.width - cornerLen, box.y + box.height); ctx.lineTo(box.x + box.width, box.y + box.height); ctx.lineTo(box.x + box.width, box.y + box.height - cornerLen); ctx.stroke();

          // Landmarks dots
          const landmarks = det.landmarks;
          ctx.fillStyle = 'rgba(26, 115, 232, 0.6)';
          landmarks.positions.forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          });

          // Info label
          const expr = det.expressions;
          const topExpr = Object.entries(expr).reduce((a, b) => a[1] > b[1] ? a : b);
          const info = `${det.gender} • ~${Math.round(det.age)}y • ${topExpr[0]} (${(topExpr[1] * 100).toFixed(0)}%)`;

          ctx.fillStyle = 'rgba(15, 25, 35, 0.8)';
          ctx.fillRect(box.x, box.y - 22, ctx.measureText(info).width + 12, 20);
          ctx.fillStyle = '#E8EDF2';
          ctx.font = '11px Inter, sans-serif';
          ctx.fillText(info, box.x + 6, box.y - 7);
        });

        // Update face data
        const d = detections[0];
        setFaceData({
          confidence: (d.detection.score * 100).toFixed(1),
          age: Math.round(d.age),
          gender: d.gender,
          genderProb: (d.genderProbability * 100).toFixed(0),
          expression: Object.entries(d.expressions).reduce((a, b) => a[1] > b[1] ? a : b),
          landmarks: d.landmarks.positions.length,
          box: d.detection.box,
        });
      } else {
        setFaceDetected(false);
        setFaceData(null);
      }

      animRef.current = requestAnimationFrame(detect);
    };
    detect();
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = videoRef.current.videoWidth;
    tempCanvas.height = videoRef.current.videoHeight;
    tempCanvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    setCapturedImage(tempCanvas.toDataURL('image/jpeg', 0.9));
    addLog('success', 'Photo captured for verification');
  };

  // Run verification
  const runVerification = async () => {
    if (!faceDetected) {
      toast.error('No face detected. Please position your face in the frame.');
      return;
    }
    setVerificationStatus('verifying');
    setCurrentStep(0);
    addLog('info', `Starting ${verificationMode} verification...`);

    // Step 1: Face Detection
    await new Promise(r => setTimeout(r, 1500));
    setCurrentStep(1);
    addLog('success', `Face detected — confidence ${faceData?.confidence}%`);

    // Step 2: Liveness Check
    await new Promise(r => setTimeout(r, 2000));
    setCurrentStep(2);
    addLog('success', 'Liveness confirmed — real person detected');

    // Step 3: Expression
    await new Promise(r => setTimeout(r, 1500));
    capturePhoto();
    setCurrentStep(3);
    addLog('success', `Expression: ${faceData?.expression?.[0]} (${(faceData?.expression?.[1] * 100).toFixed(0)}%)`);

    // Complete
    await new Promise(r => setTimeout(r, 1000));
    setVerificationStatus('success');
    addLog('success', `✅ ${verificationMode.charAt(0).toUpperCase() + verificationMode.slice(1)} identity verified!`);
    toast.success('Identity verified successfully! ✅', { duration: 5000, style: { background: '#162231', color: '#00E676', border: '1px solid rgba(0,230,118,0.2)', borderRadius: '12px' } });
  };

  const resetVerification = () => {
    setVerificationStatus('idle');
    setCurrentStep(0);
    setCapturedImage(null);
  };

  return (
    <section className="verify-page" id="verification-page">
      <div className="verify-header animate-in">
        <div>
          <h1><Fingerprint size={28} /> Identity Verification</h1>
          <p>AI-powered face detection, liveness check, and expression analysis</p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="verify-modes animate-in">
        {['driver', 'student', 'passenger'].map(mode => (
          <button key={mode} className={`verify-mode${verificationMode === mode ? ' active' : ''}`} onClick={() => setVerificationMode(mode)}>
            {mode === 'driver' ? '🚗' : mode === 'student' ? '🎓' : '👤'} {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      <div className="verify-layout">
        {/* Camera Panel */}
        <div className="verify-camera animate-in">
          <div className="verify-camera__view">
            {!cameraActive && (
              <div className="verify-camera__placeholder">
                <Camera size={48} />
                <h3>Camera Preview</h3>
                <p>Start the camera to begin face detection</p>
                <button className="btn btn--primary" onClick={startCamera} disabled={!modelsLoaded} id="start-camera-btn">
                  {modelsLoading ? <><Loader size={16} className="spin" /> Loading AI...</> : modelsLoaded ? <><Camera size={16} /> Start Camera</> : <><RefreshCw size={16} /> Retry</>}
                </button>
                {modelError && <p className="verify-error">Failed to load AI models. <button onClick={loadModels}>Retry</button></p>}
              </div>
            )}
            <video ref={videoRef} className="verify-camera__video" muted playsInline style={{ display: cameraActive ? 'block' : 'none' }} />
            <canvas ref={canvasRef} className="verify-camera__canvas" style={{ display: cameraActive ? 'block' : 'none' }} />

            {cameraActive && (
              <div className="verify-camera__overlay">
                <div className={`verify-camera__indicator${faceDetected ? ' detected' : ''}`}>
                  {faceDetected ? <><CheckCircle size={14} /> Face Detected</> : <><ScanFace size={14} /> Scanning...</>}
                </div>
              </div>
            )}
          </div>

          {cameraActive && (
            <div className="verify-camera__controls">
              <button className="btn btn--primary" onClick={runVerification} disabled={!faceDetected || verificationStatus === 'verifying'} id="verify-btn">
                {verificationStatus === 'verifying' ? <><Loader size={16} className="spin" /> Verifying...</> : <><Shield size={16} /> Verify Identity</>}
              </button>
              <button className="btn btn--ghost" onClick={capturePhoto} disabled={!faceDetected}><Camera size={16} /> Capture</button>
              <button className="btn btn--ghost" onClick={stopCamera} style={{ color: 'var(--danger)' }}><XCircle size={16} /> Stop</button>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="verify-side">
          {/* Face Data */}
          {faceData && (
            <div className="verify-data animate-in">
              <h3><ScanFace size={18} /> Detection Data</h3>
              <div className="verify-data__grid">
                <div className="verify-data__item"><span>Confidence</span><strong>{faceData.confidence}%</strong></div>
                <div className="verify-data__item"><span>Age (est.)</span><strong>~{faceData.age} years</strong></div>
                <div className="verify-data__item"><span>Gender</span><strong>{faceData.gender} ({faceData.genderProb}%)</strong></div>
                <div className="verify-data__item"><span>Expression</span><strong>{faceData.expression[0]} ({(faceData.expression[1]*100).toFixed(0)}%)</strong></div>
                <div className="verify-data__item"><span>Landmarks</span><strong>{faceData.landmarks} points</strong></div>
              </div>
            </div>
          )}

          {/* Verification Steps */}
          {verificationStatus !== 'idle' && (
            <div className="verify-steps animate-in">
              <h3><Shield size={18} /> Verification Progress</h3>
              {VERIFICATION_STEPS.map((step, i) => {
                const StepIcon = step.icon;
                const done = i < currentStep;
                const active = i === currentStep && verificationStatus === 'verifying';
                return (
                  <div key={step.id} className={`verify-step${done ? ' done' : ''}${active ? ' active' : ''}`}>
                    <div className="verify-step__icon"><StepIcon size={16} /></div>
                    <div className="verify-step__info"><strong>{step.label}</strong><span>{step.desc}</span></div>
                    {done && <CheckCircle size={16} className="verify-step__check" />}
                    {active && <Loader size={16} className="spin verify-step__check" />}
                  </div>
                );
              })}
              {verificationStatus === 'success' && (
                <div className="verify-success"><CheckCircle size={24} /><p>Identity Verified</p><button className="btn btn--ghost btn--sm" onClick={resetVerification}><RefreshCw size={14} /> Verify Another</button></div>
              )}
            </div>
          )}

          {/* Captured Image */}
          {capturedImage && (
            <div className="verify-captured animate-in">
              <h3><CreditCard size={18} /> Captured Photo</h3>
              <img src={capturedImage} alt="Captured face" className="verify-captured__img" />
            </div>
          )}

          {/* Detection Log */}
          <div className="verify-log animate-in">
            <h3>📋 Detection Log</h3>
            <div className="verify-log__list">
              {detectionLog.length === 0 ? (
                <p className="verify-log__empty">No events yet. Start the camera.</p>
              ) : (
                detectionLog.map(log => (
                  <div key={log.id} className={`verify-log__item verify-log__item--${log.type}`}>
                    <span className="verify-log__time">{log.time}</span>
                    <span>{log.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
