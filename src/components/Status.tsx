
import { useCommonSelector } from '@/common/commonStore.hooks';
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import React, { useEffect, useMemo } from 'react';
import Xarrow from 'react-xarrows';

type Status = 'input' | 'secret' | 'none'

const StatusColors = {
  input: '#ffc107',
  secret: '#ff1744',
  none: '#27FE0C'
}

export default function Status(props: any) {

  const { error } = props;
  const { mode, algorithm, decipher, cipher, secret, secretInput } = useCommonSelector(state => state.common);

  function getStatus() {
    if(secret.length !== algorithm.secretLength) {
      return 'secret';
    }
    if (mode === 'encrypter') {
      if(decipher.length === 0 || error === 'wrong-text' || error === 'no-text') {
        return 'input';
      }
    }
    else {
      if(cipher.length === 0 || error === 'wrong-cipher' || error === 'no-cipher') {
        return 'input';
      }
    }
    return 'none';
  }

  const [status, setStatus] = React.useState<Status>(getStatus());

  useEffect(() => {
    console.log(decipher.length, error);
    setStatus(getStatus());
  }, [decipher.length, error, secretInput.length, algorithm.secretLength]);
  
  function getStatusContent() {

    let symbol = null;
    let content = null;

    switch (status) {
      case 'input':
        symbol = <ExclamationCircleFilled id='symbol' />;
        content =  `Enter some text to ${mode === 'encrypter' ? 'encrypt' : 'decrypt'}`;
        break;
      case 'secret':
        symbol = <CloseCircleFilled id='symbol' />
        content = `Secret key must be ${algorithm.secretLength} characters`;
        break;
      default:
        symbol = <CheckCircleFilled id='symbol' />
        content = `Successfully ${mode === 'encrypter' ? 'encrypted' : 'decrypted'}`;
        break;
    }

    return (
      <div id='status' className={`controls__container ${status}-error`}>
        {symbol}
        <div className={`controls__content`}>
          {content}
        </div>
       </div>
    )
  }

  return (
    <>
      { getStatusContent() }
      {/* { status !== 'none' ? <Xarrow color={StatusColors[status]} start={'symbol'} end={status} /> : null } */}
    </>
  );
}