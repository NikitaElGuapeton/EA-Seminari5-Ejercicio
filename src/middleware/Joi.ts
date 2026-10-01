import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { IAuthor } from '../models/Author';
import { BOOK_LANGUAGES, BOOK_TAGS, IBook } from '../models/Book';
import Logging from '../library/Logging';

export const ValidateJoi = (schema: ObjectSchema, paramName?: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const value = paramName ? { [paramName]: req.params[paramName] } : req.body;
            await schema.validateAsync(value);

            next();
        } catch (error) {
            Logging.error(error);

            return res.status(422).json({ error });
        }
    };
};

// Un id de MongoDB son 24 caracteres hexadecimales
const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

// Guarda del id de la URL: si no tiene forma de id de MongoDB, responde 400
export const ValidateId = (paramName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const id = req.params[paramName];

        if (typeof id !== 'string' || !OBJECT_ID.test(id)) {
            return res.status(400).json({ message: `${paramName} no es un id válido` });
        }

        next();
    };
};

export const Schemas = {
    author: {
        create: Joi.object<IAuthor>({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
            birthDate: Joi.date(),
            nationality: Joi.string(),
            biography: Joi.string().max(1000),
            website: Joi.string().uri(),
            photoUrl: Joi.string().uri(),
            active: Joi.boolean(),
            role: Joi.string().valid('author', 'admin')
        }),
        update: Joi.object<IAuthor>({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
            birthDate: Joi.date(),
            nationality: Joi.string(),
            biography: Joi.string().max(1000),
            website: Joi.string().uri(),
            photoUrl: Joi.string().uri(),
            active: Joi.boolean(),
            role: Joi.string().valid('author', 'admin')
        })
    },
    book: {
        addTag: Joi.object({
            tag: Joi.string().valid(...BOOK_TAGS).required()
        }),
        deleteTag: Joi.object({
            tag: Joi.string().valid(...BOOK_TAGS).required()
        }),
        replaceTags: Joi.object({
            tags: Joi.array().items(Joi.string().valid(...BOOK_TAGS)).required()
        }),
        create: Joi.object<IBook>({
            title: Joi.string().required(),
            authors: Joi.array()
                .items(Joi.string().regex(OBJECT_ID))
                .min(1)
                .required(),
            isbn: Joi.string().required(),
            edition: Joi.number().min(1),
            publisher: Joi.string(),
            publishedYear: Joi.number().min(1450).max(2100),
            pages: Joi.number().min(1),
            language: Joi.string().valid(...BOOK_LANGUAGES),
            tags: Joi.array().items(Joi.string().valid(...BOOK_TAGS)),
            price: Joi.number().min(0)
        }),
        update: Joi.object<IBook>({
            title: Joi.string().required(),
            authors: Joi.array()
                .items(Joi.string().regex(OBJECT_ID))
                .min(1)
                .required(),
            isbn: Joi.string().required(),
            edition: Joi.number().min(1),
            publisher: Joi.string(),
            publishedYear: Joi.number().min(1450).max(2100),
            pages: Joi.number().min(1),
            language: Joi.string().valid(...BOOK_LANGUAGES),
            tags: Joi.array().items(Joi.string().valid(...BOOK_TAGS)),
            price: Joi.number().min(0)
        })
    }
};
