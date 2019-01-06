import { OutputBuffer } from "./OutputBuffer"
import { GoogleIntake } from "./GoogleIntake"
import { RescueTimeIntake } from "./RescueTimeIntake"

const buffer = new OutputBuffer()

const sources = {
	google: {
		intake: new GoogleIntake(),
	},
	rescuetime: {
		intake: new RescueTimeIntake(),
	},
}

;
(async () => {
	sources.google.intake.processFolder(buffer, "google")
	sources.rescuetime.intake.processFolder(buffer, "rescuetime")
	buffer.flush(true /* final flush */)
})()
