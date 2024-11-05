// routes/bookRoutes.ts

import { Router } from 'express';
import { BookController } from '../controllers/bookController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();
const bookController = new BookController();

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.post('/', authMiddleware, bookController.addBook);
router.put('/:id', authMiddleware, bookController.updateBookById);
router.delete('/:id', authMiddleware, bookController.deleteBookById);

export default router;
