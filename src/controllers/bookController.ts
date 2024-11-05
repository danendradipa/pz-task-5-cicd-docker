import { Request, Response } from 'express';
import { BookService } from '../service/bookService';

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  addBook = async (req: Request, res: Response): Promise<void> => {
    const { title, author, year, bookCode } = req.body; 

    try {
      const newBook = await this.bookService.addBook({ title, author, year, bookCode }); 
      res.status(201).json({ success: true, message: 'Book added successfully', book: newBook });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Failed to add book' });
    }
  };

  getBooks = async (_: Request, res: Response): Promise<void> => {
    try {
      const books = await this.bookService.getBooks();
      res.status(200).json({ success: true, data: books });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Failed to retrieve books' });
    }
  };

  getBookById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ success: false, message: 'ID is required' });
      return;
    }

    try {
      const book = await this.bookService.getBookById(id);
      if (!book) {
        res.status(404).json({ success: false, message: 'Book not found' });
        return;
      }
      res.status(200).json({ success: true, data: book });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Failed to retrieve book' });
    }
  };

  updateBookById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const { bookCode } = req.body; 

    if (!id) {
      res.status(400).json({ success: false, message: 'ID is required' });
      return;
    }

    try {
      if (bookCode) {
        const duplicateBook = await this.bookService.getBookByBookCode(bookCode, id);
        if (duplicateBook) {
          res.status(409).json({ success: false, message: 'Book code already exists' });
          return;
        }
      }

      const updatedBook = await this.bookService.updateBookById(id, req.body);
      if (!updatedBook) {
        res.status(404).json({ success: false, message: 'Book not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Book updated successfully', data: updatedBook });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Failed to update book' });
    }
  };

  deleteBookById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ success: false, message: 'ID is required' });
      return;
    }

    try {
      const deletedBook = await this.bookService.deleteBookById(id);
      if (!deletedBook) {
        res.status(404).json({ success: false, message: 'Book not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Failed to delete book' });
    }
  };
}
