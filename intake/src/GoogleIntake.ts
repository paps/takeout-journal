import path from "path"
import fs from "fs"
import { OutputBuffer } from "./OutputBuffer"
import { IIntake } from "./IIntake"

export class GoogleIntake implements IIntake {
	private filePaths = [
		"Ads/MyActivity.json",
		"Android/MyActivity.json",
		"Books/MyActivity.json",
		"Calendar/MyActivity.json",
		"Developers/MyActivity.json",
		"Drive/MyActivity.json",
		"Express/MyActivity.json",
		"Finance/MyActivity.json",
		"Gmail/MyActivity.json",
		"Google Apps/MyActivity.json",
		"Google Cloud/MyActivity.json",
		"Google Play Music/MyActivity.json",
		"Google Play Store/MyActivity.json",
		"Help/MyActivity.json",
		"Image Search/MyActivity.json",
		"Maps/MyActivity.json",
		"News/MyActivity.json",
		"Search/MyActivity.json",
		"Takeout/MyActivity.json",
		"Video Search/MyActivity.json",
	]

	public processFolder(buffer: OutputBuffer, folder: string) {
		for (const filePath of this.filePaths) {
			const fullPath = path.join(folder, filePath)
			console.log(`Processing ${fullPath}...`)
			let count = 0
			const events = JSON.parse(fs.readFileSync(fullPath).toString())
			if (Array.isArray(events)) {
				for (const e of events) {
					if (e && e.time) {
						++count
						const d = new Date(e.time)
						buffer.push({
							source: "google",
							filePath,
							startDate: d,
							payload: e,
						})
					}
				}
			}
			console.log(`\t→ ${count} events`)
		}
	}
}
