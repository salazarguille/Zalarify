// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  EthereumCall,
  EthereumEvent,
  SmartContract,
  EthereumValue,
  JSONValue,
  TypedMap,
  Entity,
  EthereumTuple,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class PlatformPaused extends EthereumEvent {
  get params(): PlatformPaused__Params {
    return new PlatformPaused__Params(this);
  }
}

export class PlatformPaused__Params {
  _event: PlatformPaused;

  constructor(event: PlatformPaused) {
    this._event = event;
  }

  get thisContract(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get reason(): string {
    return this._event.parameters[1].value.toString();
  }
}

export class PlatformUnpaused extends EthereumEvent {
  get params(): PlatformUnpaused__Params {
    return new PlatformUnpaused__Params(this);
  }
}

export class PlatformUnpaused__Params {
  _event: PlatformUnpaused;

  constructor(event: PlatformUnpaused) {
    this._event = event;
  }

  get thisContract(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get reason(): string {
    return this._event.parameters[1].value.toString();
  }
}

export class ISettings extends SmartContract {
  static bind(address: Address): ISettings {
    return new ISettings("ISettings", address);
  }

  pausePlatform(_reason: string): boolean {
    let result = super.call("pausePlatform", [
      EthereumValue.fromString(_reason)
    ]);
    return result[0].toBoolean();
  }

  unpausePlatform(_reason: string): boolean {
    let result = super.call("unpausePlatform", [
      EthereumValue.fromString(_reason)
    ]);
    return result[0].toBoolean();
  }

  isPlatformPaused(): boolean {
    let result = super.call("isPlatformPaused", []);
    return result[0].toBoolean();
  }
}

export class PausePlatformCall extends EthereumCall {
  get inputs(): PausePlatformCall__Inputs {
    return new PausePlatformCall__Inputs(this);
  }

  get outputs(): PausePlatformCall__Outputs {
    return new PausePlatformCall__Outputs(this);
  }
}

export class PausePlatformCall__Inputs {
  _call: PausePlatformCall;

  constructor(call: PausePlatformCall) {
    this._call = call;
  }

  get _reason(): string {
    return this._call.inputValues[0].value.toString();
  }
}

export class PausePlatformCall__Outputs {
  _call: PausePlatformCall;

  constructor(call: PausePlatformCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class UnpausePlatformCall extends EthereumCall {
  get inputs(): UnpausePlatformCall__Inputs {
    return new UnpausePlatformCall__Inputs(this);
  }

  get outputs(): UnpausePlatformCall__Outputs {
    return new UnpausePlatformCall__Outputs(this);
  }
}

export class UnpausePlatformCall__Inputs {
  _call: UnpausePlatformCall;

  constructor(call: UnpausePlatformCall) {
    this._call = call;
  }

  get _reason(): string {
    return this._call.inputValues[0].value.toString();
  }
}

export class UnpausePlatformCall__Outputs {
  _call: UnpausePlatformCall;

  constructor(call: UnpausePlatformCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}
