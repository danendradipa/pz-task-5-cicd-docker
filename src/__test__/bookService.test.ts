import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { BookService } from '../service/bookService';
import { Book } from '../models/Book';
import { IBook } from '../types/book';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.disconnect(); // Disconnect existing connection
  await mongoose.connect(mongoUri); // Connect to MongoMemoryServer
});

afterAll(async () => {
  await mongoose.disconnect(); // Disconnect after all tests
  if (mongoServer) {
    await mongoServer.stop(); // Stop the MongoMemoryServer
  }
});

describe('BookService', () => {
  let bookService: BookService;

  const mockBook: IBook = {
    title: 'Book Test',
    author: 'Author Test',
    year: 2024,
    bookCode: '9999999999'
  };

  beforeEach(async () => {
    await Book.deleteMany({});
    bookService = new BookService();
  });

  describe('addBook', () => {
    it('must successfully create a new book', async () => {
      const result = await bookService.addBook(mockBook);

      expect(result).toBeDefined();
      expect(result.title).toBe(mockBook.title);
      expect(result.author).toBe(mockBook.author);
      expect(result.year).toBe(mockBook.year);
      expect(result.bookCode).toBe(mockBook.bookCode);
    });

    it('must raise an error for a duplicate bookCode', async () => {
      await bookService.addBook(mockBook);
      await expect(bookService.addBook(mockBook)).rejects.toThrow();
    });
  });

  describe('getBooks', () => {
    it('must return an empty array when no books are present', async () => {
      const books = await bookService.getBooks();
      expect(books).toEqual([]);
    });

    it('must retrieve all books', async () => {
      await bookService.addBook(mockBook);
      await bookService.addBook({
        ...mockBook,
        bookCode: '7777777777',
        title: 'Another Book'
      });

      const books = await bookService.getBooks();
      expect(books).toHaveLength(2);
    });
  });

  describe('getBookById', () => {
    it('must return a book by its id', async () => {
      const created = await bookService.addBook(mockBook);
      const found = await bookService.getBookById(created._id.toString());

      expect(found).toBeDefined();
      expect(found?.title).toBe(mockBook.title);
    });

    it('must return null for a non-existent id', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const book = await bookService.getBookById(fakeId);
      expect(book).toBeNull();
    });

    it('must raise an error for an invalid id format', async () => {
      await expect(bookService.getBookById('invalid-id')).rejects.toThrow();
    });
  });

  describe('updateBookById', () => {
    it('must successfully update a book', async () => {
      const created = await bookService.addBook(mockBook);
      const updateData = { title: 'Updated Title' };

      const updated = await bookService.updateBookById(created._id.toString(), updateData);
      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Updated Title');
    });

    it('must return null when attempting to update a non-existent book', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const result = await bookService.updateBookById(fakeId, { title: 'New Title' });
      expect(result).toBeNull();
    });

    it('must raise an error for an invalid id format', async () => {
      await expect(bookService.updateBookById('invalid-id', { title: 'New Title' }))
        .rejects.toThrow('Invalid ID format');
    });
  });

  describe('deleteBookById', () => {
    it('must successfully delete a book', async () => {
      const created = await bookService.addBook(mockBook);
      const result = await bookService.deleteBookById(created._id.toString());

      expect(result).toBeDefined();
      const found = await bookService.getBookById(created._id.toString());
      expect(found).toBeNull();
    });

    it('must return null when trying to delete a non-existent book', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const result = await bookService.deleteBookById(fakeId);
      expect(result).toBeNull();
    });

    it('must raise an error for an invalid id format', async () => {
      await expect(bookService.deleteBookById('invalid-id'))
        .rejects.toThrow('Invalid ID format');
    });
  });

  describe('getBookByBookCode', () => {
    it('must successfully find a book using its bookCode', async () => {
      await bookService.addBook(mockBook);
      const found = await bookService.getBookByBookCode(mockBook.bookCode);

      expect(found).toBeDefined();
      expect(found?.bookCode).toBe(mockBook.bookCode);
    });

    it('must return null for a non-existent bookCode', async () => {
      const book = await bookService.getBookByBookCode('123');
      expect(book).toBeNull();
    });
  });
});
