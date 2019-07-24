// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class NewCompanyCreated extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save NewCompanyCreated entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save NewCompanyCreated entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("NewCompanyCreated", id.toString(), this);
  }

  static load(id: string): NewCompanyCreated | null {
    return store.get("NewCompanyCreated", id) as NewCompanyCreated | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get thisContract(): Bytes {
    let value = this.get("thisContract");
    return value.toBytes();
  }

  set thisContract(value: Bytes) {
    this.set("thisContract", Value.fromBytes(value));
  }

  get companyAddress(): Bytes {
    let value = this.get("companyAddress");
    return value.toBytes();
  }

  set companyAddress(value: Bytes) {
    this.set("companyAddress", Value.fromBytes(value));
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    return value.toBigInt();
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }

  get creator(): Bytes {
    let value = this.get("creator");
    return value.toBytes();
  }

  set creator(value: Bytes) {
    this.set("creator", Value.fromBytes(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get blockHash(): Bytes {
    let value = this.get("blockHash");
    return value.toBytes();
  }

  set blockHash(value: Bytes) {
    this.set("blockHash", Value.fromBytes(value));
  }

  get blockGasLimit(): BigInt {
    let value = this.get("blockGasLimit");
    return value.toBigInt();
  }

  set blockGasLimit(value: BigInt) {
    this.set("blockGasLimit", Value.fromBigInt(value));
  }

  get blockGasUsed(): BigInt {
    let value = this.get("blockGasUsed");
    return value.toBigInt();
  }

  set blockGasUsed(value: BigInt) {
    this.set("blockGasUsed", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get txInput(): Bytes {
    let value = this.get("txInput");
    return value.toBytes();
  }

  set txInput(value: Bytes) {
    this.set("txInput", Value.fromBytes(value));
  }

  get txValue(): BigInt {
    let value = this.get("txValue");
    return value.toBigInt();
  }

  set txValue(value: BigInt) {
    this.set("txValue", Value.fromBigInt(value));
  }

  get txGasPrice(): BigInt {
    let value = this.get("txGasPrice");
    return value.toBigInt();
  }

  set txGasPrice(value: BigInt) {
    this.set("txGasPrice", Value.fromBigInt(value));
  }

  get txGasUsed(): BigInt {
    let value = this.get("txGasUsed");
    return value.toBigInt();
  }

  set txGasUsed(value: BigInt) {
    this.set("txGasUsed", Value.fromBigInt(value));
  }

  get txHash(): Bytes {
    let value = this.get("txHash");
    return value.toBytes();
  }

  set txHash(value: Bytes) {
    this.set("txHash", Value.fromBytes(value));
  }
}

export class NewReceiptCreated extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save NewReceiptCreated entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save NewReceiptCreated entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("NewReceiptCreated", id.toString(), this);
  }

  static load(id: string): NewReceiptCreated | null {
    return store.get("NewReceiptCreated", id) as NewReceiptCreated | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get thisContract(): Bytes {
    let value = this.get("thisContract");
    return value.toBytes();
  }

  set thisContract(value: Bytes) {
    this.set("thisContract", Value.fromBytes(value));
  }

  get company(): Bytes {
    let value = this.get("company");
    return value.toBytes();
  }

  set company(value: Bytes) {
    this.set("company", Value.fromBytes(value));
  }

  get employee(): Bytes {
    let value = this.get("employee");
    return value.toBytes();
  }

  set employee(value: Bytes) {
    this.set("employee", Value.fromBytes(value));
  }

  get receiptHash(): string {
    let value = this.get("receiptHash");
    return value.toString();
  }

  set receiptHash(value: string) {
    this.set("receiptHash", Value.fromString(value));
  }

  get path(): string {
    let value = this.get("path");
    return value.toString();
  }

  set path(value: string) {
    this.set("path", Value.fromString(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get blockHash(): Bytes {
    let value = this.get("blockHash");
    return value.toBytes();
  }

  set blockHash(value: Bytes) {
    this.set("blockHash", Value.fromBytes(value));
  }

  get blockGasLimit(): BigInt {
    let value = this.get("blockGasLimit");
    return value.toBigInt();
  }

  set blockGasLimit(value: BigInt) {
    this.set("blockGasLimit", Value.fromBigInt(value));
  }

  get blockGasUsed(): BigInt {
    let value = this.get("blockGasUsed");
    return value.toBigInt();
  }

  set blockGasUsed(value: BigInt) {
    this.set("blockGasUsed", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get txInput(): Bytes {
    let value = this.get("txInput");
    return value.toBytes();
  }

  set txInput(value: Bytes) {
    this.set("txInput", Value.fromBytes(value));
  }

  get txValue(): BigInt {
    let value = this.get("txValue");
    return value.toBigInt();
  }

  set txValue(value: BigInt) {
    this.set("txValue", Value.fromBigInt(value));
  }

  get txGasPrice(): BigInt {
    let value = this.get("txGasPrice");
    return value.toBigInt();
  }

  set txGasPrice(value: BigInt) {
    this.set("txGasPrice", Value.fromBigInt(value));
  }

  get txGasUsed(): BigInt {
    let value = this.get("txGasUsed");
    return value.toBigInt();
  }

  set txGasUsed(value: BigInt) {
    this.set("txGasUsed", Value.fromBigInt(value));
  }

  get txHash(): Bytes {
    let value = this.get("txHash");
    return value.toBytes();
  }

  set txHash(value: Bytes) {
    this.set("txHash", Value.fromBytes(value));
  }
}

export class PlatformPaused extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save PlatformPaused entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save PlatformPaused entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("PlatformPaused", id.toString(), this);
  }

  static load(id: string): PlatformPaused | null {
    return store.get("PlatformPaused", id) as PlatformPaused | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get thisContract(): Bytes {
    let value = this.get("thisContract");
    return value.toBytes();
  }

  set thisContract(value: Bytes) {
    this.set("thisContract", Value.fromBytes(value));
  }

  get reason(): string {
    let value = this.get("reason");
    return value.toString();
  }

  set reason(value: string) {
    this.set("reason", Value.fromString(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get blockHash(): Bytes {
    let value = this.get("blockHash");
    return value.toBytes();
  }

  set blockHash(value: Bytes) {
    this.set("blockHash", Value.fromBytes(value));
  }

  get blockGasLimit(): BigInt {
    let value = this.get("blockGasLimit");
    return value.toBigInt();
  }

  set blockGasLimit(value: BigInt) {
    this.set("blockGasLimit", Value.fromBigInt(value));
  }

  get blockGasUsed(): BigInt {
    let value = this.get("blockGasUsed");
    return value.toBigInt();
  }

  set blockGasUsed(value: BigInt) {
    this.set("blockGasUsed", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get txInput(): Bytes {
    let value = this.get("txInput");
    return value.toBytes();
  }

  set txInput(value: Bytes) {
    this.set("txInput", Value.fromBytes(value));
  }

  get txValue(): BigInt {
    let value = this.get("txValue");
    return value.toBigInt();
  }

  set txValue(value: BigInt) {
    this.set("txValue", Value.fromBigInt(value));
  }

  get txGasPrice(): BigInt {
    let value = this.get("txGasPrice");
    return value.toBigInt();
  }

  set txGasPrice(value: BigInt) {
    this.set("txGasPrice", Value.fromBigInt(value));
  }

  get txGasUsed(): BigInt {
    let value = this.get("txGasUsed");
    return value.toBigInt();
  }

  set txGasUsed(value: BigInt) {
    this.set("txGasUsed", Value.fromBigInt(value));
  }

  get txHash(): Bytes {
    let value = this.get("txHash");
    return value.toBytes();
  }

  set txHash(value: Bytes) {
    this.set("txHash", Value.fromBytes(value));
  }
}

export class PlatformUnpaused extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save PlatformUnpaused entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save PlatformUnpaused entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("PlatformUnpaused", id.toString(), this);
  }

  static load(id: string): PlatformUnpaused | null {
    return store.get("PlatformUnpaused", id) as PlatformUnpaused | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get thisContract(): Bytes {
    let value = this.get("thisContract");
    return value.toBytes();
  }

  set thisContract(value: Bytes) {
    this.set("thisContract", Value.fromBytes(value));
  }

  get reason(): string {
    let value = this.get("reason");
    return value.toString();
  }

  set reason(value: string) {
    this.set("reason", Value.fromString(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get blockHash(): Bytes {
    let value = this.get("blockHash");
    return value.toBytes();
  }

  set blockHash(value: Bytes) {
    this.set("blockHash", Value.fromBytes(value));
  }

  get blockGasLimit(): BigInt {
    let value = this.get("blockGasLimit");
    return value.toBigInt();
  }

  set blockGasLimit(value: BigInt) {
    this.set("blockGasLimit", Value.fromBigInt(value));
  }

  get blockGasUsed(): BigInt {
    let value = this.get("blockGasUsed");
    return value.toBigInt();
  }

  set blockGasUsed(value: BigInt) {
    this.set("blockGasUsed", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get txInput(): Bytes {
    let value = this.get("txInput");
    return value.toBytes();
  }

  set txInput(value: Bytes) {
    this.set("txInput", Value.fromBytes(value));
  }

  get txValue(): BigInt {
    let value = this.get("txValue");
    return value.toBigInt();
  }

  set txValue(value: BigInt) {
    this.set("txValue", Value.fromBigInt(value));
  }

  get txGasPrice(): BigInt {
    let value = this.get("txGasPrice");
    return value.toBigInt();
  }

  set txGasPrice(value: BigInt) {
    this.set("txGasPrice", Value.fromBigInt(value));
  }

  get txGasUsed(): BigInt {
    let value = this.get("txGasUsed");
    return value.toBigInt();
  }

  set txGasUsed(value: BigInt) {
    this.set("txGasUsed", Value.fromBigInt(value));
  }

  get txHash(): Bytes {
    let value = this.get("txHash");
    return value.toBytes();
  }

  set txHash(value: Bytes) {
    this.set("txHash", Value.fromBytes(value));
  }
}
