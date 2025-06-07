"use client";
import { setAlgorithm } from "@/common/common.slice";
import { useCommonDispatch } from "@/common/commonStore.hooks";
import { EncryptionAlgorithmMap } from "@/common/constants";
import { Select } from "antd";
import React from "react";

export default function SelectWrapper() {

  const { Option } = Select;

  const commonDispatch = useCommonDispatch();

  function handleAlgorithmChange(value: string) {
    commonDispatch(setAlgorithm(EncryptionAlgorithmMap[value]));
  }

  return (
    <Select defaultValue="aes-256-cbc" onChange={(e) => handleAlgorithmChange(e)}>
      <Option value="aes-256-cbc">AES</Option>
      <Option value="des-ecb">DES</Option>
      <Option value="des-ede3">3DES</Option>
    </Select>
  );
}