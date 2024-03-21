const { expect } = require('@playwright/test');
exports.DeleteModal = class DeleteModal {
    constructor(page) {
        this.page = page;
        this.deleteButton = page.locator("//button[@id='deleteEmployee']");
        this.cancelButton = page.locator("//h5[text()='Delete Employee']/../..//button[@class='btn btn-secondary']");
        this.closeIconButton = page.locator("//h5[text()='Delete Employee']/../..//button[@class='close']");
        this.modal = page.locator("//div[@class='modal-content']//h5[text()='Delete Employee']/..");
        this.modalContentText = page.locator("//input[@id='deleteId']/..//div")
    }

    //Click on delete employee modal
    async clickOnDeleteEmployeeButton() {
        await this.deleteButton.click();
    }

    // Close the modal using close icon or cancel button
    async clickCancelModal() {
        await this.cancelButton.click();
    }

    // Is Modal Displayed
    async isDeleteEmployeeModalDisplayed() {
        await this.page.waitForTimeout(2000);
        return await this.modal.isVisible();
    }

    // Get Modal content text
    async getModalContentText() {
        return await this.modalContentText.textContent();
    }

}
