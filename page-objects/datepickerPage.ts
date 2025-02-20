import { expect, Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatepickerPage extends HelperBase {
    
    private readonly yearAndMonthOnCalendar: Locator
    private readonly calendarNavigationRight: Locator
    private readonly calendarInputField: Locator
    private readonly dayOnCalendar: (exactDay: string) => Locator
    private readonly dayOnCalendarWithRange: (exactDay: string) => Locator
    private readonly calendarRangePickerField: Locator

    constructor(page: Page) {
        super(page)
        this.yearAndMonthOnCalendar = page.locator('nb-calendar-view-mode')
        this.calendarNavigationRight = page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]')
        this.calendarInputField = page.getByPlaceholder('Form Picker')
        this.calendarRangePickerField = page.getByPlaceholder('Range Picker')
        this.dayOnCalendar = (exactDay: string) => page.locator('[class= "day-cell ng-star-inserted"]').getByText(exactDay, { exact: true })
        this.dayOnCalendarWithRange = (exactDay: string) => page.locator('[class= "range-cell day-cell ng-star-inserted"]').getByText(exactDay, { exact: true })
    }


    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        await this.calendarInputField.click()
        const dateToAssert = await this.selectDateInCalendar(numberOfDaysFromToday)
        await expect(this.calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatePickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number) {
        await this.calendarRangePickerField.click()
        const startDay = await this.selectDateInCalendar(startDayFromToday)
        const endDay = await this.selectDateInCalendar(endDayFromToday)
        const dateToAssert = `${startDay} - ${endDay}`
        await expect(this.calendarRangePickerField).toHaveValue(dateToAssert)
    }

    private async selectDateInCalendar(numberOfDaysFromToday: number) {
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)

        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' })
        const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' })
        const expectedYear = date.getFullYear()

        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

        let calendarMonthAndYear = await this.yearAndMonthOnCalendar.textContent()
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`

        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.calendarNavigationRight.click()
            calendarMonthAndYear = await this.yearAndMonthOnCalendar.textContent()
        }

        if (await this.dayOnCalendarWithRange(expectedDate).isVisible()) {
            await this.dayOnCalendarWithRange(expectedDate).click();
        } else if (await this.dayOnCalendar(expectedDate).isVisible()) {
            await this.dayOnCalendar(expectedDate).click();
        }

        return dateToAssert
    }
}
