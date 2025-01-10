'use client';

import { useState } from 'react';
import { generateRandomKeyPair, createTaprootOutput, createTaprootScriptWithMultisigAndTimelock, toXOnly, TransactionService } from '@0xbridge/bitcoin-vault';
import * as bitcoin from 'bitcoinjs-lib';
import { networks } from 'bitcoinjs-lib';
import { Hex } from 'bitcoinjs-lib/src/types';

export default function GenerateTaproot() {
  const [address, setAddress] = useState<string | null>(null);

  const generateAddress = () => {
    try {
      const userKeyPair = generateRandomKeyPair();
  const avsKeyPair = generateRandomKeyPair();
  const userXOnly = toXOnly(userKeyPair.publicKey);
  const avsXOnly = toXOnly(avsKeyPair.publicKey);
  //generate address from pubkey
  const user = bitcoin.payments.p2wpkh({ pubkey: userKeyPair.publicKey, network: networks.testnet }).address || '';
  
  const locktime = 123456; // Some chosen locktime
  
  // Create two branches: 2-of-2 multisig and a timelock
  const { multisigScript, timelockScript } = createTaprootScriptWithMultisigAndTimelock(
    userXOnly,
    avsXOnly,
    locktime
  );
  console.log("testnet",networks.testnet)
  
  // Build the Taproot address
  const taprootOutput = createTaprootOutput(
    userXOnly,
    multisigScript,
    timelockScript,
    networks.testnet
  );
  const address = taprootOutput?.address || '';

  
  console.log('Taproot Address:', address);
    } catch (error) {
      console.error('Error generating Taproot address:', error);
    }

  }
  const generateTransaction =async () => {
    try {
      const userKeyPair = generateRandomKeyPair();
  const avsKeyPair = generateRandomKeyPair();
  const userXOnly = toXOnly(userKeyPair.publicKey);
  const avsXOnly = toXOnly(avsKeyPair.publicKey);
  //generate address from pubkey
  const user = await bitcoin.payments.p2wpkh({ pubkey: userKeyPair.publicKey, network: networks.testnet }).address || 'tb1q6638nhyg9wpsc4tzkj0rufdl83tk02mnee0969';
  
      const meta ={
        receiverAddress: '0x03AA93e006fBa956cdBAfa2b8EF789D0Cb63e7b4',
        lockedAmount: 10000,
        chainId: 0,
        baseTokenAmount: 20000
      };
      const userAddress = 'tb1q6638nhyg9wpsc4tzkj0rufdl83tk02mnee0969'
      const transactionService = new TransactionService();
      const psbt = await transactionService.createUnsignedTransaction(
        userAddress,
        userKeyPair.publicKey,
        user,
        100,
        100,
        meta,
        1
      );

      console.log('PSBT Transaction:', psbt);
    }
    catch (error) {
      console.error('Error generating PSBT transaction:', error);
    }
  }


  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Generate Taproot Address</h1>
      <button onClick={generateAddress} style={{ padding: '0.5rem 1rem', margin: '1rem 0' }}>
        Generate Address
      </button>
      {address && <p>Your Taproot Address: <code>{address}</code></p>}

      <h1>Generate PSBT Transaction</h1>
      <button onClick={generateTransaction} style={{ padding: '0.5rem 1rem', margin: '1rem 0' }}>
        Generate PSBT Transaction
      </button>
    </main>
  );
}
