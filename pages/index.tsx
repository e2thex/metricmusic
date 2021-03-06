import type { NextPage } from 'next'
import audioCtx from 'audio-context';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import mm, { MMTypes, PlayerContext } from './components/metricmusic'
import { FormEvent, useState } from 'react';
import Key, { Player } from './components/key';
import { useRouter } from 'next/router';
import { prependOnceListener } from 'process';
import { useParams} from 'react-router';
import reactGA from 'react-ga4'
type PlayerFormProps = {
  base:number,
  freq0: number,
  lowNote: number,
  shape: MMTypes
}
// eslint-disable-next-line react/display-name
const TypeOption = (props:{type:MMTypes, shape?:MMTypes}) => {
  const {shape, type} = props;
  return <option>{type}</option>
}
const PlayerForm = (props:PlayerFormProps) => {
  const {base, freq0, lowNote, shape} = props;

  const [lBase, setLBase] = useState(null as null|string);
  const [lFreq0, setLFreq0] = useState(null as null|string);
  const [lLowNote, setLLowNote] = useState(null as null|string);
  const [lShape, setLShape] = useState(null as null| string);

  const router = useRouter();
  const onSubmit = (e:FormEvent<HTMLFormElement>)=> {
    e.preventDefault();
    // window.location.replace(`?base=${lBase||base}&freq0=${lFreq0||freq0}&shape=${lShape||shape}&lowNote=${lLowNote||(lowNote.toString(base))}`)
    router.push(`?base=${lBase||base}&freq0=${lFreq0||freq0}&shape=${lShape||shape}&lowNote=${lLowNote||(lowNote.toString(base))}`);
  }
  const types = ['sine' , 'square' , 'square2' , 'sawtooth' , 'triangle' , 'triangle2' , 'chiptune' , 'organ' , 'organ2' , 'organ3' , 'organ4' , 'organ5' , 'bass' ,'bass2' , 'bass3' , 'bass4' , 'brass' , 'brass2' , 'aah' , 'ooh' , 'eeh' , 'buzz' , 'buzz2' , 'dissonance'] as MMTypes[];
  return (
    <form onSubmit={onSubmit }>
      <label className="p-3 text-lg" htmlFor="base">Base</label>
      <input className="p-3 text-lg border border-gray-700 w-16" id="base" defaultValue={base} onChange={e=> setLBase(e.target.value)}></input>
      <label className="p-3 text-lg" htmlFor="freq0">Note 0 Frequency</label>
      <input className="p-3 text-lg border border-gray-700 w-16"  id="freq0" defaultValue={freq0} onChange={e=> setLFreq0(e.target.value)}></input>
      <label className="p-3 text-lg" htmlFor="lowNote">Lowest Note</label>
      <input className="p-3 text-lg border border-gray-700 w-16"  id="lowNote" defaultValue={lowNote.toString(base)} onChange={e=> setLLowNote(e.target.value)}></input>
      <label className="p-3 text-lg" htmlFor="shape">shape</label>
      <select className="p-3 text-lg border border-gray-700 w-32"  id="shape" defaultValue={shape} onChange={e=>setLShape(e.target.value as MMTypes)}>
        {types.map(t => <TypeOption key={t} type={t} />)}
      </select>
      <input className="p-3 text-lg border border-gray-700 bg-gray-700 text-white" type="submit" value="Update"/>
    </form>
  )
}
const Home: NextPage = () => {
  reactGA.initialize('G-HV4YEMW09L');
  reactGA.send('pageview');
  const router = useRouter();
  const [base, setBase] = useState(12);
  if (router.query.base) {
    const protentalBase = parseFloat(Array.isArray(router.query.base) ? router.query.base[0] : router.query.base)
    if(protentalBase!= base) setBase(protentalBase)
  }
  const [freq0, setFreq0] = useState(27.5);
  if (router.query.freq0) {
    const protentalFreq0 = parseFloat(Array.isArray(router.query.freq0) ? router.query.freq0[0] : router.query.freq0)
    if(protentalFreq0!= freq0) setFreq0(protentalFreq0)
  }
  const [lowNote, setLowNote] = useState(20);
  if (router.query.lowNote) {
    const protentalLowNote = parseInt(Array.isArray(router.query.lowNote) ? router.query.lowNote[0] : router.query.lowNote, base)
    if(protentalLowNote!= lowNote) setLowNote(protentalLowNote)
    console.log({lowNote});
  }
  const [shape, setShape] = useState('organ' as MMTypes);
  if (router.query.shape) {
    const protentalShape = (Array.isArray(router.query.shape) ? router.query.shape[0] : router.query.shape) as MMTypes;
    if(protentalShape!= shape) setShape(protentalShape)
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Metric Music</title>
        <meta name="description" content="Play music where the octive is broken up in any base." />
        <link rel="icon" href="/favicona.ico" />
      </Head>
  
      <main className={styles.main}>
        <h1 className={styles.title}>
          Metric Music
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
