import { OutputBuffer } from "./OutputBuffer"
import { IEvent } from "./IEvent"

export interface IIntake {
	processFolder(buffer: OutputBuffer, folder: string): void
}
