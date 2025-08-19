import * as v from 'valibot';
import { query } from '$app/server';

const DataSchema = v.object({
	startDate: v.string(),
	endDate: v.exactOptional(v.string()),
	activeBatchId: v.optional(v.string())
});

type DataParams = {
	startDate: string;
	endDate?: string;
	activeBatchId?: string;
}

export type Donation = {
	id: string;
	subject: string;
	donor_name: string;
	donor_email: string;
	text: string;
	uid: string;
	message: string;
	amount: number;
	datetime_utc: Date;
	donor_slack_id: string;
	active_batch_id?: string;
	random_string?: string;
	interac_email?: string;
	donor_id?: string;
};

// Helpers
function randString(len = 8) {
	return Math.random().toString(36).slice(2, 2 + len);
}

function randEmail(name = 'user') {
	return `${name}${randString(3)}@${randString(5)}.com`;
}

function randSentence() {
	const words = ["Hope", "Mission", "Blessed", "Thanks", "Donation", "Support", "Community", "Prayer", "Gift", "Love"];
	return Array.from({ length: 5 }, () => words[Math.floor(Math.random() * words.length)]).join(" ");
}

function randAmount() {
	return Math.round(10 + Math.random() * 9900) / 100; // $10.00 — $100.00
}

function randDate() {
	const now = Date.now();
	const days = Math.floor(Math.random() * 30);
	return new Date(now - days * 864e5);
}

// Generate a random date between two dates
function randDateBetween(start: Date, end: Date): Date {
	const startMs = start.getTime();
	const endMs = end.getTime();
	const randomMs = startMs + Math.random() * (endMs - startMs);
	return new Date(randomMs);
}



async function generateDonationArray(paramsData: DataParams): Promise<Donation[]> {
	const count = Math.floor(Math.random() * 11) + 10;

	const start = new Date(paramsData.startDate);
	const end = paramsData.endDate ? new Date(paramsData.endDate) : start;

	const donations: Donation[] = [];

	for (let i = 0; i < count; i++) {
		const randDate = randDateBetween(start, end);
		donations.push(generateRandomDonation(randDate));
	}

	donations.sort((a, b) => b.datetime_utc.getTime() - a.datetime_utc.getTime());
	return donations;
}

function generateRandomDonation(datetime_utc: Date): Donation {
	const name = "Donor" + randString(3);
	return {
		id: randString(12),
		subject: "Donation: " + randSentence(),
		donor_name: name,
		donor_email: randEmail(name),
		text: randSentence(),
		uid: randString(10),
		message: randSentence(),
		amount: randAmount(),
		datetime_utc,
		donor_slack_id: randString(8),
		active_batch_id: Math.random() > 0.5 ? randString(10) : undefined,
		random_string: Math.random() > 0.5 ? randString(10) : undefined,
		interac_email: Math.random() > 0.5 ? randEmail("interac") : undefined,
		donor_id: Math.random() > 0.5 ? randString(9) : undefined
	};
}

function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


export const getData = query(DataSchema, async (remoteParams) => {

	await delay(2000) // force a delay
	const data = await generateDonationArray(remoteParams)
	return {
		data,
		counts: 0
	};
});
