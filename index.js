import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";
import path from "path";  // Add path import
import { fileURLToPath } from 'url';  // Necessary to work with __dirname in ES6 module format
import env from "dotenv";

// Setup __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
env.config();
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let books=[];
async function insertbook(){
   // Simulated query result, in real case this would be from your database
   const result = await db.query("SELECT * from books"); 
   return result.rows; 
}
app.get("/", async (req, res) => {


    res.sendFile(path.join(__dirname,'public', 'views', 'index.html'));
    
    
});
// New route to send book data to the frontend
app.get("/books", async (req, res) => {
    try {
        books = await insertbook(); // Fetch books from the database

        // Iterate over each book to fetch and store the cover URL
        for (let i = 0; i < books.length; i++) {
            const book = books[i];
            const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;

            // Store the cover URL in the book array
            books[i].coverUrl = coverUrl;
        }

        // Sort the books array by rating in descending order (10 to 1)
        books.sort((a, b) => b.rating - a.rating);

        res.json(books); // Send the updated books array as a JSON response
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




app.post("/add", async (req, res) => {
    const title = req.body.title;
    const isbn = req.body.isbn;
    const rating = req.body.rating;
    const desc = req.body.desc;
    const link = req.body.link;
    const linktitle = req.body.linktitle;
    try {
        const result=await db.query("INSERT into books (title,isbn,rating,description,link,link_title) VALUES ($1,$2,$3,$4,$5,$6)RETURNING *",
            [title, isbn, rating, desc, link || null, linktitle || null]
        );
       // Check if the insertion was successful
        // Check if the insertion was successful
        if (result.rows.length > 0) {
            const response = {
                message: 'Book added successfully',
                book: result.rows[0]
            };
            console.log(response);
            res.redirect("/");

        } else {
            throw new Error("No rows were returned after insertion.");
        }

    
       
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Internal server error' });
        
    }
    
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});