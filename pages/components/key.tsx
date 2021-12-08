import { Children, ComponentType, createContext, useContext, useEffect, useRef, useState } from "react";
import { usePlayer } from "./metricmusic"

type Props = {
  keyboardKey:string,
  note:number,
}
type KeyBoardKeyPresser = {
  letter: string,
  keyDown:() => void,
  keyUp:() => void,
}
type KeyBoardKeyPresserMap = Map<string, KeyBoardKeyPresser>;
type KeyBoardContextFunc = (p:KeyBoardKeyPresser) => void;
const KeyboardContext = createContext((p:KeyBoardKeyPresser) => {});

const KeyboardContextValue = createContext([] as KeyBoardKeyPresser[]);

const Player = (props:HTMLDivElement | {children: JSX.Element | JSX.Element[]}) => {
  const [pressers, setPressers] = useState(new Map() as KeyBoardKeyPresserMap);
  
  return (
    <KeyboardContext.Provider value ={(p:KeyBoardKeyPresser) => pressers.set(p.letter, p)}>
        <div
          tabIndex={-1} 
          onKeyDown={e => pressers.get(e.key)?.keyDown()}
          onKeyUp={e => pressers.get(e.key)?.keyUp()}
        >{props.children}</div>
    </KeyboardContext.Provider>
  )
}
const Key = (props:Props) => {
  const player = usePlayer();
  const {keyboardKey, note, ...rest} = props
  //console.log(player.base);
  let tone = undefined as OscillatorNode | undefined;
  const ref = useRef(null);
  const keyDown = () => {
    if (tone) return;
    tone = player(note);
    tone?.start();
    //console.log(ref);
    //ref.current.classList.add('shadow-inner')
  }
  const keyUp = () => {
    tone?.stop();
    tone = undefined;
    //ref.current?.classList.remove('shadow-inner')
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
      className = {`border w-16 h-16 text-center ring-grey shadow-lg m-1 relative leading-16`}
      onMouseDown={keyDown}
      onMouseUp={keyUp}
    >
      <span className="text-xl">{note.toString(player.base)}</span><span className="text-xs absolute bottom-0 right-0">{keyboardKey}</span>
    </div>
  )
}
export default Key;
export {
  Player,
}