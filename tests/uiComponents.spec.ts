import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})


test.describe.parallel('For layout page @block', () => {
    test.describe.configure({ retries: 2 })
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async ({ page }, testInfo) => {
        if (testInfo.retry) {
            console.log('TEST RETRY')
        }

        const usingGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'email' })
        await usingGridEmailInput.fill('test@test.com')
        await usingGridEmailInput.clear()
        // await usingGridEmailInput.pressSequentially('test2@test.com', { delay: 500 })
        await usingGridEmailInput.pressSequentially('test2@test.com')

        //generic
        const inputValue = await usingGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingGridEmailInput).toHaveValue('test2@test.com')
    })

    test('radio buttons', async ({ page }) => {
        const usingGridForm = page.locator('nb-card', { hasText: 'Using the Grid' })

        await usingGridForm.getByLabel('Option 1').check({ force: true })
        await usingGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true })


        const radioStatus2 = await usingGridForm.getByRole('radio', { name: 'Option 2' }).isChecked()
        expect(radioStatus2).toBeTruthy()

        await expect(usingGridForm.getByRole('radio', { name: 'Option 1' })).not.toBeChecked()
    })

})

test('radio buttons - visual @visual', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    const usingGridForm = page.locator('nb-card', { hasText: 'Using the Grid' })

    await usingGridForm.getByLabel('Option 1').check({ force: true })
await expect(usingGridForm).toHaveScreenshot()
    // await usingGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true })


    // const radioStatus2 = await usingGridForm.getByRole('radio', { name: 'Option 2' }).isChecked()
    // expect(radioStatus2).toBeTruthy()

    // await expect(usingGridForm.getByRole('radio', { name: 'Option 1' })).not.toBeChecked()
})

test('checkboxes - check/uncheck', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true })
    await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({ force: true })

    const allBoxes = page.getByRole('checkbox')

    for (const box of await allBoxes.all()) {
        await box.check({ force: true })
        expect(await box.isChecked()).toBeTruthy()
    }

    for (const box of await allBoxes.all()) {
        await box.uncheck({ force: true })
        expect(await box.isChecked()).toBeFalsy()
    }
})

test('dropdown', async ({ page }) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()
    const optionList = page.getByRole('list').locator('nb-option')

    const optionList1 = page.locator('nb-option-list').locator('nb-option')

    await expect(optionList1).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    const header = page.locator('nb-layout-header')

    await optionList.filter({ hasText: 'Cosmic' }).click()
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        Light: 'rgb(255, 255, 255)',
        Dark: 'rgb(34, 43, 69)',
        Cosmic: 'rgb(50, 50, 89)',
        Corporate: 'rgb(255, 255, 255)'
    }

    await dropDownMenu.click()
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if (color != 'Corporate') {
            await dropDownMenu.click()
        }
    }
})

test('tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()


    const tooltipCard = page.locator('nb-card', { hasText: 'Tooltip placements' })


    await tooltipCard.getByRole('button', { name: 'Top' }).hover()
    await expect(page.locator('nb-tooltip')).toContainText('This is a tooltip')
})

test('dialogboxes', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    //await expect(page.locator('table')).toContainText('mdo@gmail.com')

    const tableRows = page.locator('table tbody tr')
    console.log("number", await tableRows.count())

    await page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com' }).locator('.nb-trash').click()

    for (const row of await tableRows.all()) {
        const text = await row.textContent()
        expect(text).not.toContain('mdo@gmail.com')
    }
})

test('data table', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    const targetRow = page.getByRole('row', { name: 'twitter@outlook.com' })
    await targetRow.locator('.nb-edit').click()

    const editAge = page.locator('input-editor').getByPlaceholder('Age')
    await editAge.clear()
    await editAge.fill('22')
    await page.click('.nb-checkmark')

    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole('row', { name: '11' }).filter({ has: page.locator('td').nth(1).getByText('11') })
    await targetRowById.locator('.nb-edit').click()
    const editEmail = page.locator('input-editor').getByPlaceholder('E-mail')
    await editEmail.clear()
    await editEmail.fill('test@test.com')
    await page.click('.nb-checkmark')
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')
})

test('data table - filter', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    const ages = ['20', '30', '40', '200']

    for (let age of ages) {
        const editAge = page.locator('input-filter').getByPlaceholder('Age')
        await editAge.clear()
        await editAge.fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')

        for (let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent()
            if (age == '200') {
                expect(await page.getByRole('table').textContent()).toContain('No data found')

            } else {
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('date picker hardcoded', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInput = page.getByPlaceholder('Form Picker')
    await calendarInput.click()

    await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', { exact: true }).click()
    await expect(calendarInput).toHaveValue('Feb 1, 2025')
})

test('dinamic date picker', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInput = page.getByPlaceholder('Form Picker')
    await calendarInput.click()

    let date = new Date()
    date.setDate(date.getDate() + 200)
    const day = date.getDate().toString()
    const monthShort = date.toLocaleString('En-US', { month: 'short' })
    const monthLong = date.toLocaleString('En-US', { month: 'long' })
    const year = date.getFullYear()

    const expectedDate = `${monthShort} ${day}, ${year}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${monthLong} ${year} `

    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(day, { exact: true }).click()
    await expect(calendarInput).toHaveValue(expectedDate)
})

test('test circle', async ({ page }) => {
    //update attribute
    // const temp = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')

    // await page.evaluate(element => {
    //     element.setAttribute('cx', '232.63');
    //     element.setAttribute('cy', '232.63');
    // }, await temp.elementHandle());
    // await temp.click()
    // const tempValue = page.locator('[class="temperature-bg"] [class="value temperature h1"]')
    // await expect(tempValue).toHaveText(' 30 ')

    //mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2

    await page.mouse.move(x, y)
    await page.mouse.down()

    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()
    await expect(tempBox).toContainText(' 30 ')

    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x - 500, y)
    await page.mouse.move(x - 500, y - 500)
    await page.mouse.up()

    await expect(tempBox).toContainText(' 18 ')
})