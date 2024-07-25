import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';


//Get this data from your mailinator account settings

const apiKey = '';// replace with your api key
const inboxName = 'test'; // replace with your actual inbox name
const domains = '' //// replace with your domain - can be found in settings

// Load test data from file
const testDataFilePath = path.resolve(__dirname, 'testData.json');
const testData = JSON.parse(fs.readFileSync(testDataFilePath, 'utf-8'));

 
interface EmailElement {
  [key: string]: string;
}


export async function getEmailsForToday(matchingSubject: string) {
  const today = new Date().toISOString().split('T')[0];

  try {
    const response = await axios.get(`https://api.mailinator.com/api/v2/domains/${domains}/inboxes/${inboxName}?token=${apiKey}`);
  
    const emails = response.data.msgs;
  
    const todayEmails = emails.filter((email: any) => {
      if (email.time && typeof email.time === 'number') {
        const emailDate = new Date(email.time);
        const emailDateString = emailDate.toISOString().split('T')[0];
        return emailDateString === today && email.subject.includes(matchingSubject);
      }
      return false;
    });

//Search in all emails received today based on Subject
    for (const email of todayEmails) {
      const emailId = email.id;
      const subject = email.subject;
      const emailContent = await getEmailContent(emailId);
      //console.log('emailcontent' + emailContent) - debug in case if failure

      const emailElements = await extractEmailElements(matchingSubject, emailContent);
   //   console.log('Emailelements' + emailElements ) - debug in case if failure
      
    
      const isValid = validateEmailElements(matchingSubject,emailElements,emailContent,subject);
      //console.log(isValid)

      if (await isValid) {
        console.log('Validation Passed including key values data.');
        return true;
      } else {
        console.log('Validation Failed');
        return false;
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error fetching emails:', err.message);
    } else {
      console.error('Unexpected error:', err);
    }
    return false;
  }

}


export async function getEmailContent(emailId: string) {
  try {
    const response = await axios.get(`https://api.mailinator.com/api/v2/domains/${domains}/inboxes/${inboxName}/messages/${emailId}/?token=${apiKey}`);
    return response.data.parts[0].body;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error fetching email content:', err.message);
    } else {
      console.error('Unexpected error:', err);
    }
    return '';
  }
} 


function extractEmailElements(subject: string, emailContent: string): EmailElement {
  const keysMapping: Record<string, string[]> = {
     Login: ['IP:', 'Email:'],
  

    
    // Add more subjects and their corresponding keys as needed. Keys = Field you want to match data with e.g. Email, IP here in above example
  };

  const keys = keysMapping[subject] || [];

  const extractedValues: Record<string, string> = {};

  keys.forEach(key => {
 
    extractedValues[key] = extractValueFromContent(emailContent, key);
   // console.log(extractedValues[key] + 'extractedvalues') - debug in case if failure
  });

  //console.log(extractedValues)
  return extractedValues;
} 

 async function  validateEmailElements(subject: string, emailElements: EmailElement,emailContent:string, actualsubject:string): Promise<boolean> {
  // Implement your validation logic here based on the unique subject

   
  let isValidationPassed: boolean = false;
  let isUserNameValid
  let isSubjectValid
  let expectedSubject
  let isTextValid, expectedText


  switch (subject) {
    
    case 'Login':
       expectedSubject =  `Login detected for ${testData.loginUserName}`
      isUserNameValid = verifyUserName(emailContent, testData.loginUserName);
      isSubjectValid = verifySubject(actualsubject, expectedSubject);
      
      isValidationPassed = isUserNameValid && isSubjectValid && emailElements['IP:'] !== '' && emailElements['Email:'] !== '';

    return isValidationPassed;

        

     case 'Verify your email':
      expectedText =`We need to confirm your account. Press the button below.`
      expectedSubject = `Verify your email`
      isSubjectValid = verifySubject(actualsubject, expectedSubject);
      isTextValid =  await verifyTextInBody(emailContent, expectedText)
      
      isValidationPassed = isSubjectValid && isTextValid;
 
      return isValidationPassed;

 

      case 'Reset your password':
       expectedText = `We received a request to change your password.`
       expectedSubject = `Reset your password`
       isSubjectValid = verifySubject(actualsubject, expectedSubject);
       isTextValid =  await verifyTextInBody(emailContent, expectedText)

       isValidationPassed =   isSubjectValid && isTextValid ;

       return isValidationPassed;

    // Add more cases for other subjects as needed

    default:
      // Default case, no validation required
      return true;
  }
  
}  


function verifyUserName(emailContent: string, expectedUsername: string): boolean {
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



function verifySubject(actualsubject:string, expectedSubject:string): boolean {

 // console.log(actualsubject, expectedSubject)

  if (actualsubject === expectedSubject) {
    console.log('Subject is valid:' +actualsubject )
    return true;
  }

  if (actualsubject.includes(expectedSubject)) {
    console.log('Subject is valid:' +actualsubject)
    return true;
  }

 console.log(`Invalid Subject. Expected: ${expectedSubject}, Actual: ${actualsubject}`);
  return false;
  
 }

 
function extractValueFromContent(emailContent: string, key: string): string {
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


export async function verifyTextInBody(emailContent: string, expectedText: string): Promise<boolean> {
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
    
  } else {
    console.log("Expected Text not found in the body.");
    return false
  }
 // return isTextPresent;

 
}





