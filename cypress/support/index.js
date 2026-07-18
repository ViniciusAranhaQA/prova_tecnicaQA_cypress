import UserService from '../api/services/userService';
import UserFactory from './userFactory';
import UserValidator from '../api/validators/userValidator';

Cypress.UserService = UserService;
Cypress.UserFactory = UserFactory;
Cypress.UserValidator = UserValidator;
