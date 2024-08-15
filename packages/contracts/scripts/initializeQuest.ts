import {
  CircuitString,
  Field,
  Mina,
  Poseidon,
  PrivateKey,
  PublicKey,
} from 'o1js';
import { Quest } from '../src/Quest.js';

import fs from 'fs';

const Network = Mina.Network('https://api.minascan.io/node/devnet/v1/graphql');
Mina.setActiveInstance(Network);

const transactionFee = 100_000_000;

const keypairPath = process.argv[2];
const senderKeysFileContents = fs.readFileSync(keypairPath, 'utf8');
const senderPrivateKeyBase58 = JSON.parse(senderKeysFileContents).privateKey;
const senderPrivateKey = PrivateKey.fromBase58(senderPrivateKeyBase58);
const senderPublicKey = senderPrivateKey.toPublicKey();

const zkAppPublicKey = PublicKey.fromBase58(
  'B62qjDnppFhY5tsEmLbCDRniCoJcYqLmHpEeXVfwM4Ej18uJFhTrmBb'
);

await Quest.compile();
let zkapp = new Quest(zkAppPublicKey);

const currentCommitment = await zkapp.commitment.fetch();
if (!currentCommitment) {
  throw new Error('Could not read current commitment from the contract');
}
if (!currentCommitment.equals(Field(0))) {
  throw new Error('The Quest is already initialized');
}

let transaction = await Mina.transaction(
  { sender: senderPublicKey, fee: transactionFee },
  async () => {
    await zkapp.initialize(
      Poseidon.hash([CircuitString.fromString('mina').hash()])
    );
  }
);

// fill in the proof - this can take a while...
console.log('Creating an execution proof...');
let time0 = performance.now();
await transaction.prove();
let time1 = performance.now();
console.log(`creating proof took ${(time1 - time0) / 1e3} seconds`);

// sign transaction with the sender account
transaction.sign([senderPrivateKey]);

console.log('Sending the transaction...');
let pendingTransaction = await transaction.send();

// ----------------------------------------------------

if (pendingTransaction.status === 'rejected') {
  console.log('error sending transaction (see above)');
  process.exit(0);
}

console.log(
  `See transaction at https://minascan.io/devnet/tx/${pendingTransaction.hash}
Waiting for transaction to be included...`
);
await pendingTransaction.wait();

console.log(`updated state!`);
