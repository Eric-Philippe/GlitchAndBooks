import { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { Books } from "../../../entities/Books";

export default async function deleteBook(req: Request, res: Response) {
  const { bookId } = req.query as { bookId: string };

  try {
    const repoBook = AppDataSource.getRepository(Books);

    // Attempt to find the book by its ID
    const book = await repoBook.findOne({
      relations: ["genres", "authors"], // Include related records
      where: { bookid: parseInt(bookId) },
    });

    if (!book) {
      // If the book is not found, return a 404 status
      res.status(404).json({ message: "Book not found" });
      return;
    }

    // Remove the associations in the join tables
    book.genres = [];
    book.authors = [];

    // Delete the book
    await repoBook.remove(book);

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error deleting the book" });
  }
}
