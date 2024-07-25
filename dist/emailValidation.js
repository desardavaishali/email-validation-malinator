"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailsForToday = getEmailsForToday;
exports.getEmailContent = getEmailContent;
exports.verifyTextInBody = verifyTextInBody;
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
//Get this data from your mailinator account settings
const apiKey = '0c93b46ddb4d45ddb85505d70c3a9e50';
const inboxName = 'test1'; // replace with your actual inbox name
const domains = 'team718720.testinator.com';
// Load test data from file
const testDataFilePath = path.resolve(__dirname, 'testData.json');
const testData = JSON.parse(fs.readFileSync(testDataFilePath, 'utf-8'));
function getEmailsForToday(matchingSubject) {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date().toISOString().split('T')[0];
        // const response = await axios.get(`https://api.mailinator.com/api/v2/domains/${domains}/inboxes/${inboxName}?token=${apiKey}`);
        try {
            const response = yield axios_1.default.get(`https://api.mailinator.com/api/v2/domains/${domains}/inboxes/${inboxName}?token=${apiKey}`);
            const emails = response.data.msgs;
            const todayEmails = emails.filter((email) => {
                if (email.time && typeof email.time === 'number') {
                    const emailDate = new Date(email.time);
                    const emailDateString = emailDate.toISOString().split('T')[0];
                    return emailDateString === today && email.subject.includes(matchingSubject);
                }
                return false;
            });
            //Search in all emails received today
            for (const email of todayEmails) {
                const emailId = email.id;
                const subject = email.subject;
                const emailContent = yield getEmailContent(emailId);
                //console.log('emailcontent' + emailContent)
                const emailElements = yield extractEmailElements(matchingSubject, emailContent);
                //   console.log('Emailelements' + emailElements )
                const isValid = validateEmailElements(matchingSubject, emailElements, emailContent, subject);
                //console.log(isValid)
                if (yield isValid) {
                    console.log('Validation Passed including key values data.');
                    return true;
                }
                else {
                    console.log('Validation Failed');
                    return false;
                }
            }
        }
        catch (err) {
            if (err instanceof Error) {
                console.error('Error fetching emails:', err.message);
            }
            else {
                console.error('Unexpected error:', err);
            }
            return false;
        }
    });
}
function getEmailContent(emailId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://api.mailinator.com/api/v2/domains/${domains}/inboxes/${inboxName}/messages/${emailId}/?token=${apiKey}`);
            return response.data.parts[0].body;
        }
        catch (err) {
            if (err instanceof Error) {
                console.error('Error fetching email content:', err.message);
            }
            else {
                console.error('Unexpected error:', err);
            }
            return '';
        }
    });
}
function extractEmailElements(subject, emailContent) {
    const keysMapping = {
        Login: ['IP:', 'Email:'],
        // Add more subjects and their corresponding keys as needed. Keys = Field you want to match data with
    };
    const keys = keysMapping[subject] || [];
    const extractedValues = {};
    keys.forEach(key => {
        extractedValues[key] = extractValueFromContent(emailContent, key);
        // console.log(extractedValues[key] + 'extractedvalues')
    });
    //console.log(extractedValues)
    return extractedValues;
}
function validateEmailElements(subject, emailElements, emailContent, actualsubject) {
    return __awaiter(this, void 0, void 0, function* () {
        // Implement your validation logic here based on the unique subject
        let isValidationPassed = false;
        let isUserNameValid;
        let isSubjectValid;
        let expectedSubject;
        let isTextValid, expectedText;
        switch (subject) {
            case 'Login':
                expectedSubject = `Login detected for ${testData.loginUserName}`;
                isUserNameValid = verifyUserName(emailContent, testData.loginUserName);
                isSubjectValid = verifySubject(actualsubject, expectedSubject);
                isValidationPassed = isUserNameValid && isSubjectValid && emailElements['IP:'] !== '' && emailElements['Email:'] !== '';
                return isValidationPassed;
            case 'Verify your email':
                expectedText = `We're excited to have you get started. First, you need to confirm youraccount. Just press the button below.`;
                expectedSubject = `Verify your email`;
                isSubjectValid = verifySubject(actualsubject, expectedSubject);
                isTextValid = yield verifyTextInBody(emailContent, expectedText);
                isValidationPassed = isSubjectValid && isTextValid;
                return isValidationPassed;
            case 'Reset your password':
                expectedText = `We received a request to change your password.`;
                expectedSubject = `Reset your password`;
                isSubjectValid = verifySubject(actualsubject, expectedSubject);
                isTextValid = yield verifyTextInBody(emailContent, expectedText);
                isValidationPassed = isSubjectValid; //&& isTextValid ;
                return isValidationPassed;
            // Add more cases for other subjects as needed
            default:
                // Default case, no validation required
                return true;
        }
    });
}
function verifyUserName(emailContent, expectedUsername) {
    // Remove HTML tags and newlines
    // Every email has different format - accomodate as much possible
    const bodyWithoutHtml = emailContent
        .replace(/<[^>]+>/g, "") // Remove HTML tags
        .replace(/\r?\n/g, " ") // Remove newlines
        .replace(/\*/g, "");
    const greetingRegex = /\b(?:Hi|Hey)\s*(.*?)(,|$|[\r\n])/m;
    const match = bodyWithoutHtml.match(greetingRegex);
    if (!match) {
        throw new Error("Username not found in the email content.");
    }
    // Extract username from the first word or email address
    const extractedUsername = match[1].split(/[,\s]/)[0];
    // If the extracted username ends with a comma, remove it
    const cleanedExtractedUsername = extractedUsername.replace(/,+$/, '');
    if (cleanedExtractedUsername !== expectedUsername) {
        throw new Error(`Invalid username. Expected: ${expectedUsername}, Actual: ${cleanedExtractedUsername}`);
    }
    console.log("Username is valid:", cleanedExtractedUsername);
    return true;
}
function verifySubject(actualsubject, expectedSubject) {
    // console.log(actualsubject, expectedSubject)
    if (actualsubject === expectedSubject) {
        console.log('Subject is valid:' + actualsubject);
        return true;
    }
    if (actualsubject.includes(expectedSubject)) {
        console.log('Subject is valid:' + actualsubject);
        return true;
    }
    console.log(`Invalid Subject. Expected: ${expectedSubject}, Actual: ${actualsubject}`);
    return false;
}
function extractValueFromContent(emailContent, key) {
    const lines = emailContent.split('\n');
    for (const line of lines) {
        if (line.toLowerCase().includes(key.toLowerCase())) {
            const [, value] = line.split(':');
            if (value) {
                const extractedValue = value.trim();
                console.log(`Key: ${key} Extracted Value: ${extractedValue}`);
                //   console.log(`Extracted Value: ${extractedValue}`);
                return extractedValue;
            }
        }
    }
    console.log(`Key: ${key}`);
    console.log('No Match Found');
    return '';
}
function verifyTextInBody(emailContent, expectedText) {
    return __awaiter(this, void 0, void 0, function* () {
        // Remove HTML tags and newlines for cleaner comparison
        const bodyWithoutHtml = emailContent
            .replace(/<[^>]+>/g, "") // Remove HTML tags
            .replace(/\r?\n/g, "") // Remove newlines
            .replace(/\*/g, "");
        //console.log('Expected Text: '  +expectedText)
        // console.log('Body without html: ' + bodyWithoutHtml)
        // Perform case-sensitive comparison
        const isTextPresent = bodyWithoutHtml.includes(expectedText);
        if (isTextPresent) {
            console.log("Expected Text found in the Email body.");
            return true;
        }
        else {
            console.log("Expected Text not found in the body.");
            return false;
        }
        // return isTextPresent;
    });
}
