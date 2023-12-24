import express from "express";
import axios from "axios";
import Parser from "rss-parser";

const app = express();
const port = process.env.PORT || 4000;

app.get("/fetch-and-save-rss", async (req, res) => {
	try {
		const rssUrls = [
			"https://zillow.mediaroom.com/press-releases?pagetemplate=rss",
			"https://feeds.feedburner.com/inmannews"
		];

		const parser = new Parser();
		const feedPromises = rssUrls.map((url) => parser.parseURL(url));
		const feeds = await Promise.all(feedPromises);

		feeds.forEach((feed) => {
			console.log(`Feed Title: ${feed.title}`);
			feed.items.forEach((item) => {
				console.log(`- ${item.title}: ${item.link}`);
			});
		});

		res
			.status(200)
			.json({ message: "RSS feeds fetched and saved successfully" });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ error: "An error occurred while fetching and saving RSS feeds" });
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
