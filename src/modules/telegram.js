import fetch from "node-fetch";


export class TelegramBot {
	constructor(botToken, chatId) {
		this.botToken = botToken;
		this.chatId = chatId.split('/');  // split chat id and thread id
	}

	async sendNotification(message) {
		const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`

        const headers = {
            'Content-Type': 'application/json'
        };

        const body = {
            chat_id: this.chatId[0],
            text: message,
            parse_mode: 'HTML',
            disable_notification: false,
            disable_web_page_preview: true
        };

		if (this.chatId.length > 1) {
			body.message_thread_id = this.chatId[1];
		};

		const settings = {
			method: 'POST',
			timeout: 10000,
			headers: headers,
			body: JSON.stringify(body)
		};

		const response = await fetch(url, settings);

		if (response.status !== 200) {
			throw Error(`Failed to post TG message, reason: ${JSON.stringify(await response.json())})`);
		}
	}
}
