"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const emailValidation_1 = require("./emailValidation");
describe('Email Tests', () => {
    test('Fetch and validate emails for Login', () => __awaiter(void 0, void 0, void 0, function* () {
        const isValid = yield (0, emailValidation_1.getEmailsForToday)('Login');
        // Add your assertions based on the value of isValid
        expect(isValid).toBe(true);
    }));
    test('Email Notification - Welcome', () => __awaiter(void 0, void 0, void 0, function* () {
        const isValid = yield (0, emailValidation_1.getEmailsForToday)('invited');
        // Add your assertions based on the value of isValid
        expect(isValid).toBe(true);
    }));
    test('Email Notification - Verify account	', () => __awaiter(void 0, void 0, void 0, function* () {
        const isValid = yield (0, emailValidation_1.getEmailsForToday)('Verify your email');
        // Add your assertions based on the value of isValid
        expect(isValid).toBe(true);
    }));
    test('Email Notification - Reset your password	', () => __awaiter(void 0, void 0, void 0, function* () {
        const isValid = yield (0, emailValidation_1.getEmailsForToday)('Reset your password');
        // Add your assertions based on the value of isValid
        expect(isValid).toBe(true);
    }));
});
