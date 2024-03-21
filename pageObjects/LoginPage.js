const { expect } = require('@playwright/test');
exports.LoginPage = class LoginPage {
    constructor(page) {
        this.page = page;
        this.userName = page.locator("//input[@id='Username']");
        this.password = page.locator("//input[@id='Password']");
        this.LoginButton = page.locator("//button[@type='submit']");
    }

    // Login to the application with valid url username and password
    async LoginIntoApplication(url, userName, password) {
        await this.page.goto(url);
        await this.userName.fill(userName);
        await this.password.fill(password)
        await this.LoginButton.click();
        await this.page.waitForTimeout(2000);
    }

}
