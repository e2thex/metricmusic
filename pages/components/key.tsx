import { Children, ComponentType, createContext, useContext, useEffect, useRef, useState } from "react";
import audioCtx from 'audio-context';
import mm, { MMTypes, PlayerContext, usePlayer } from "./metricmusic"

type Props = {
  keyboardKey:string,
  note:number,
}
type KeyBoardKeyPresser = {
  letter: string,
  keyDown:(e?:Event) => void,
  keyUp:() => void,
}
type KeyBoardKeyPresserMap = Map<string, KeyBoardKeyPresser>;
type KeyBoardContextFunc = (p:KeyBoardKeyPresser) => void;
const KeyboardContext = createContext((p:KeyBoardKeyPresser) => {});

const KeyboardContextValue = createContext([] as KeyBoardKeyPresser[]);
type PlayerProps = {
  lowNote:number,
  freq0:number,
  base:number,
  shape:MMTypes,
}
const Player = (props: PlayerProps) => {
  const { lowNote, freq0, base, shape } = props;
  const [pressers, setPressers] = useState(new Map() as KeyBoardKeyPresserMap);
  const keyBoardLetters = "azsxdcfvgbhnjmk,l.;/1q2w3e4r5t6y7u8i9o0p-[=".split('');
  const keys = keyBoardLetters.map((letter, i) => <Key key ={i} note={lowNote+i} keyboardKey={letter} />);
  
  return (
    <KeyboardContext.Provider value ={(p:KeyBoardKeyPresser) => pressers.set(p.letter, p)}>
      <PlayerContext.Provider value = {mm(audioCtx())(freq0, base, shape)}>
        <div
          tabIndex={-1} 
          onKeyDown={e => pressers.get(e.key)?.keyDown()}
          onKeyUp={e => pressers.get(e.key)?.keyUp()}
        >
          <section className = 'flex -ml-8 -mr16' >
            {keys.filter((v, i) => i>=20 && i%2===0)}
          </section>
          <section className = 'flex -ml-4 -mr8' >
            {keys.filter((v, i) => i>=20 && i%2===1)}
          </section>
          <section className = 'flex mt-4' >
            {keys.filter((v, i) => i<20 && i%2===0)}
          </section>
          <section className = 'flex ml-4 -mr8' >
            {keys.filter((v, i) => i<20 && i%2===1)}
          </section>
        </div>
      </PlayerContext.Provider>
    </KeyboardContext.Provider>
  )
}
const Key = (props:Props) => {
  const player = usePlayer();
  const {keyboardKey, note, ...rest} = props
  //console.log(player.base);
  let tone = undefined as OscillatorNode | undefined;
  const ref = useRef(null);
  const refmock = {classList:{ remove: (t:string) => {}, add: (t:string) => {}}};
  type KeyDownEvent = {
    preventDefault: () => void,
    stopPropagation: () => void,
  }
  const keyDown = (e?:KeyDownEvent) => {
    if(e) e.preventDefault();
    if (e) e.stopPropagation();
    if (tone) return;
    tone = player(note);
    tone?.start();
    (ref.current || refmock).classList.add('shadow-inner');
    (ref.current || refmock).classList.add('text-gray-500');
    return false;
  }
  const keyUp = () => {
    tone?.stop();
    tone = undefined;
    (ref.current || refmock).classList.remove('shadow-inner');
    (ref.current || refmock).classList.remove('text-gray-500');
  }
  useContext(KeyboardContext)({
    keyDown,
    keyUp,
    letter:keyboardKey,
  })
  // useEffect(() => {
  //   let down = false;
  //   window.addEventListener("keydown", (ev) => {
  //     if((ev.key === keyboardKey) && !down) {
  //       console.log(ev.key);
  //       console.log(props);
  //       keyDown();
  //       down = true;
  //     }
  //   })
  //   window.addEventListener("keyup", (ev) => {
  //     if(ev.key === keyboardKey) {
  //       keyUp();
  //       down = false;
  //     }
  //   })
  // })
  return (
    <div
      ref={ref}
      id = {keyboardKey}
      className = {`touch-none select-none border w-16 h-16 text-center ring-grey shadow-lg m-1 relative leading-16`}
      onMouseDown={keyDown}
      onTouchStart={keyDown}
      onTouchEnd={keyDown}
      onMouseUp={keyUp}
    >
      <span className="text-xl">{(note || 1).toString(player.base)}</span><span className="text-xs absolute bottom-0 right-0">{keyboardKey}</span>
    </div>
  )
}
export default Key;
export {
  Player,
}