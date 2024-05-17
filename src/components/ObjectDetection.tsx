"use client"; // This directive marks the file as a client-side c
import React, { useRef, useEffect, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from "@tensorflow/tfjs";
import Webcam from 'react-webcam';
import { drawRect } from '@/utils/draw';
import ReactAudioPlayer from 'react-audio-player';


const ObjectDetection: React.FC = () => {
    const webcamRef = useRef<any>(null);
    const canvasRef = useRef<any>(null);

    const [shouldPlaySound, setShouldPlaySound] = useState(false);

    // Main function
    const runCoco = async () => {
        tf.tensor([1, 2, 3, 4])
        const net = await cocoSsd.load();
        console.log("Handpose model loaded.");
        //  Loop and detect hands
        setInterval(() => {
            detectObjects(net);
        }, 10);
    };

    const detectObjects = async (net: any) => {
        // Check data is available
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // Make Detections
            const obj = await net.detect(video);

            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");
            drawRect(obj, ctx);
            takeAction(obj);
        }
    };

    const takeAction = (predictions: any) => {
        predictions.forEach((prediction: any) => {

            // Extract boxes and classes
            const text = prediction['class'];

            if (["cat", "dog", "animal", "mouse"].includes(text)) {
                setShouldPlaySound(true)
            }
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { runCoco() }, []);

    return (
        <div>
            <div>
                {shouldPlaySound && (
                    <ReactAudioPlayer
                        src="dog-barking.mp3"
                        autoPlay
                        onEnded={() => setShouldPlaySound(false)}
                    />
                )}
            </div>

            <Webcam
                ref={webcamRef}
                muted={true}
                style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    textAlign: "center",
                    zIndex: 5,
                    width: '100%',
                    height: '80%',
                }}
            />
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    textAlign: "center",
                    zIndex: 10,
                    width: '100%',
                    height: '100%',
                }}
            />

        </div>
    );
};

export default ObjectDetection;