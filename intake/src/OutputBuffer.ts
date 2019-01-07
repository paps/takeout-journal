import { IEvent } from "./IEvent"
import fs from "fs"
import path from "path"

interface IDaysBuffer {
	[key: string]: {
		writes: number,
		events: IEvent[],
		date: Date,
		sources: {
			[key: string]: number,
		},
	}| undefined,
}

interface IDaySummary {
	date: Date,
	file: string,
	sources: {
		[key: string]: number,
	},
}

export class OutputBuffer {
	private _days: IDaysBuffer = {}
	private _bufferSize = 0

	public push(event: IEvent) {
		const day = event.startDate.toDateString()
		const chosenDay = this._days[day]
		if (chosenDay) {
			chosenDay.events.push(event)
			if (chosenDay.sources[event.source]) {
				++chosenDay.sources[event.source]
			} else {
				chosenDay.sources[event.source] = 1
			}
		} else {
			this._days[day] = {
				writes: 0,
				events: [event],
				date: new Date(event.startDate.getFullYear(), event.startDate.getMonth(), event.startDate.getDate()),
				sources: {
					[event.source]: 1,
				},
			}
		}
		++this._bufferSize
		if (this._bufferSize > 100000) {
			this.flush(false /* not final flush */)
		}
	}

	public flush(final: boolean) {
		let count = 0
		for (const [key, value] of Object.entries(this._days)) {
			if (value && value.events.length > 0) {
				const filePath = path.join("output", key) + ".json"
				let array = []
				if (value.writes > 0) {
					array = JSON.parse(fs.readFileSync(filePath).toString())
				}
				array.push(...value.events)
				array.sort((a: IEvent, b: IEvent) => {
					return (new Date(a.startDate).getTime()) - (new Date(b.startDate).getTime())
				})
				fs.writeFileSync(filePath, JSON.stringify(array, undefined, "\t"))
				++value.writes
				value.events = []
				++count
			}
		}
		console.log(`(${count} files written)`)
		this._bufferSize = 0
		if (final) {
			const json: IDaySummary[] = []
			for (const [key, value] of Object.entries(this._days)) {
				if (value) {
					json.push({
						date: value.date,
						file: `${key}.json`,
						sources: value.sources,
					})
				}
			}
			json.sort((a: IDaySummary, b: IDaySummary) => {
				return a.date.getTime() - b.date.getTime()
			})
			fs.writeFileSync(path.join("output", "days.json"), JSON.stringify(json, undefined, "\t"))
		}
	}
}
