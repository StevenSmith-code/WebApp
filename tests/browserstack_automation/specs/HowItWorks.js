import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import TopNavigation from '../page_objects/topnavigation';
import HowItWorks from '../page_objects/howitworks';
const testData = require('../capabilities/testData.js');
const waitTime = 5000;

describe('HowItWorks', () => {
  // HowItWorks_001
  it('verifyNextButton', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await ReadyPage.clickHowItWorksLink();
    await driver.pause(waitTime);
    for (let i = 1; i < 6; i++) {
      const expectedResult = await HowItWorks.checkTitleOfHowItWorksWindow(i);
      await expect(HowItWorks.howItWorksTitle).toHaveText(expectedResult);
      if (i!= 5) {
        const nextButton = await HowItWorks.findNextButtonHowItWorksWindow;
        await HowItWorks.clickButton(nextButton)
      }
    }
    console.log("Next Button and titles of the page verified successfully")
  });
  // HowItWorks_002
  it('verifyBackButton', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await ReadyPage.clickHowItWorksLink();
    await driver.pause(waitTime);
    await HowItWorks.clickNextButtonFourTimes();
    await HowItWorks.clickBackButtonFourTimes()
    const expectedResult = await HowItWorks.checkTitleOfHowItWorksWindow(1);
    await expect(HowItWorks.howItWorksTitle).toHaveText(expectedResult);
    console.log("Back button clicked successfully and user is on first page")
  });
  // HowItWorks_003
  it('verifyGetStartedButton', async () => {
    await ReadyPage.load();
    await ReadyPage.clickHowItWorksLink();
    await driver.pause(waitTime);
    await HowItWorks.clickNextButtonFourTimes();
    const getStarted = await HowItWorks.getStartedButton;
    await HowItWorks.clickButton(getStarted)
    await driver.pause(waitTime);
    await expect(HowItWorks.getTitleSignUpPopUp).toHaveText('Sign In or Join');
    console.log("GetStarted Button Clicked Successfully, user on the signIn page")
  });
  // HowItWorks_004
  it('verifyCancelSigninwithEmail', async () => {
    await ReadyPage.load();
    await ReadyPage.clickHowItWorksLink();
    await driver.pause(waitTime);
    await HowItWorks.clickNextButtonFourTimes();
    const getStarted = await HowItWorks.getStartedButton;
    await HowItWorks.clickButton(getStarted)
    const emailTextBox = await HowItWorks.enterVoterEmailAddressTextBox;
    await emailTextBox.addValue(testData.EMAIL_NEGATIVE_SCENARIO);
    const cancelButton = await HowItWorks.cancelEmailButton;
    await HowItWorks.clickButton(cancelButton)
    console.log("Email SignIn was Cancelled")
    await expect(HowItWorks.getTitleSignUpPopUp).toHaveText('Sign In or Join');
  });
  // HowItWorks_005
  it('verifyCancelSigninWithMobile', async () => {
    await ReadyPage.load();
    await ReadyPage.clickHowItWorksLink();
    await driver.pause(waitTime);
    await HowItWorks.clickNextButtonFourTimes();
    const getStarted = await HowItWorks.getStartedButton;
    await HowItWorks.clickButton(getStarted)
    const mobilePhoneNumber = await HowItWorks.enterMobilePhoneNumber;
    await mobilePhoneNumber.addValue(testData.MOBILE_NUMBER);
    const cancelButton = await HowItWorks.cancelMobilePhoneNumberButton;
    await HowItWorks.clickButton(cancelButton)
    await expect(HowItWorks.getTitleSignUpPopUp).toHaveText('Sign In or Join');
    console.log("Mobile SignIn was Cancelled")
  });
  // HowItWorks_006
  it('verifyCancelSigninWithApple', async () => {
    await ReadyPage.load();
    await ReadyPage.clickHowItWorksLink();
    await driver.pause(waitTime);
    await HowItWorks.clickNextButtonFourTimes();
    const getStarted = await HowItWorks.getStartedButton;
    await HowItWorks.clickButton(getStarted)
    const signinWithAppleID = await HowItWorks.enterSignInWithApple;
    await HowItWorks.clickButton(signinWithAppleID)
    await driver.back() //This line won't work in Safari. Needs to be addressed after WV-557 issue is fixed
    await expect(HowItWorks.getTitleSignUpPopUp).toHaveText('Sign In or Join');
    console.log("AppleID  SignIn was Cancelled")
  });
  // HowItWorks_007
  it('verifyCancelSigninWithTwitter', async () => {
    await ReadyPage.load();
    await ReadyPage.clickHowItWorksLink();
    await driver.pause(waitTime);
    await HowItWorks.clickNextButtonFourTimes();
    const getStarted = await HowItWorks.getStartedButton;
    await HowItWorks.clickButton(getStarted)
    const signinWithTwitter = await HowItWorks.enterSignInWithTwitter;
    await HowItWorks.clickButton(signinWithTwitter)
    const cancelButton = await HowItWorks.cancelTwitterSignin;
    await HowItWorks.clickButton(cancelButton)
    const gotoHomePage = await HowItWorks.gotoWeVoteBallotGuide;
    await HowItWorks.clickButton(gotoHomePage)
    await driver.pause(waitTime);
    await expect(driver).toHaveUrl(expect.stringContaining('quality'));
    console.log("Twitter  SignIn was Cancelled")
  });
   // HowItWorks_008
  it('verifySigninUsingMobile', async () => {
    await ReadyPage.load();
    await ReadyPage.clickHowItWorksLink();
    await driver.pause(waitTime);
    await HowItWorks.clickNextButtonFourTimes();
    const getStarted = await HowItWorks.getStartedButton;
    await HowItWorks.clickButton(getStarted)
    const mobilePhoneNumber = await HowItWorks.enterMobilePhoneNumber;
    await mobilePhoneNumber.addValue(testData.MOBILE_NUMBER);
    const sendCode = await HowItWorks.enterSendVerificationCode;
    await HowItWorks.clickButton(sendCode)
    for (let i = 0; i < 6; i++) {
      const digitValue = await HowItWorks.enterDigit(i);
      await digitValue.addValue(testData.MOBILE_VERIFICATION[i]);
     }
    const verifyButton = await HowItWorks.enterVerifyButton;
    await HowItWorks.clickButton(verifyButton)
    const profileAvatar = await HowItWorks.enterProfileAvatar;
    await HowItWorks.clickButton(profileAvatar)
    console.log("User was able to successfully signIn using mobile")
  });
   //HowItWorks_013
  it('verifyInvalidMobileNumber' , async () =>{
    await ReadyPage.load();
    await ReadyPage.clickHowItWorksLink();
    await driver.pause(waitTime);
    await HowItWorks.clickNextButtonFourTimes();
    const getStarted = await HowItWorks.getStartedButton;
    await HowItWorks.clickButton(getStarted)
    const mobilePhoneNumber = await HowItWorks.enterMobilePhoneNumber;
    await mobilePhoneNumber.addValue(testData.INVALID_MOBILE_NUMBER);
    await driver.pause(waitTime);
    await expect(HowItWorks.phoneNumberHelperText).toHaveText('Enter a valid phone number');
    console.log("Invalid Mobile number error message verified")
   });
   //HowItWorks_014
  it('VerifyInvalidEmailAddress' , async () =>{
    await ReadyPage.load();
    await ReadyPage.clickHowItWorksLink();
    await driver.pause(waitTime);
    await HowItWorks.clickNextButtonFourTimes();
    const getStarted = await HowItWorks.getStartedButton;
    await HowItWorks.clickButton(getStarted)
    const emailTextBox = await HowItWorks.enterVoterEmailAddressTextBox;
    await emailTextBox.addValue(testData.INVALID_EMAIL_ADDRESS);
    await driver.pause(waitTime);
    await expect(HowItWorks.emailAddressHelperText).toHaveText('Enter valid email 6 to 254 characters long');
    console.log("Invalid Email Address error message verified")
   });
  // HowItWorks_015
  it('verifyDeleteUnverifiedPhoneNumbers', async () => {
    await ReadyPage.load();
    await ReadyPage.clickHowItWorksLink();
    await driver.pause(waitTime);
    await HowItWorks.clickNextButtonFourTimes();
    const getStarted = await HowItWorks.getStartedButton;
    await HowItWorks.clickButton(getStarted)
    const mobilePhoneNumber = await HowItWorks.enterMobilePhoneNumber;
    await mobilePhoneNumber.addValue(testData.UNVERIFIED_PHONE_NUMBER);
    const sendCode = await HowItWorks.enterSendVerificationCode;
    await HowItWorks.clickButton(sendCode)
    const backButton = await HowItWorks.backArrow;
    await HowItWorks.clickButton(backButton)
    const deleteButton = await HowItWorks.deleteIcon;
    await driver.pause(waitTime);
    await HowItWorks.clickButton(deleteButton);
    await expect(HowItWorks.alertMessage).toHaveText('Your Phone number was deleted.');
    console.log("Deleted unverified phone numbers")
   });
   // HowItWorks_016
  it('verifyDeleteUnverifiedEmailAddress', async () => {
    await ReadyPage.load();
    await ReadyPage.clickHowItWorksLink();
    await driver.pause(waitTime);
    await HowItWorks.clickNextButtonFourTimes();
    const getStarted = await HowItWorks.getStartedButton;
    await HowItWorks.clickButton(getStarted)
    const mobilePhoneNumber = await HowItWorks.enterMobilePhoneNumber;
    const emailTextBox = await HowItWorks.enterVoterEmailAddressTextBox;
    await emailTextBox.addValue(testData.EMAIL_NEGATIVE_SCENARIO);
    const sendCode = await HowItWorks.enterSendEmailVerificationCode;
    await HowItWorks.clickButton(sendCode)
    const backButton = await HowItWorks.backArrow;
    await HowItWorks.clickButton(backButton)
    const deleteButton = await HowItWorks.deleteIcon;
    await driver.pause(waitTime);
    await HowItWorks.clickButton(deleteButton);
    await expect(HowItWorks.alertMessage).toHaveText('Your email address was deleted.');
    console.log("Deleted unverified Email address")
   });

});
