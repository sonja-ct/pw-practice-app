import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }, testInfo) => {
   // await page.goto(process.env.URL)
    await page.goto('/')
    await page.getByText('Button Triggering AJAX Request').click()
testInfo.setTimeout(testInfo.timeout + 2000)
})

test('auto waiting', async ({ page }) => {
    const successMessage = page.locator('.bg-success')
    // await successMessage.click()

    //    const messageText = await successMessage.textContent()
    //    expect(messageText).toEqual('Data loaded with AJAX get request.')
    // await successMessage.waitFor({ state: "attached" })

    // const messageText = await successMessage.allTextContents()
    // expect(messageText).toContain('Data loaded with AJAX get request.')

    await expect(successMessage).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 })
})

test.skip('alternative waiting', async ({ page }) => {
    const successMessage = page.locator('.bg-success')

    //____wait for element
    await page.waitForSelector('.bg-success')  
    const messageText = await successMessage.allTextContents()
    expect(messageText).toContain('Data loaded with AJAX get request.')

    //___wait for particular response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata')
    // const messageText = await successMessage.allTextContents()
    // expect(messageText).toContain('Data loaded with AJAX get request.')

    //___wait for network calls to be completed (NOT RECOMENDED)
    // await page.waitForLoadState('networkidle')
    // const messageText = await successMessage.allTextContents()
    // expect(messageText).toContain('Data loaded with AJAX get request.')
})

test('timeouts', async ({ page }) => {
    const successMessage = page.locator('.bg-success')
    await successMessage.click()
})