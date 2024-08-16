import {
  AccountUpdate,
  CircuitString,
  Field,
  Mina,
  Poseidon,
  PrivateKey,
  PublicKey,
} from 'o1js';

import { Quest } from './Quest';

let proofsEnabled = false;

describe('Quest', () => {
  let deployerAccount: Mina.TestPublicKey,
    deployerKey: PrivateKey,
    senderAccount: Mina.TestPublicKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Quest;

  beforeAll(async () => {
    if (proofsEnabled) await Quest.compile();
  });

  beforeEach(async () => {
    const Local = await Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    [deployerAccount, senderAccount] = Local.testAccounts;
    deployerKey = deployerAccount.key;

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new Quest(zkAppAddress);
  });

  async function localDeploy(commitment: Field) {
    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await zkApp.deploy();
      await zkApp.initialize(commitment);
    });
    await txn.prove();
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  async function submitSolution(winner: Mina.TestPublicKey, solution: Field) {
    console.log({ solution });
    const txn = await Mina.transaction(winner, async () => {
      await zkApp.solve(solution);
    });
    await txn.prove();
    await txn.sign([winner.key]).send();
  }

  it('tests the `Quest` smart contract with actual strings solution', async () => {
    const correct_solution = CircuitString.fromString('mina').hash();
    const incorrect_solution = CircuitString.fromString('not mina').hash();

    await localDeploy(Poseidon.hash([correct_solution]));

    await expect(async () => {
      await submitSolution(senderAccount, incorrect_solution);
    }).rejects.toThrow();

    // now with a correct solution
    await submitSolution(senderAccount, correct_solution);

    const updatedNum = zkApp.counter.get();
    expect(updatedNum).toEqual(Field(1));
  });
});
