import { Field, method, Poseidon, SmartContract, State, state } from 'o1js';

export class Quest extends SmartContract {
  @state(Field) commitment = State<Field>();

  @state(Field) counter = State<Field>();

  init() {
    super.init();
    this.commitment.set(Field(0));
    this.counter.set(Field(0));
  }

  @method
  async initialize(commitment: Field) {
    // ensure commitment is not yet set
    this.commitment.requireEquals(Field(0));

    // set the commitment
    this.commitment.set(commitment);
  }

  @method
  async solve(solution: Field) {
    const commitment = this.commitment.getAndRequireEquals();
    commitment.equals(Poseidon.hash([solution])).assertTrue();
    const counter = this.counter.getAndRequireEquals();
    const newCounter = counter.add(1);
    this.counter.set(newCounter);
  }
}
