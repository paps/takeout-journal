import path from "path"
import fs from "fs"
import { OutputBuffer } from "./OutputBuffer"
import { IIntake } from "./IIntake"
import Papaparse from "papaparse"
import moment from "moment"

export class RescueTimeIntake implements IIntake {
	public processFolder(buffer: OutputBuffer, folder: string) {
		const filePath = "rescuetime-activity-history.csv"
		const csv = Papaparse.parse(fs.readFileSync(path.join(folder, filePath)).toString())
		for (const line of csv.data) {
			const d = moment(line[0], "YYYY-MM-DD HH:mm:ss ZZ")
			buffer.push({
				source: "rescuetime",
				filePath,
				startDate: d.toDate(),
				endDate: d.toDate(),
				payload: {
					date: line[0],
					app: line[1],
					details: line[2],
					category: line[3],
					subcategory: line[4],
					unknown: line[5],
				},
				context: null,
			})
		}
		console.log(csv.data[0])
	}
}
