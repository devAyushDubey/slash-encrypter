"use client";
import { Button, Image } from "antd";
import SecretInput, { EncryptionAlgorithm } from "./SecretInput";
import TextArea from "antd/es/input/TextArea";
import Xarrow from "react-xarrows";
import { useCommonDispatch, useCommonSelector } from "@/common/commonStore.hooks";
import { cloneDeep, debounce, set } from "lodash";
import { setCipher, setDecipher, setMode } from "@/common/common.slice";
import localFont from "next/font/local";
import "./MainApp.scss";
import dynamic from "next/dynamic";
import Status from "./Status";
import { useEffect, useMemo, useRef, useState } from "react";
import { CopyFilled, RetweetOutlined } from "@ant-design/icons";

type MainAppProps = {
  worker: React.MutableRefObject<Worker | undefined>;
}

const hortaFont = localFont({src: './Horta.woff2'});

function MainAppComponent(props: MainAppProps) {

  const { worker } = props;

  const iv = Buffer.from(useCommonSelector(state => state.common.iv), 'hex');
  const secret = useCommonSelector(state => state.common.secret);
  const secretInput = useCommonSelector(state => state.common.secretInput);
  const algorithm = useCommonSelector(state => state.common.algorithm);
  const cipher = useCommonSelector(state => state.common.cipher);
  const text = useCommonSelector(state => state.common.decipher);
  const mode = useCommonSelector(state => state.common.mode);
  const [error, setError] = useState<string>('');
  const commonDispatch = useCommonDispatch();

  const cipherRef = useRef<string>('');
  const decipherRef = useRef<string>('');
  const algorithmRef = useRef<string>('');
  const secretRef = useRef<string>('');
  const ivRef = useRef<string>('');

  const handleModeChange = () => {
    commonDispatch(setMode(mode === 'decrypter' ? 'encrypter' : 'decrypter'));
  }

  function workerMessageHandler(message: MessageEvent) {
    console.log("RESPONSE", message.data);  
    if(message.data.error) {
      setError(message.data.error.type);
      if(message.data.error.type === 'wrong-cipher' || message.data.error.type === 'no-cipher') {
        commonDispatch(setDecipher(''));
        decipherRef.current = '';
      }
      if(message.data.error.type === 'wrong-text' || message.data.error.type === 'no-text') {
        commonDispatch(setCipher(''));
        cipherRef.current = '';
      }
      return;
    }
    else {
      setError('');
    }

    if(mode === 'encrypter' && cipherRef.current !== message.data.value){
      cipherRef.current = message.data.value;
      commonDispatch(setCipher(message.data.value));
    }
    else if(decipherRef.current !== message.data.value) {
      decipherRef.current = message.data.value;
      commonDispatch(setDecipher(message.data.value));
    }
  }

  useEffect(() => {
    worker.current?.addEventListener('message', workerMessageHandler);
    return () => {
      worker.current?.removeEventListener('message', workerMessageHandler);
    }
  }, [mode]);

  useEffect(() => {
    if(secret.length !== algorithm.secretLength || 
      (
        algorithmRef.current === algorithm.name && 
        secretRef.current === secret && 
        ivRef.current === iv.toString('hex') &&
        (
          (mode === 'encrypter' && decipherRef.current === text) || 
          (mode === 'decrypter' && cipherRef.current === cipher)
        )
      )
    )
      return;

    if(ivRef.current !== iv.toString('hex'))
      ivRef.current = iv.toString('hex');

    if(algorithmRef.current !== algorithm.name)
      algorithmRef.current = algorithm.name;

    if(secretRef.current !== secret)
      secretRef.current = secret;

    if(mode === 'encrypter')
      decipherRef.current = text;
    else
      cipherRef.current = cipher;
    // console.log(mode, cipherRef, cipher, secretInput, decipherRef, text, algorithm.name);
    worker.current?.postMessage({mode, cipher, secret, text: text ?? '' , iv, algorithm: algorithm.name});
    
  }, [secretInput, secret, cipher, text, algorithm, iv]);

  return ( 
    <div className="container">
      <div className="banner">
        <div className={`flip-box ${ mode === 'encrypter' ? '' : ' flip-box--inverse' }`} >
          <div className="flip-box__inner">
            <div className="flip-box__encrypter">
              <Image className="logo" preview={false} src="./encrypter.svg" />
            </div>
            <div className="flip-box__decrypter">
              <Image className="logo" preview={false} src="./decryptr.svg" />
            </div>
          </div>
        </div>
      </div>
      <div id={window.innerWidth > 768 ? 'secret' : ''} className="secret" style={{display: window.innerWidth > 768 ? 'flex' : 'none'}}>
        <div className={`title ${hortaFont.className}`}>Secret Key: </div> 
        <SecretInput /> 
      </div>
      <div className="body">
        <FormidableInput type="decipher" />
        <div className="controls">
          { window.innerWidth > 768 ? 
            <div className="controls-wrapper">
              <Status error={error}/>
              <Button className="decrypt-button" icon={<RetweetOutlined />} onClick={() => handleModeChange()}>
                {mode === 'encrypter' ? '/Decrypter' : '/Encrypter'}
              </Button>
            </div>
          : null }
          <div id={window.innerWidth > 768 ? '' : 'secret'} className="secret" style={{display: window.innerWidth > 768 ? 'none' : 'flex'}}>
            <div className={`title ${hortaFont.className}`}>Secret Key: </div> 
            <SecretInput /> 
          </div>
        </div>
        <FormidableInput type="cipher" />
      </div>
      <div style={{marginBottom: '3rem', height: '100%'}}>
        <p className={`subtext line1 anim-typewriter`}>a super-simple yet powerful text encrypter</p> 
      </div>
      <ArrowsWrapper error={error}/>
    </div>
  )
}


function FormidableInput(props: {type: 'cipher' | 'decipher'}) {
  const { type } = props;
  const commonDispatch = useCommonDispatch();
  const text = useCommonSelector(state => state.common.decipher);
  const cipher = useCommonSelector(state => state.common.cipher);
  const mode = useCommonSelector(state => state.common.mode);

  const [isOutput, setIsOutput] = useState(() => (type === 'cipher' && mode === 'encrypter') || (type === 'decipher' && mode === 'decrypter'));
  const [clicked, setClicked] = useState(false);
  const [input, setInput] = useState(type === 'cipher' ? cipher : text);

  useMemo(() => {
    if(clicked){
      setTimeout(() => {
        setClicked(false);
      }, 2000);
    }
  }, [clicked]);

  const updateStore = useMemo(() => debounce((input: string) => {
    type === 'cipher' ? commonDispatch(setCipher(input)) : commonDispatch(setDecipher(input));
  }, 200), []);

  const handleInputChange = (input: string) => {
    setInput(input);
    updateStore(input);
  }

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(type === 'cipher' ? cipher : text);
    setClicked(true);
  }

  useEffect(() => {
    setInput(type === 'cipher' ? cipher : text);
    setIsOutput((type === 'cipher' && mode === 'encrypter') || (type === 'decipher' && mode === 'decrypter'));
  }, [mode]);
  

  function getPlaceholder() {
    return (
      type === 'decipher' ? 
        mode === 'encrypter' ? 'Enter text to be /encrypted' : "Here's your /decrypted text"
      :
        mode === 'encrypter' ? "Here's your /encrypted text" : 'Enter text to be /decrypted'
    )
  }

  return (
    <div id={type} className={`${type} ${isOutput && 'output'}`} onClick={isOutput ? () => handleCopyToClipboard() : () => {}}>
      <TextArea
        rows={10}
        placeholder={getPlaceholder()}
        readOnly={isOutput ? true : false} 
        onChange={isOutput ? () => {} : (e) => handleInputChange(e.target.value)}
        value={isOutput ? type === 'cipher' ? cipher : text : input}
      />
      {
        isOutput ? 
          clicked ?
            <div className={`copied ${hortaFont.className}`}>
              COPIED
            </div>
          :
            <CopyFilled className="copy" />
        : null
      }
    </div>
  )
}

function ArrowsWrapper(props: { error : string }) {
  const { error } = props;
  const mode = useCommonSelector(state => state.common.mode);
  const secretInput = useCommonSelector(state => state.common.secretInput);
  const text = useCommonSelector(state => state.common.decipher);
  const cipher = useCommonSelector(state => state.common.cipher);
  const algorithm = useCommonSelector(state => state.common.algorithm);

  return (
    <div className="arrows">
      {
        mode === 'encrypter' ?
          <>
            <Xarrow 
              color={text.length === 0 || error === 'wrong-text' || error === 'no-text' ? '#ffc107' : '#6495EC'} 
              start={"decipher"}
              end={"secret"}
              endAnchor={{position: window.innerWidth > 768 ?'left' : 'top', offset: {y: window.innerWidth > 768 ? 24 : 0}}}
              startAnchor={{position: 'top', offset: {y: 0}}}
              animateDrawing={true}
              headSize={5}
              headShape={text.length === 0 || error === 'wrong-text' || error === 'no-text' ? 'circle' : 'arrow1'}
            />
            <Xarrow 
              color={secretInput.length === algorithm.secretLength ? '#6495EC' : '#ff1744'} 
              start={"secret"}
              end={"cipher"}
              startAnchor={{position: window.innerWidth > 768 ? 'right' : 'bottom', offset: {y:window.innerWidth > 768 ? 24 : 32}}}
              endAnchor={{position: 'top', offset: {y: 0}}}
              animateDrawing={true}
              headSize={5}
              headShape={secretInput.length === algorithm.secretLength ? 'arrow1' : 'circle'}
            />
          </>
        :
          <>
            <Xarrow 
              color={cipher.length === 0 || error === 'wrong-cipher' || error === 'no-cipher' ? '#ffc107' : '#6495EC'}
              start={"cipher"}
              end={'secret'}
              endAnchor={{position: 'right', offset: {y: 24}}}
              startAnchor={{position:'top', offset: {y: 0}}}
              animateDrawing={true}
              headSize={5}
              headShape={cipher.length === 0 || error === 'wrong-cipher' || error === 'no-cipher' ? 'circle' : 'arrow1'}
            />
            <Xarrow 
              color={secretInput.length === algorithm.secretLength ? '#6495EC' : '#ff1744'}
              start={"secret"}
              end={'decipher'}
              startAnchor={{position: window.innerWidth > 768 ? 'left' : 'bottom', offset: {y:window.innerWidth > 768 ? 24 : 32}}}
              endAnchor={{position: 'top', offset: {y: 0}}}
              animateDrawing={true}
              headSize={5}
              headShape={secretInput.length === algorithm.secretLength ? 'arrow1' : 'circle'}
            />
          </>
      }
    </div>
  )
      
}

const MainApp = dynamic(() => Promise.resolve(MainAppComponent), {
  ssr: false,
})

export default MainApp;