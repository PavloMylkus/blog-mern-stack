import { body } from 'express-validator';

export const registerValidator = [
	body('email', 'Неправильний формат пошти').isEmail(),
	body('password', 'Пароль має бути мінімум 5 символів').isLength({ min: 5 }),
	body('fullName', 'Вкажіть ім\'я').isLength({ min: 3 }),
	body('avatarUrl', 'Невірне посилання').optional().isURL(),
]