export interface IEvent {
	source: string
	filePath: string
	startDate: Date
	endDate: Date
	payload: unknown
	context: unknown
}
