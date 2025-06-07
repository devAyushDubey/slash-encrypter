import { CopyOutlined } from "@ant-design/icons";
import { Checkbox, Input, Tooltip } from "antd";
import React, { useState } from "react";
import "./advance-options.scss";
import { useCommonDispatch, useCommonSelector } from "@/common/commonStore.hooks";
import { setIV } from "@/common/common.slice";

export default function IVOption() {
  const [isChecked, setIsChecked] = useState(false);
  const iv = useCommonSelector(state => state.common.iv);
  const commonDispatch = useCommonDispatch();
  // function handleIVClick() {
  //   navigator.clipboard.writeText(iv.toString('hex'));
  // }

  function handleIVChange(value: string) {
    if(isHex(value) && value.length === 32)
      commonDispatch(setIV(value));
  }
{/* <div className={`secret-input__note`}>Initialization Vector (IV):
            <TooltipWrapper>
              <span className="secret-input__iv" onClick={() => handleIVClick()}>
                {iv.toString('hex')} <CopyOutlined />
              </span>
            </TooltipWrapper>
          </div>  */}
  return (
    <Checkbox onChange={() => setIsChecked(!isChecked)}>
      {
        isChecked ?
          <div className="iv-option">
            <span>
              Initialization Vector (IV):
            </span>
            <Input
              defaultValue={iv} 
              variant="outlined" 
              showCount 
              maxLength={32} 
              suffix={<CopyOutlined />}
              onChange={(e) => handleIVChange(e.target.value)}
            />
          </div>
        : 'Custom Initialization Vector (IV)'
      }
    </Checkbox>
  )
}

function isHex(value: string) {
  return Boolean(value.match(/^[0-9a-fA-F]+$/))
}

function TooltipWrapper(props: {children: React.ReactNode}) {
  const [title, setTitle] = useState('Copy');
  const { children } = props;
  function handleOpenChange(open: boolean) {
    if(!open)
      setTitle('Copy');
  }
  return (
    <span onClick={() => setTitle('Copied!')}>
      <Tooltip title={title} trigger={'hover'} placement="bottom" color="#27FE0C" onOpenChange={(open) => handleOpenChange(open)}>
        { children }
      </Tooltip>
    </span> 
  )
}