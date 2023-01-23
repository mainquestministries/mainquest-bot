export function date_string(now: Date) {
	let day = now.getDate().toString();
	if (day.length === 1) day = `0${day}`;
	let month = (now.getMonth()+1).toString();
	if (month.length === 1) month = `0${month}`;
	let year = now.getFullYear().toString();

	return `${day}.${month}.${year}`;
}
