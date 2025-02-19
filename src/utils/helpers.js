import fs from "fs";


export const sleep = (sec) => {
	return new Promise(resolve => setTimeout(resolve, sec * 1000));
};

export const randomChoice = (arr) => {
	const randomIndex = Math.floor(Math.random() * arr.length);
	return arr[randomIndex];
};

export const weightedRandomChoice = (options) => {
	let randomNumber = Math.random();
	let selectedOption;

	for (const item in options) {
		const probability = options[item];
		if (randomNumber < probability) {
			selectedOption = item;
			break;
		}
		randomNumber -= probability;
	};

	return selectedOption;
};

export const randFloat = (min, max) => {
	return Math.random() * (max - min) + min;
};

export const randInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

export const roundToAppropriateDecimalPlace = (value, minDec, maxDec) => {
	const decAmount = randInt(minDec, maxDec);
	const decimalPlaces = Math.max(0, -Math.floor(Math.log10(Math.abs(value))) + decAmount);
	return value.toFixed(decimalPlaces);
};

export const txtToArray = (filePath) => {
    return fs.readFileSync(filePath, 'utf8').toString().replace(/\r\n/g, '\n').split('\n').filter(n => n);
};

export const removeLineFromTxt = (filePath, lineToRemoveText) => {
    const allLines = txtToArray(filePath);
	const filteredLines = allLines.filter(line => line !== lineToRemoveText);

	const updatedContent = filteredLines.join('\n');
	fs.writeFileSync(filePath, updatedContent, 'utf8');
};