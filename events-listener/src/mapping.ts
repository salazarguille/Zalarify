import {
  NewCompanyCreated as NewCompanyCreatedEvent,
} from "../generated/contracts/IZalarify"
import {
  NewReceiptCreated as NewReceiptCreatedEvent,
} from "../generated/contracts/IReceiptRegistry"
import {
  PlatformPaused as PlatformPausedEvent,
  PlatformUnpaused as PlatformUnpausedEvent,
} from "../generated/contracts/ISettings"
import {
  NewCompanyCreated,
  NewReceiptCreated,
  PlatformPaused,
  PlatformUnpaused,
} from "../generated/schema"

export function handleNewCompanyCreated(event: NewCompanyCreatedEvent): void {
  let entity = new NewCompanyCreated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.thisContract = event.params.thisContract
  entity.companyAddress = event.params.companyAddress
  entity.createdAt = event.params.createdAt
  entity.creator = event.params.creator

  entity.txGasPrice = event.transaction.gasPrice
  entity.txGasUsed = event.transaction.gasUsed
  entity.txHash = event.transaction.hash
  entity.txInput = event.transaction.input
  entity.txValue = event.transaction.value

  entity.blockTimestamp = event.block.timestamp
  entity.blockGasLimit = event.block.gasLimit
  entity.blockGasUsed = event.block.gasUsed
  entity.blockHash = event.block.hash
  entity.blockNumber = event.block.number
  entity.save()
}

export function handleNewReceiptCreated(event: NewReceiptCreatedEvent): void {
  let entity = new NewReceiptCreated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.thisContract = event.params.thisContract
  entity.company = event.params.company
  entity.employee = event.params.employee
  entity.path = event.params.path
  entity.receiptHash = event.params.receiptHash

  entity.txGasPrice = event.transaction.gasPrice
  entity.txGasUsed = event.transaction.gasUsed
  entity.txHash = event.transaction.hash
  entity.txInput = event.transaction.input
  entity.txValue = event.transaction.value

  entity.blockTimestamp = event.block.timestamp
  entity.blockGasLimit = event.block.gasLimit
  entity.blockGasUsed = event.block.gasUsed
  entity.blockHash = event.block.hash
  entity.blockNumber = event.block.number
  entity.save()
}

export function handlePlatformPaused(event: PlatformPausedEvent): void {
  let entity = new PlatformPaused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.thisContract = event.params.thisContract
  entity.reason = event.params.reason

  entity.txGasPrice = event.transaction.gasPrice
  entity.txGasUsed = event.transaction.gasUsed
  entity.txHash = event.transaction.hash
  entity.txInput = event.transaction.input
  entity.txValue = event.transaction.value

  entity.blockTimestamp = event.block.timestamp
  entity.blockGasLimit = event.block.gasLimit
  entity.blockGasUsed = event.block.gasUsed
  entity.blockHash = event.block.hash
  entity.blockNumber = event.block.number
  entity.save()
}

export function handlePlatformUnpaused(event: PlatformUnpausedEvent): void {
  let entity = new PlatformUnpaused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.thisContract = event.params.thisContract
  entity.reason = event.params.reason

  entity.txGasPrice = event.transaction.gasPrice
  entity.txGasUsed = event.transaction.gasUsed
  entity.txHash = event.transaction.hash
  entity.txInput = event.transaction.input
  entity.txValue = event.transaction.value

  entity.blockTimestamp = event.block.timestamp
  entity.blockGasLimit = event.block.gasLimit
  entity.blockGasUsed = event.block.gasUsed
  entity.blockHash = event.block.hash
  entity.blockNumber = event.block.number
  entity.save()
}
