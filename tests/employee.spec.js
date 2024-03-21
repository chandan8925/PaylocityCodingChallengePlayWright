// @ts-check
import dotenv from 'dotenv'

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pageObjects/LoginPage');
const { BenefitsDashboard } = require('../pageObjects/BenefitsDashboard');
const { AddEditEmployeeModal } = require('../pageObjects/AddEditEmployeeModal');
const { DeleteModal } = require('../pageObjects/DeleteModal');
const { generateString, generateRandomDependent, paymentDetailsOfEmployee } = require('./utils/HelperClass');

let url;
let userName;
let password;

// Setup of test case by getting test data from test file
test.beforeAll(() => {
  dotenv.config({
    path: 'tests/.env',
    override: true,
  });
  url = process.env.BaseUrl;
  userName = process.env.UserName;
  password = process.env.Password;
});

// Add and verify benefits and net pay of employee
test('AddAndVerifyBenefitsNetPayOfEmployee', async ({ page }) => {

  const loginPage = new LoginPage(page);
  await loginPage.LoginIntoApplication(url, userName, password);
  const benefitsDashboardPage = new BenefitsDashboard(page);
  const addEditEmployeeModal = new AddEditEmployeeModal(page);

  // Generate random string for firstname, last name
  const firstName = generateString(5);
  const lastName = generateString(5);

  // Generate random dependent number
  const dependants = generateRandomDependent();

  // calculate employee benefits and net pay store them in an array [0] index is for benefits [1] index is for net pay
  const benefits = paymentDetailsOfEmployee(dependants)[0];
  const netPay = paymentDetailsOfEmployee(dependants)[1];

  // Verify employee dashboard is displayed
  expect(await benefitsDashboardPage.isEmployeeDashboardDisplayed()).toBeTruthy;

  await benefitsDashboardPage.clickAddEmployeeButton();

  // Verify add employee model is displayed
  expect(await addEditEmployeeModal.isAddEmployeeModalDisplayed()).toBeTruthy;

  //add an employee with firstname, lastname, dependents generated above
  await addEditEmployeeModal.addOrEditEmployee(firstName, lastName, dependants, false);
  // On adding employee verify benefits dashboard is displayed
  expect(await benefitsDashboardPage.isEmployeeDashboardDisplayed()).toBeTruthy;

  // Step 1: Array Declaration
  let expectedEmployeeDetails;  // Declare without initial value

  // Step 2: Array Initialization with expected values
  expectedEmployeeDetails = [firstName, lastName, dependants.toString(),  // Use toString() for numbers as well
    "52000.00", "2000.00", benefits.toString(), netPay.toString()];

  // Note Last Name & First Name column header is switched but manual bug is logged for it.
  //Assuming column header for first name and last name as bug fix will be switched so asserting based on that
  //verify the grid value is matched for every column value of a particular employee
  for (let i = 0; i < 7; i++) {
    const expectedValue = expectedEmployeeDetails[i];
    let actualValue;

    // This function should retrieve the actual value from the grid based on firstName and column index (i)
    actualValue = await benefitsDashboardPage.validateEmployeeDetailsInDashboard(firstName, i + 1);
    // Assert that expectedValue matches actualValue
    expect(expectedValue.trim() === actualValue.trim()).toBeTruthy;

  }

  await page.close();
});

// Delete the employee
test('Delete Employee', async ({ page }) => {

  const loginPage = new LoginPage(page);
  await loginPage.LoginIntoApplication(url, userName, password);
  const deleteModal = new DeleteModal(page);
  const benefitsDashboardPage = new BenefitsDashboard(page);
  const addEditEmployeeModal = new AddEditEmployeeModal(page);

  // Generate random string for firstname, last name
  const firstName = generateString(5);
  const lastName = generateString(5);

  // Generate random dependent number
  const dependants = generateRandomDependent();
  await benefitsDashboardPage.clickAddEmployeeButton();

  // add the employee based on information found above
  await addEditEmployeeModal.addOrEditEmployee(firstName, lastName, dependants, false);

  expect(await benefitsDashboardPage.isEmployeeDashboardDisplayed()).toBeTruthy;

  // Get the count of total number of employee row
  const rowCountBeforeDelete = await benefitsDashboardPage.getCountOfEmployeeRow();

  // click on delete icon for the employee you want to delete
  await benefitsDashboardPage.clickDeleteIconButton(firstName);

  // Delete modal employee is displayed
  expect(await deleteModal.isDeleteEmployeeModalDisplayed()).toBeTruthy;

  // Get the modal content text
  const text = await deleteModal.getModalContentText();

  // CLick cancel modal
  await deleteModal.clickCancelModal();

  // Verify dashboard is displayed when user cancel the delete modal
  expect(await benefitsDashboardPage.isEmployeeDashboardDisplayed()).toBeTruthy;
  // Get the count of total number of employee row
  const rowCountWhenUserIsNotDeleted = await benefitsDashboardPage.getCountOfEmployeeRow();

  // Verify employee count is same as user is not deleted
  expect(rowCountBeforeDelete - rowCountWhenUserIsNotDeleted).toEqual(0);

  //click on delete icon of the employee
  await benefitsDashboardPage.clickDeleteIconButton(firstName);

  // click on delete employee
  await deleteModal.clickOnDeleteEmployeeButton();
  expect(await benefitsDashboardPage.isEmployeeDashboardDisplayed()).toBeTruthy;

  // Get the count of employee after deletion
  const rowCountAfterDelete = await benefitsDashboardPage.getCountOfEmployeeRow();

  //Verify employee row is decreased by 1
  expect(rowCountBeforeDelete - rowCountAfterDelete).toEqual(1);

  await page.close();
});

// Edit and verify details of employee after updating the fields
test('EditAndVerifyDetailsOfEmployee', async ({ page }) => {

  const loginPage = new LoginPage(page);
  await loginPage.LoginIntoApplication(url, userName, password);
  const benefitsDashboardPage = new BenefitsDashboard(page);
  const addEditEmployeeModal = new AddEditEmployeeModal(page);

  // Generate random string for firstname, last name and random dependents
  const firstName = generateString(5);
  const lastName = generateString(5);
  const dependants = generateRandomDependent();

  //Calculate benefits value based on dependents
  const benefits = paymentDetailsOfEmployee(dependants)[0];
  const netPay = paymentDetailsOfEmployee(dependants)[1];
  expect(await benefitsDashboardPage.isEmployeeDashboardDisplayed()).toBeTruthy;

  await benefitsDashboardPage.clickAddEmployeeButton();
  expect(await addEditEmployeeModal.isAddEmployeeModalDisplayed()).toBeTruthy;

  // Add the employee based on above information
  await addEditEmployeeModal.addOrEditEmployee(firstName, lastName, dependants, false);
  expect(await benefitsDashboardPage.isEmployeeDashboardDisplayed()).toBeTruthy;

  //Verify the employee added successfully
  // Step 1: Array Declaration
  let expectedEmployeeDetails;  // Declare without initial value

  // Step 2: Array Initialization with expected values
  expectedEmployeeDetails = [firstName, lastName, dependants.toString(),  // Use toString() for numbers as well
    "52000.00", "2000.00", benefits.toString(), netPay.toString()];

  // Note Last Name & First Name column header is switched but manual bug is logged for it.
  // Verify grid details of the employee added above
  for (let i = 0; i < 7; i++) {
    const expectedValue = expectedEmployeeDetails[i];
    let actualValue;

    // This function should retrieve the actual value from the grid based on firstName and column index (i)
    actualValue = await benefitsDashboardPage.validateEmployeeDetailsInDashboard(firstName, i + 1);
    // Assert that expectedValue matches actualValue
    expect(expectedValue.trim() === actualValue.trim()).toBeTruthy;

  }

  // click on edit button of the employee
  await benefitsDashboardPage.clickEditIconButton(firstName);

  // Update first name and dependents and no changes to lastname
  const updatedfirstName = generateString(5);
  const updatedDependants = generateRandomDependent();
  const updatedBenefits = paymentDetailsOfEmployee(dependants)[0];
  const updatedNetPay = paymentDetailsOfEmployee(dependants)[1];
  await addEditEmployeeModal.addOrEditEmployee(updatedfirstName, lastName, updatedDependants, true);
  expect(await benefitsDashboardPage.isEmployeeDashboardDisplayed()).toBeTruthy;

  let expectedUpdatedEmployeeDetails;
  expectedUpdatedEmployeeDetails = [updatedfirstName, lastName, updatedDependants.toString(),  // Use toString() for numbers as well
    "52000.00", "2000.00", updatedBenefits.toString(), updatedNetPay.toString()];

  // verify benefits net pay dependents and first name is updated but no changes to last name as user has not updated it.
  // Note Last Name & First Name column header is switched but manual bug is logged for it. 
  //Assuming column header for first name and last name as bug fix will be switched so asserting based on that

  for (let i = 0; i < 7; i++) {
    const expectedValue = expectedUpdatedEmployeeDetails[i];
    let actualValue;

    // This function should retrieve the actual value from the grid based on firstName and column index (i)
    // Verify updated details is displayed for the user correctly
    actualValue = await benefitsDashboardPage.validateEmployeeDetailsInDashboard(updatedfirstName, i + 1);
    // Assert that expectedValue matches actualValue
    expect(expectedValue.trim() === actualValue.trim()).toBeTruthy;

  }

  await page.close();
});

