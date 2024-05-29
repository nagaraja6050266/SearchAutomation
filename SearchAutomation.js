const puppeteer = require("puppeteer");
const { MongoClient } = require("mongodb");
const reader = require("xlsx");

const file = reader.readFile("./test.xlsx");
let data = [];
const sheets = file.SheetNames;

for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach((res) => {
        data.push(res);
    });
}

//SearchAutomation
async function main() {
    const uri =
        "mongodb+srv://itzinr:Inr6050266@cluster.luvtjrd.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const database = client.db("FirstDB");
        const collection = database.collection("FirstCollection");
        const browser = await puppeteer.launch({
            executablePath:
                "C:\\Users\\Nagaraja\\.cache\\puppeteer\\chrome\\win64-121.0.6167.85\\chrome-win64\\chrome.exe",
            headless: false,
        });
        for (d of data) {
            let keyword = d.Keyword;
            let page = await browser.newPage();
            await page.goto("https://www.google.com", {
                waitUntil: "domcontentloaded",
            });
            await page.waitForSelector('textarea[name="q"]');
            await page.type('textarea[name="q"]', keyword);
            await page.keyboard.press("Enter");
            await page.waitForNavigation();
            await collection.insertOne({ keyword });
            console.log("Keyword stored in MongoDB");
        }
        console.log("Browser and MongoDB connection closed");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
    }
}

main();
