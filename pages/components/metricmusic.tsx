import { createContext, useContext } from "react";
import audioCtx from 'audio-context';
import oscillators from "web-audio-oscillators";
type Player = (note:number) =>OscillatorNode & {
  base:number,
  freq0:number
};
export type MMTypes = 'sine' | 'square' | 'square2' | 'sawtooth' | 'triangle' | 'triangle2' | 'chiptune' | 'organ' | 'organ2' | 'organ3' | 'organ4' | 'organ5' | 'bass' | 'bass2' | 'bass3' | 'bass4' | 'brass' | 'brass2' | 'aah' | 'ooh' | 'eeh' | 'buzz' | 'buzz2' | 'dissonance'; 
const noteBase = (ctx:AudioContext|null) => (freq0:number=55, base:number=10, type:MMTypes='organ3' ) => {
    const player = (note:number=0) => {
    if(!ctx) return;
    const l = length || 1000;
    var f = freq0*Math.pow(2,(note/base))
    // var o = ctx.createOscillator();
    var o = oscillators[type](ctx)
    // o.type = type;
    o.frequency.setValueAtTime(f, ctx.currentTime);
    o.connect(ctx.destination);
    return o;
  }
  player.base = base;
  player.freq0 = freq0;
  return player;
}
const PlayerContext = createContext(noteBase(audioCtx())());
const usePlayer = () => useContext(PlayerContext)
export default noteBase;
export {
  PlayerContext,
  usePlayer,
}