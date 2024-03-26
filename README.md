**Playwright Automation In UI For Benefits Dashboard**


This project demonstrates a UI automation framework built using JavaScript and Playwright for testing a benefits dashboard application. It includes functionalities for:
Adding Employees: Simulates adding a new employee to the system.
Verifying Employee Details: Confirm that the added employee information is accurate.
Updating Employee Details: Enables editing an existing employee's details as needed.
Deleting Employees: Allows removal of employees from the system.
Framework: The project adheres to the Page Object Model (POM) design pattern, promoting code modularity and maintainability.
Running the Tests:

Please make sure to go to the tests folder and run this command **npm i -D @playwright/test**
This will install all node modules and dependencies.

There are two ways to execute the automated tests:
1. From the Terminal:
Download the project from Git and store it in a suitable location on your machine.
Ensure you have Node Package Manager (npm) installed globally on your system (check with npm -v in the terminal).
Open a terminal window and navigate to the project directory (C:\PaylocityCodingChallengePlayWright).
Run the following command to initiate the tests:
npx playwright test

Screenshot For Test Results 
![image](https://github.com/chandan8925/PaylocityCodingChallengePlayWright/assets/14102123/38e899e5-207b-4158-bfa1-13598dc660a7)

 2. Using Playwright Test Explorer UI:
Follow steps 1-3 mentioned above for downloading and navigating to the project directory.
Execute the tests with a user interface for visualization using this command:
Run the following command to initiate the tests to run in test explorer UI mode: npx playwright test --ui

Screenshot for Test Results
![image](https://github.com/chandan8925/PaylocityCodingChallengePlayWright/assets/14102123/60072c8e-6a07-4aad-95c8-4000986228cf)

Configuration:
The project's configuration file is set up to employ a single worker for executing the three test cases, ensuring sequential testing (one test at a time).
Failure handling is implemented to capture screenshots and detailed traces whenever a test case encounters an issue.


