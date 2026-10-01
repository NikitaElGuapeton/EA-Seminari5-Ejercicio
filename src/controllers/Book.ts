import { Request, Response } from 'express';
import BookService from '../services/BookService';

const createBook = async (req: Request, res: Response) => {
    try {
        const book = await BookService.createBook(req.body);
        res.status(201).json({ book });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const readBook = async (req: Request<{ bookId: string }>, res: Response) => {
    const bookId = req.params.bookId;

    try {
        const book = await BookService.getBookById(bookId);

        if (book) {
            res.status(200).json({ book });
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

const readAll = async (req: Request, res: Response) => {
    try {
        const books = await BookService.getAllBooks();
        res.status(200).json({ books });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const updateBook = async (req: Request<{ bookId: string }>, res: Response) => {
    const bookId = req.params.bookId;

    try {
        const book = await BookService.updateBook(bookId, req.body);

        if (book) {
            res.status(200).json({ book });
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

const addTag = async (req: Request<{ bookId: string }>, res: Response) => {
    const bookId = req.params.bookId;

    try {
        const book = await BookService.addTag(bookId, req.body.tag);

        if (book) {
            res.status(200).json({ book });
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

const replaceTags = async (req: Request<{ bookId: string }>, res: Response) => {
    const bookId = req.params.bookId;

    try {
        const book = await BookService.replaceTags(bookId, req.body.tags);

        if (book) {
            res.status(200).json({ book });
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

const removeTag = async (req: Request<{ bookId: string; tag: string }>, res: Response) => {
    const { bookId, tag } = req.params;

    try {
        const book = await BookService.removeTag(bookId, tag);

        if (book) {
            res.status(200).json({ book });
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

const deleteBook = async (req: Request<{ bookId: string }>, res: Response) => {
    const bookId = req.params.bookId;

    try {
        const book = await BookService.deleteBook(bookId);

        if (book) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

export default { createBook, readBook, readAll, updateBook, addTag, replaceTags, removeTag, deleteBook };
