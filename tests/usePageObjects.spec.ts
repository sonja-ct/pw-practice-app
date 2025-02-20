import { test } from '@playwright/test'
import { faker } from '@faker-js/faker'

import { PageManager } from '../page-objects/pageManger'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('navigate to form page @smoke', async ({ page }) => {
    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods @smoke @regression', async ({ page }) => {
    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingGridFormWithCredentialsAndSelectOption('test@test.com', 'welcome123', 'Option 1')
})

test('parametrized methods 2', async ({ page }) => {
    const pm = new PageManager(page)

    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`
    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingGridFormWithCredentialsAndSelectOption(process.env.USER_NAME, process.env.PASSWORD, 'Option 2')
    await pm.onFormLayoutsPage().inlineFormwithCredentials('John Smith', 'John@test.com', true)
    await page.screenshot({ path: 'screenshots/forms-layouts.png' })
const buffer = await page.screenshot()
console.log('screenshot buffer '+buffer.toString('base64'))
    await pm.onFormLayoutsPage().inlineFormwithCredentials(randomFullName, randomEmail, true)
    await page.locator('nb-card', { hasText: 'Inline form' }).screenshot({ path: 'screenshots/inline-form.png' })
})

test('parametrized methods datepicker', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().datepickerPage()

    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(15)
    await pm.onDatepickerPage().selectDatePickerWithRangeFromToday(13, 26)
})