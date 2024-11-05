// import mongoose from 'mongoose';
import { Book } from '../models/Book';
import { IBook } from '../types/book'; // Masih diimpor di sini untuk digunakan di fungsi
import mongoose from 'mongoose';


export class BookService {
  async addBook(bookData: IBook) { 
    try {
      const existingBook = await Book.findOne({ bookCode: bookData.bookCode });
      if (existingBook) {
        throw new Error('Book with this code already exists');
      }
      const book = new Book(bookData);
      const savedBook = await book.save();
      return savedBook;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  }

  async getBooks() {
    try {
      const books = await Book.find();
      return books;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  async getBookById(id: string) {
    try {
      const book = await Book.findById(id);
      return book;
    } catch (error) {
      console.error('Error fetching book by ID:', error);
      throw error;
    }
  }

  async updateBookById(id: string, bookData: Partial<IBook>) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
      const updatedBook = await Book.findByIdAndUpdate(id, bookData, { new: true });
      return updatedBook;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  }

  async deleteBookById(id: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
      const deletedBook = await Book.findByIdAndDelete(id);
      return deletedBook;
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }  

  async getBookByBookCode(bookCode: string, excludeId?: string) {
    try {
      const query: any = { bookCode };
      if (excludeId) {
        query._id = { $ne: excludeId };
      }
      const book = await Book.findOne(query);
      return book;
    } catch (error) {
      console.error('Error fetching book by book code:', error);
      throw error;
    }
  }
}
