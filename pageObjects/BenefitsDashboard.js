const { expect } = require('@playwright/test');
exports.BenefitsDashboard = class BenefitsDashboard {
    constructor(page) {
        this.page = page;
        this.AddEmployeeButton = page.locator("//button[@id='add']");
        this.employeeTable = page.locator("//table[@id=\"employeesTable\"]");
    }

    // Click On Add Employee Button
    async clickAddEmployeeButton() {
        await this.AddEmployeeButton.click();
    }

    //Validate employee Details In Dashboard
    async validateEmployeeDetailsInDashboard(firstName, index) {
        const rowIndex = await this.getEmployeeRowIndex(firstName);
        let columnText = await this.page.locator('//table/tbody').locator('tr').nth(rowIndex).locator('td').nth(index).textContent();
        return columnText;
    }

    // Validate employee details is displayed in dashboard
    async validateEmployeeDetailsIsDisplayedInDashBoard(firstName) {
        const employeeRow = await this.page.waitForSelector(
            `//tr//td[contains(text(),'${firstName}')]/..`
        );
        return employeeRow.isVisible();
    }

    //Click on delete icon button
    async clickDeleteIconButton(firstName) {
        const rowIndex = await this.getEmployeeRowIndex(firstName);
        await this.page.locator('//table/tbody').locator('tr').nth(rowIndex).locator('td').nth(8).locator('i').nth(1).click();
    }

    // click on edit icon button
    async clickEditIconButton(firstName) {
        const rowIndex = await this.getEmployeeRowIndex(firstName);
        await this.page.locator('//table/tbody').locator('tr').nth(rowIndex).locator('td').nth(8).locator('i').nth(0).click();
    }

    // Validate Employee Dashboard is displayed
    async isEmployeeDashboardDisplayed() {
        await this.page.reload();
        await this.page.waitForTimeout(3000);
        return await this.employeeTable.isVisible();
    }

    // Get Count of employee row
    async getCountOfEmployeeRow() {
        return await this.page.locator('//table/tbody').locator('tr').count();
    }

    // Get all the employee details of an employee by searching through firstname 
    async getEmployeeRowIndex(firstName) {

        const rowCount = await this.page.locator('//table/tbody').locator('tr').count();
        let rowIndex;
        for (let i = 0; i < rowCount; i++) {
            let text = await this.page.locator('//table/tbody').locator('tr').nth(i).locator('td').nth(1).textContent();
            if (text.trim() === firstName.trim()) {
                rowIndex = i;
                break;
            }
        }
        return rowIndex;
    }
}
