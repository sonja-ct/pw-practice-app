import { Locator, Page } from '@playwright/test'
import { HelperBase } from './helperBase';

export class FormLayoutsPage extends HelperBase {
    private readonly usingGridForm: Locator;
    private readonly usingInlineForm: Locator
    private readonly emailField: Locator;
    private readonly passwordField: Locator;
    private readonly radioOption: (optionText: string) => Locator;
    private readonly inlineFormNameField: Locator
    private readonly inlineFormEmailField: Locator
    private readonly inlineFormCheckbox: Locator


    constructor(page: Page) {
        super(page)

        //grid form
        this.usingGridForm = page.locator('nb-card', { hasText: 'Using the Grid' })
        this.emailField = this.usingGridForm.getByRole('textbox', { name: 'Email' })
        this.passwordField = this.usingGridForm.getByRole('textbox', { name: 'Password' })
        this.radioOption = (optionText: string) => this.usingGridForm.getByRole('radio', { name: optionText })

        //inline form
        this.usingInlineForm = page.locator('nb-card', { hasText: 'Inline form' })
        this.inlineFormNameField = this.usingInlineForm.getByRole('textbox', { name: 'Jane Doe' })
        this.inlineFormEmailField = this.usingInlineForm.getByRole('textbox', { name: 'Email' })
        this.inlineFormCheckbox = this.usingInlineForm.getByRole('checkbox')

    }

    async submitUsingGridFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string) {
        await this.emailField.fill(email)
        await this.passwordField.fill(password)
        await this.radioOption(optionText).check({ force: true })
        await this.usingGridForm.getByRole('button').click({ force: true })

    }
    /**
     * This method is used to fill in data
     * @param name user first name 
     * @param email  user email
     * @param checkbox should checkbox be checked or no
     */
    async inlineFormwithCredentials(name: string, email: string, checkbox: boolean) {
        await this.inlineFormNameField.fill(name)
        await this.inlineFormEmailField.fill(email)

        if (checkbox) {
            await this.inlineFormCheckbox.check({ force: true })
        }
        await this.usingGridForm.getByRole('button').click({ force: true })
    }
}