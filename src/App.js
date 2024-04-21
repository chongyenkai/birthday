import React, { useEffect, useState } from 'react';
import './App.css';

function getRandomPosition() {
  return Math.random(); // Returns a random value between 0 and 1
}

function App() {
  const [age, setAge] = useState(0); // State for the age input
  const [showCandles, setShowCandles] = useState(false); // State to toggle candle display

  useEffect(() => {
    let audioContext;
    let microphone, meter;

    // Get request for microphone usage
    const requestAudioAccess = () => {
      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => setAudioStream(stream))
          .catch((err) => alert('This application requires microphone access to work properly.'));
      } else alert('Your browser does not support required microphone access.');
    };

    function createAudioMeter(audioContext) {
      const processor = audioContext.createScriptProcessor(512);
      processor.onaudioprocess = (event) => {
        const buffer = event.inputBuffer.getChannelData(0);
        const sum = buffer.reduce((acc, val) => acc + val, 0);
        const rms = Math.sqrt(sum / buffer.length);
        processor.volume = Math.max(rms, processor.volume * 0.95); // Smooth out volume changes
      };
      processor.clipping = false;
      processor.volume = 0;
      processor.connect(audioContext.destination);
      return processor;
    }

    // Set up to record volume
    const setAudioStream = (stream) => {
      audioContext = new AudioContext();
      microphone = audioContext.createMediaStreamSource(stream);
      meter = createAudioMeter(audioContext);

      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      microphone.connect(filter);
      filter.connect(meter);
    };

    requestAudioAccess();
  }, []);

  // Function to handle displaying candles
  const displayCandles = () => {
    setShowCandles(true); // Set showCandles state to true
  };

  // Generate candle elements based on age
  const candleElements = [];
  for (let i = 0; i < age; i++) {
    const positionX = getRandomPosition(); // Get a random horizontal position
    const positionY = getRandomPosition(); // Get a random vertical position
    const positionOffset = Math.random() * 0.2 - 0.1; // Generate a random offset for horizontal position
    candleElements.push(
      <div className="candle" style={{ '--position-x': positionX, '--position-y': positionY, '--position-offset': positionOffset }} key={i}>
        <div className="flame"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="content">
        <div className="input">
          <label htmlFor="ageInput">Enter your age:</label>
          <input
            type="number"
            id="ageInput"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
          />
          <button onClick={displayCandles}>Show Candles</button>
        </div>
        <div id="cake">
          <div className="pyro">
            <div className="before"></div>
            <div className="after"></div>
          </div>
          <div className="box">
            <div className="plate"></div>
            <div className="layer">
              <div className="fill"></div>
            </div>
            <div className="layer">
              <div className="fill"></div>
            </div>
            <div className="icing">
              <div className="icing-sm"></div>
              <div className="icing-sm"></div>
              <div className="icing-sm"></div>
              <div className="icing-sm"></div>
              <div className="icing-sm"></div>
              <div className="icing-sm"></div>
            </div>
            <div className="candles">
              {showCandles && candleElements} {/* Conditional rendering of candles */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
