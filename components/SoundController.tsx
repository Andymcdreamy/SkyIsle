import React, { useEffect, useRef, useState } from 'react';

// Frequencies for a mystical C Major Pentatonic scale across two octaves
// This scale is generally consonant and "magical"
const HARP_SCALE = [
  261.63, 293.66, 329.63, 392.00, 440.00, // Octave 4
  523.25, 587.33, 659.25, 783.99, 880.00  // Octave 5
];

class AudioEngine {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  initialized = false;

  init() {
    if (this.initialized) return;
    
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8; // Master volume
    this.masterGain.connect(this.ctx.destination);
    
    this.initialized = true;
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
}

const audioEngine = new AudioEngine();

interface SoundControllerProps {
  selectedId: string | null;
}

const SoundController: React.FC<SoundControllerProps> = ({ selectedId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const harpGainRef = useRef<GainNode | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Initialize Audio on Interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!audioEngine.initialized) audioEngine.init();
      audioEngine.resume();

      if (audioEngine.ctx && audioEngine.masterGain && !harpGainRef.current) {
        setupAudioGraph(audioEngine.ctx, audioEngine.masterGain);
        setIsPlaying(true);
      }
    };

    window.addEventListener('pointerdown', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    
    return () => {
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      
      // Cleanup audio nodes if component unmounts
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
        harpGainRef.current = null;
        setIsPlaying(false);
      }
    };
  }, []);

  const setupAudioGraph = (ctx: AudioContext, master: GainNode) => {
    const t = ctx.currentTime;
    const nodesToStop: OscillatorNode[] = [];
    const nodesToDisconnect: AudioNode[] = [];

    // --- 1. Space Drone (Subtle background) ---
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const droneGain = ctx.createGain();
    const droneFilter = ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.value = 65.41; // Low C
    osc2.type = 'sine';
    osc2.frequency.value = 65.80; // Detuned C for beating effect

    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 200;
    
    droneGain.gain.setValueAtTime(0.05, t); // Very quiet

    osc1.connect(droneFilter);
    osc2.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(master);

    osc1.start();
    osc2.start();
    
    nodesToStop.push(osc1, osc2);
    nodesToDisconnect.push(droneGain, droneFilter);

    // --- 2. Harp Effects Bus (Delay/Echo) ---
    const harpBus = ctx.createGain();
    harpBus.gain.value = 0.3;

    // Delay effect for "mystical" feel
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.375; // 375ms delay
    
    const feedback = ctx.createGain();
    feedback.gain.value = 0.4; // Decay amount

    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 1500; // Dampen repeats

    harpBus.connect(master); // Dry signal
    harpBus.connect(delay);  // To delay
    delay.connect(feedback);
    feedback.connect(delay);
    feedback.connect(delayFilter);
    delayFilter.connect(master); // Wet signal

    harpGainRef.current = harpBus;
    nodesToDisconnect.push(harpBus, delay, feedback, delayFilter);

    // Define cleanup function
    cleanupRef.current = () => {
      nodesToStop.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      nodesToDisconnect.forEach(node => {
         try { node.disconnect(); } catch(e) {}
      });
    };
  };

  // Generative Harp Sequencer
  useEffect(() => {
    if (!isPlaying || !audioEngine.ctx) return;

    let timeoutId: number;
    let isActive = true;

    const playNote = () => {
       if (!isActive) return;

       const ctx = audioEngine.ctx;
       const dest = harpGainRef.current;

       if (ctx && dest) {
         // Pick a random note from the scale
         const freq = HARP_SCALE[Math.floor(Math.random() * HARP_SCALE.length)];
         const t = ctx.currentTime;

         const osc = ctx.createOscillator();
         const env = ctx.createGain();

         osc.type = 'triangle'; // Pure but soft tone
         osc.frequency.setValueAtTime(freq, t);

         // Pluck Envelope
         env.gain.setValueAtTime(0, t);
         env.gain.linearRampToValueAtTime(0.1, t + 0.02); // Fast attack
         env.gain.exponentialRampToValueAtTime(0.0001, t + 3.0); // Long tail

         osc.connect(env);
         env.connect(dest);

         osc.start(t);
         osc.stop(t + 3.1);
         
         // Cleanup individual note nodes after they are done to keep memory usage flat
         setTimeout(() => {
            try { 
              osc.disconnect(); 
              env.disconnect(); 
            } catch(e) {}
         }, 3200);
       }

       // Schedule next note randomly to create organic feel
       // Between 0.5s and 2.5s
       const nextDelay = 500 + Math.random() * 2000;
       timeoutId = window.setTimeout(playNote, nextDelay);
    };

    playNote();

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [isPlaying]);

  // Effect: Play Selection SFX
  useEffect(() => {
    if (!selectedId || !audioEngine.ctx || !audioEngine.masterGain) return;
    
    const ctx = audioEngine.ctx;
    const t = ctx.currentTime;
    
    // Magical chime for selection
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, t); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, t + 0.3); // C6
    
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    
    osc.connect(gain);
    gain.connect(audioEngine.masterGain);
    
    osc.start();
    osc.stop(t + 0.5);
    
    setTimeout(() => {
       try { osc.disconnect(); gain.disconnect(); } catch(e) {}
    }, 600);

  }, [selectedId]);

  return null;
};

export default SoundController;