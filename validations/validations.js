import { body } from 'express-validator';

export const registerValidator = [
	body('email', 'Неправильний формат пошти').isEmail(),
	body('password', 'Пароль має бути мінімум 5 символів').isLength({ min: 5 }),
	body('fullName', 'Вкажіть ім\'я').isLength({ min: 3 }),
	body('avatarUrl', 'Невірне посилання').optional().isURL(),
]
export const loginValidator = [
	body('email', 'Неправильний формат пошти').isEmail(),
	body('password', 'Пароль має бути мінімум 5 символів').isLength({ min: 5 }),
]

export const postCreateValidator = [
	body('title', 'Введіть заголовок статті').isLength({ min: 5 }).isString(),
	body('text', 'введіть текс статті').isLength({ min: 5 }).isString(),
	body('tags', 'Невірний формат тегів (укажіть масив)').optional().isArray(),
	body('imageUrl', 'Невірне посилання').optional().isString(),
	body('price', 'Невірний формат').isNumeric(),
]