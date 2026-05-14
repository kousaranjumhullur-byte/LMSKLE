import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: "Available" | "Reserved" | "On Loan";
  year: number;
  imageUrl?: string;
}

let books: Book[] = [
  { id: "1", title: "Effective TypeScript", author: "Dan Vanderkam", isbn: "978-1492053743", category: "Technical", status: "Available", year: 2019, imageUrl: "/src/assets/images/regenerated_image_1778583633706.webp" },
  { id: "2", title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", category: "Technical", status: "On Loan", year: 2008, imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600" },
  { id: "3", title: "The Phoenix Project", author: "Gene Kim", isbn: "978-0988262591", category: "Business", status: "Available", year: 2013, imageUrl: "/src/assets/images/regenerated_image_1778583635451.jpg" },
  { id: "4", title: "Race to Win", author: "Lewis Hamilton", isbn: "978-0007270390", category: "Sports", status: "Reserved", year: 2007, imageUrl: "/src/assets/images/regenerated_image_1778583634613.jpg" },
  { id: "5", title: "The Art of War", author: "Sun Tzu", isbn: "978-0140447330", category: "Philosophy", status: "Available", year: 2002, imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600" },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/books", (req, res) => {
    res.json(books);
  });

  app.post("/api/books", (req, res) => {
    const newBook = { ...req.body, id: Date.now().toString() };
    books.push(newBook);
    res.status(201).json(newBook);
  });

  app.put("/api/books/:id", (req, res) => {
    const { id } = req.params;
    const index = books.findIndex(b => b.id === id);
    if (index !== -1) {
      books[index] = { ...books[index], ...req.body };
      res.json(books[index]);
    } else {
      res.status(404).send("Book not found");
    }
  });

  app.delete("/api/books/:id", (req, res) => {
    const { id } = req.params;
    books = books.filter(b => b.id !== id);
    res.status(204).send();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
