import { EncryptionAlgorithm } from "@/components/SecretInput"
import { createSlice } from "@reduxjs/toolkit"
import { randomBytes } from "crypto"

interface CommonState {
  mode: 'encrypter' | 'decrypter',
  algorithm: EncryptionAlgorithm,
  secret: string,
  decipher: string,
  cipher: string,
  secretInput: string,
  iv: string;
}

const initialState: CommonState = {
  mode: 'encrypter',
  algorithm: {name: 'aes-256-cbc', secretLength: 32},
  secret: 'some-random-secretkey-for-aes256',
  decipher: '',
  cipher: '',
  secretInput: 'some-random-secretkey-for-aes256',
  iv: randomBytes(16).toString('hex')
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setAlgorithm(state, action) {
      state.algorithm = action.payload
    },
    setSecret(state, action) {
      state.secret = action.payload
    },
    setDecipher(state, action) {
      state.decipher = action.payload
    },
    setCipher(state, action) {
      state.cipher = action.payload
    },
    setSecretInput(state, action) {
      state.secretInput = action.payload
    },
    setMode(state, action) {
      state.mode = action.payload
    },
    setIV(state, action) {
      state.iv = action.payload
    }
  }
})

export const { setAlgorithm, setSecret, setDecipher, setCipher, setSecretInput, setMode, setIV } = commonSlice.actions;
export default commonSlice.reducer;