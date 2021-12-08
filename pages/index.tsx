import type { NextPage } from 'next'
import audioCtx from 'audio-context';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import mm, { PlayerContext } from './components/metricmusic'
import { FormEvent, useState } from 'react';
import Key, { Player } from './components/key';
import { useRouter } from 'next/router';
import { prependOnceListener } from 'process';
import { useParams} from 'react-router';
type PlayerFormProps = {
  base:number,
  freq0: number,
  lowNote: number,
  shape: OscillatorType
}
const PlayerForm = (props:PlayerFormProps) => {
  const {base, freq0, lowNote, shape} = props;
  console.log(props);
  const [lBase, setLBase] = useState(null);
  const [lFreq0, setLFreq0] = useState(null);
  const [lLowNote, setLLowNote] = useState(null);
  const [lShape, setLShape] = useState(null);
  const onSubmit = (e:FormEvent<HTMLFormElement>)=> {
    e.preventDefault();
    window.location.replace(`?base=${lBase||base}&freq0=${lFreq0||freq0}&shape=${lShape||shape}&lowNote=${lLowNote||lowNote}`)
  }
  return (
    <form onSubmit={onSubmit }>
      <label className="p-3 text-lg" htmlFor="base">Base</label>
      <input className="p-3 text-lg border border-gray-700 w-16" id="base" defaultValue={base} onChange={e=> setLBase(e.target.value)}></input>
      <label className="p-3 text-lg" htmlFor="freq0">Note 0 Frequency</label>
      <input className="p-3 text-lg border border-gray-700 w-16"  id="freq0" defaultValue={freq0} onChange={e=> setLFreq0(e.target.value)}></input>
      <label className="p-3 text-lg" htmlFor="lowNote">Lowest Note</label>
      <input className="p-3 text-lg border border-gray-700 w-16"  id="lowNote" defaultValue={lowNote.toString(base)} onChange={e=> setLLowNote(e.target.value)}></input>
      <label className="p-3 text-lg" htmlFor="shape">shape</label>
      <select className="p-3 text-lg border border-gray-700 w-32"  id="shape" defaultValue={shape} onChange={e=>setLShape(e.target.value as OscillatorType)}>
        <option defaultChecked={shape==='triangle'}>triangle</option>
        <option defaultChecked={shape==='square'}>square</option>
        <option defaultChecked={shape==='sine'}>sine</option>
      </select>
      <input className="p-3 text-lg border border-gray-700 bg-gray-700 text-white" type="submit" value="Update"/>
    </form>
  )
}
const Home: NextPage = () => {
  const router = useRouter();
  const baseRaw = Array.isArray(router.query.base) ? router.query.base[0] : router.query.base; 
  const base = parseFloat(baseRaw || '12')
  const freq0 = parseFloat(Array.isArray(router.query.freq0) ? router.query.freq0[0] : router.query.freq0 || '27.5');
  const lowNote = parseInt(Array.isArray(router.query.lowNote) ? router.query.lowNote[0] : router.query.lowNote || '20', base);
  const shape = (Array.isArray(router.query.shape) ? router.query.shape[0] : router.query.shape || 'triangle') as OscillatorType;
  return (
    <div className={styles.container}>
      <Head>
        <title>Metric Music</title>
        <meta name="description" content="Play music where the octive is broken up in any base." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to metric Music b
        </h1>
        <PlayerForm {...{lowNote, base, freq0, shape}} />
        {!router.query.freq0 ? <></> : <Player {...{lowNote, freq0, base, shape}} /> }
      </main>

      <footer className={styles.footer}>
      
      </footer>
    </div>
  )
}

export default Home
