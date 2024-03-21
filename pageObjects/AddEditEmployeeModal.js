const { expect } = require('@playwright/test');
exports.AddEditEmployeeModal = class AddEditEmployeeModal {
    constructor(page) {
        this.page = page;
        this.firstName = page.locator("//input[@id='firstName']");
        this.lastName = page.locator("//input[@id='lastName']");
        this.dependent = page.locator("//input[@id='dependants']");
        this.addButton = page.locator("//button[@id='addEmployee']");
        this.updateButton = page.locator("//button[@id='updateEmployee']");
        this.cancelButton = page.locator("//h5[text()='Add Employee']/../..//button[@class='btn btn-secondary']");
        this.closeIcon = page.locator("//h5[text()='Add Employee']/../..//button[@class='close']");
        this.modal = page.locator("//div[@class='modal-content']//h5[text()='Add Employee']/..");
    }

    //Add or edit the employee
    // Edut modal uses the same modal so doing a check for Update or add button.
    //Manual bug has been logged for the header of the modal
    async addOrEditEmployee(firstName, lastName, dependent = 0, isEdit) {
        await this.page.waitForTimeout(2000);
        if (firstName) {
            await this.firstName.fill(firstName); // Use appropriate selectors for elements
        }
        if (lastName) {
            await this.lastName.fill(lastName);
        }
        if (dependent) {
            await this.dependent.fill(dependent.toString());
        }

        isEdit ? await this.updateButton.click() : await this.addButton.click();
        await this.page.waitForTimeout(2000);
    }

    // Close the modal using close icon or cancel button
    async clickCancelModal(useCancelButton = true) {
        useCancelButton ? await this.cancelButton.click() : await this.closeIcon.click();
    }

    // Is Modal Displayed
    async isAddEmployeeModalDisplayed() {
        await this.page.waitForTimeout(2000);
        return await this.modal.isVisible();
    }
}
