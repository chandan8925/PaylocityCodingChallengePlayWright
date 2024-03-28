const { test, expect } = require('@playwright/test');
const { generateString, generateRandomDependent, paymentDetailsOfEmployee } = require('./utils/HelperClass');
const url = 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees';
const token = 'Basic VGVzdFVzZXIzNTY6Ml1aWE03I3pMNnM+';  // Encoded credentials

test('GET /api/employees with token', async ({ request }) => {
  const employeeData = {
    firstName: generateString(5),
    lastName: generateString(5),
    dependants: generateRandomDependent(),
  };
  const postResponse = await request.post(url, {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(employeeData),
  });
  // Assert successful creation (200 Created)
  expect(postResponse.status()).toBe(200);
  // Optional: Validate response content type
  expect(postResponse.headers()).toHaveProperty('content-type', 'application/json; charset=utf-8');
  const response = await request.get(url, {
    headers: {
      Authorization: token,
    },
  });

  expect(response.status()).toBe(200);  // Expect success status code

  // Additional assertions based on your API response format
  const data = await response.json();
  for (const employee of data) {
    expect(employee.salary).toBeGreaterThan(50000);  // Assert all salaries are > 50000
  }
});

test('POST Employee with Playwright', async ({ request }) => {

  const employeeData = {
    firstName: generateString(5),
    lastName: generateString(5),
    dependants: generateRandomDependent(),
  };

  //Calculate benefits value based on dependents
  const benefits = paymentDetailsOfEmployee(employeeData.dependants)[0];
  const netPay = paymentDetailsOfEmployee(employeeData.dependants)[1];
  const response = await request.post(url, {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(employeeData),
  });

  expect(response.status()).toBe(200); // Assert successful creation (200 Created)
  expect(response.headers()).toHaveProperty('content-type', 'application/json; charset=utf-8'); // Optional: Validate response content type

  const responseData = await response.json();
  expect(responseData).toHaveProperty('id'); // Assert presence of ID in response (may vary based on API)
  expect(responseData.firstName).toBe(employeeData.firstName);
  expect(responseData.lastName).toBe(employeeData.lastName);
  expect(responseData.dependants).toBe(employeeData.dependants);
  expect(responseData.net.toFixed(2)) === (netPay);
  expect(responseData.benefitsCost.toFixed(2)) === (benefits);
});

test('Delete employee by ID', async ({ request }) => {
  const employeeData = {
    firstName: generateString(5),
    lastName: generateString(5),
    dependants: generateRandomDependent(),
  };
  const postResponse = await request.post(url, {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(employeeData),
  });

  expect(postResponse.status()).toBe(200); // Assert successful creation (200 Created)
  expect(postResponse.headers()).toHaveProperty('content-type', 'application/json; charset=utf-8'); // Optional: Validate response content type
  const postResponseData = await postResponse.json();
  const response = await request.delete(url + '/' + postResponseData.id, {
    headers: {
      'Authorization': token,
    },
  });

  // Validate successful deletion
  expect(response.status()).toBe(200); // Expected status code for successful deletion
  // Optionally, retrieve a list of employees after deletion to verify absence
  const employeesResponse = await request.get(url, {
    headers: {
      Authorization: token,
    },
  });
  const employees = await employeesResponse.json();
  expect(employees.find(employee => employee.id === postResponseData.id)).toBeFalsy();
});

test('Get employee by ID', async ({ request }) => {
  const employeeData = {
    firstName: generateString(5),
    lastName: generateString(5),
    dependants: generateRandomDependent(),
  };

  const employeeCreatedResponse = await request.post(url, {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(employeeData),
  });

  const employeeCreatedResponseData = await employeeCreatedResponse.json();
  const response = await request.get(url + '/' + employeeCreatedResponseData.id, {
    headers: {
      'Authorization': token,
    },
  });
  const responseData = await response.json();
  expect(responseData.firstName.trim()).toBe(employeeCreatedResponseData.firstName.trim());
  expect(responseData.lastName.trim()).toBe(employeeCreatedResponseData.lastName.trim());
  expect(responseData.dependants).toBe(employeeCreatedResponseData.dependants);
  expect(responseData.net === (employeeCreatedResponseData.net));
  expect(responseData.benefitsCost === (employeeCreatedResponseData.benefitsCost));
});