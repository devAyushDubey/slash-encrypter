import React, { useState, Children, cloneElement, useEffect } from "react";
import SelectWrapper from "./SelectWrapper";
import { Collapse, CollapseProps, Input, Tooltip } from "antd";
import { CopyOutlined, LockOutlined } from "@ant-design/icons";
import { runes } from 'runes2';
import { randomBytes } from "crypto";
import { useCommonDispatch, useCommonSelector } from "@/common/commonStore.hooks";
import { setSecret, setSecretInput } from "@/common/common.slice";
import localFont from "next/font/local";
import IVOption from "./AdvanceOptions/IVOption";

export interface EncryptionAlgorithm {
  name: string;
  secretLength: number;
}

export default function SecretInput() {
  const commonDispatch = useCommonDispatch();
  const algorithm = useCommonSelector(state => state.common.algorithm);
  const secret = useCommonSelector(state => state.common.secret);

  const items : CollapseProps['items'] = [
    {
      key: '1',
      label: 'Advance Options',
      children: <IVOption />
    }
  ]

  function handleSecretChange(secret: string) {

    commonDispatch(setSecretInput(secret));

    if(secret.length === algorithm.secretLength) {
      commonDispatch(setSecret(secret));
    }
    else {
      console.log(`Secret length must be ${algorithm.secretLength} characters long`);
    }
  }

  return (
    <div className="secret-input">
      <Input id='secret_input' addonBefore={<SelectWrapper />} addonAfter={window.innerWidth > 768 ? <LockOutlined /> : null} defaultValue={secret} onChange={(e) => handleSecretChange(e.target.value)} count={{
        show: true,
        max: algorithm.secretLength,
        strategy: (txt) => runes(txt).length,
        exceedFormatter: (txt, { max }) => runes(txt).slice(0, max).join(''),
      }}/>
      <Collapse items={items} ghost />
    </div>
  )
}