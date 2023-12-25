import express, { Request, Response } from "express";
import Parser from "rss-parser";

const app = express();
const port = process.env.PORT || 4000;

interface RSSItem {
	title: string | undefined;
	link: string | undefined;
}

interface FeedResult {
	title: string;
	items: RSSItem[];
}

app.get("/fetch-rss-links", async (req: Request, res: Response) => {
	try {
		//TODO: Needs to take in URLS through req.
		const rssUrls = [
			"https://zillow.mediaroom.com/press-releases?pagetemplate=rss",
			"https://feeds.feedburner.com/inmannews"
		];

		const parser = new Parser();
		const feedPromises = rssUrls.map((url) => parser.parseURL(url));
		const feeds = await Promise.all(feedPromises);

		const feedResults: FeedResult[] = feeds.map((feed) => {
			const items: RSSItem[] = feed.items
				.filter((item) => item.title && item.link)
				.map((item) => ({
					title: item.title as string,
					link: item.link as string
				}));

			return {
				title: feed.title || "Unknown Title",
				items: items
			};
		});

		res.status(200).json(feedResults);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "An error occurred while fetching and saving RSS feeds"
		});
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
