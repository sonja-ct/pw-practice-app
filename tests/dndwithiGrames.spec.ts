import { expect } from '@playwright/test'
import {test} from '../testOptions'

test('dnd ', async ({ page,globalsQaURL }) => {
    page.on("dialog", async dialog => {
        await dialog.dismiss()
    })

    page.goto(globalsQaURL)
    await page.getByRole('button', { name: 'Consent' }).click()

    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    await frame.locator('li', { hasText: 'High Tatras 2' }).dragTo(frame.locator('#trash'))


    await frame.locator('li', { hasText: 'High Tatras 4' }).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()

    await expect(frame.locator('#trash li h5')).toHaveText(['High Tatras 2', 'High Tatras 4'])
})