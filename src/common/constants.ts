import { EncryptionAlgorithm } from "@/components/SecretInput";

type EncryptionAlgorithmMapType = {
  [key: string]: EncryptionAlgorithm;
}

export const AES: EncryptionAlgorithm = {
  name: 'aes-256-cbc',
  secretLength: 32
}

export const DES: EncryptionAlgorithm = {
  name: 'des-ecb',
  secretLength: 8
}

export const DES3: EncryptionAlgorithm = {
  name: 'des-ede3',
  secretLength: 24
}


export const EncryptionAlgorithmMap: EncryptionAlgorithmMapType  = {
  'aes-256-cbc': AES,
  'des-ecb': DES,
  'des-ede3': DES3
}
