import { createContext, useContext } from "react";
import audioCtx from 'audio-context';
type Player = (note:number) =>OscillatorNode & {
  base:number,
  freq0:number
};
const noteBase = (ctx:AudioContext|null) => (freq0:number=55, base:number=10, type:OscillatorType='sine' ) => {
    const player = (note:number=0) => {
    if(!ctx) return;
    const l = length || 1000;
    var f = freq0*Math.pow(2,(note/base))
    console.log({f, freq0, base})
    var o = ctx.createOscillator();
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