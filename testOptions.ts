import { test as base } from '@playwright/test'
import { PageManager } from './page-objects/pageManger'

export type TestOptions = {
    globalsQaURL: string
    formLayoutsPage: string
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    globalsQaURL: ['', { option: true }],

    // formLayoutsPage: [async ({ page }, use) => {
    //     await page.goto('/')
    //     await page.getByText('Forms').click()
    //     await page.getByText('Form Layouts').click()
    //     await use('')
    // }, { auto: true }],

    formLayoutsPage: async ({ page }, use) => {
        await page.goto('/')
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
        console.log('before')
        await use('')
        console.log('after')
    },

    pageManager: async ({ page, formLayoutsPage }, use) => {
        const pm = new PageManager(page)
        await use(pm)
    }
})