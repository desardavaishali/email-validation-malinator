
import { getEmailsForToday } from './emailValidation'

//Testing based on Email Subject

describe('Email Tests', () => {		  
  
  test('Fetch and validate emails for Login', async () => {
     
      const isValid = await getEmailsForToday('Login');
      // Add your assertions based on the value of isValid
      expect(isValid).toBe(true); 
    });


  test('Email Validation - Verify Email	', async () => {
     
    const isValid = await getEmailsForToday('Verify your email');
    // Add your assertions based on the value of isValid
    expect(isValid).toBe(true);       
    
  })
  
  test('Email Validation - Reset your password	', async () => {
     
    const isValid = await getEmailsForToday('Reset your password');
    // Add your assertions based on the value of isValid
    expect(isValid).toBe(true); 
      
    
  })

 

});