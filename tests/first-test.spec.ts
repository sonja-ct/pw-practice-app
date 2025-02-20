import { test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.beforeAll(() => {

})

test.afterAll(() => {

})

test.afterEach(() => {

})

test.describe('suite 1', () => {
    test.beforeEach(async ({ page }) => {
        await page.locator('a[title="Charts"]').click()
    })

    test('Navigate to Echarts', async ({ page }) => {
        await page.getByText('Echarts').click()
    })
})

test.describe('suite 2', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
    })

    test('Navigate to Form Layouts', async ({ page }) => {
        await page.getByText('Form Layouts').click()
    })

    test('Navigate to Datepicker', async ({ page }) => {
        await page.getByText('Datepicker').click()
    })

})