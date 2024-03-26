const { test, expect } = require('@playwright/test');
const { generateString, generateRandomDependent, paymentDetailsOfEmployee } = require('./utils/HelperClass');

test('GET /api/employees with token', async ({ request }) => {
  const url = 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees';
  const token = 'Basic VGVzdFVzZXIzNTY6Ml1aWE03I3pMNnM+';  // Encoded token

  const response = await request.get(url, {
    headers: {
      Authorization: token,
    },
  });

  expect(response.status()).toBe(200);  // Expect success status code

  // Additional assertions based on your API response format
  const data = await response.json();
  console.log("chandan",data);
  console.log("employeeDetails1",  data[0] );
  expect(data[0].firstName === "New"); // Replace "..." with expected properties
  for (const employee of data) {
  expect(employee.salary).toBeGreaterThan(50000);  // Assert all salaries are > 50000
}
});

test('POST Employee with Playwright', async ({ request }) => {
  const url = 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees';
  const token = 'Basic VGVzdFVzZXIzNTY6Ml1aWE03I3pMNnM+';  // Encoded credentials

  const employeeData = {
    firstName: generateString(5),
    lastName: generateString(5),
    dependants: generateRandomDependent(),
  };
//Calculate benefits value based on dependents
  const benefits = paymentDetailsOfEmployee(employeeData.dependants)[0];
  console.log("Benefits", benefits);
  const netPay = paymentDetailsOfEmployee(employeeData.dependants)[1];
  console.log("NetPay",netPay);
  const response = await request.post(url, {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(employeeData),
  });

  expect(response.status()).toBe(200); // Assert successful creation (201 Created)
  expect(response.headers()).toHaveProperty('content-type', 'application/json; charset=utf-8'); // Optional: Validate response content type

  const responseData = await response.json();
  console.log("chandan",responseData);
  expect(responseData).toHaveProperty('id'); // Assert presence of ID in response (may vary based on API)
  expect(responseData.firstName).toBe(employeeData.firstName);
  expect(responseData.lastName).toBe(employeeData.lastName);
  expect(responseData.dependants).toBe(employeeData.dependants);
 expect(responseData.net.toFixed(2))===(netPay);
  expect(responseData.benefitsCost.toFixed(2))===(benefits);
});

test('Delete employee by ID', async ({ request }) => {
  const baseUrl = 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees';
  const employeeId = '0a3006fc-e305-4816-b852-873d448ee0fd'; // Replace with the actual ID to delete
  const token = 'Basic VGVzdFVzZXIzNTY6Ml1aWE03I3pMNnM+';

  const response = await request.delete(baseUrl + '/' + employeeId, {
    headers: {
      'Authorization': token,
    },
  });

  // Validate successful deletion
  console.log(response);
  expect(response.status()).toBe(200); // Expected status code for successful deletion
  // Optionally, retrieve a list of employees after deletion to verify absence
  const employeesResponse = await request.get(baseUrl, {
    headers: {
      Authorization: token,
    },
  });
  const employees = await employeesResponse.json();
  expect(employees.find(employee => employee.id === employeeId)).toBeFalsy();
});

test.only('Get employee by ID', async ({ request }) => {
  const baseUrl = 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees';
  const employeeId = '0a3006fc-e305-4816-b852-873d448ee0fd'; // Replace with the actual ID to delete
  const token = 'Basic VGVzdFVzZXIzNTY6Ml1aWE03I3pMNnM+';

  const employeeData = {
    firstName: generateString(5),
    lastName: generateString(5),
    dependants: generateRandomDependent(),
  };

  const employeeCreatedResponse = await request.post(baseUrl, {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(employeeData),
  });

   const employeeCreatedResponseData = await employeeCreatedResponse.json();
  const response = await request.get(baseUrl + '/' + employeeCreatedResponseData.id, {
    headers: {
      'Authorization': token,
    },
  });
 const responseData = await response.json();
  expect(responseData.firstName.trim()).toBe(employeeCreatedResponseData.firstName.trim());
  expect(responseData.lastName.trim()).toBe(employeeCreatedResponseData.lastName.trim());
  expect(responseData.dependants).toBe(employeeCreatedResponseData.dependants);
 expect(responseData.net===(employeeCreatedResponseData.net));
  expect(responseData.benefitsCost===(employeeCreatedResponseData.benefitsCost));
});