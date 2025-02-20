import { defineConfig, devices } from '@playwright/test';
import { TestOptions } from './testOptions';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

//require('dotenv').config()
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  // timeout: 1000,
  expect: {
    timeout: 50000,
  },
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    //baseURL: 'http://localhost:4200/',
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL: process.env.DEV === '1' ? 'http://localhost:4202/'
      : process.env.STAGE === '1' ? 'http://localhost:4201/'
        : 'http://localhost:4200/',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    video: {
      mode: 'retain-on-failure',
      size: {
        width: 1920, height: 1080
      }
    }
  },
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/jsonReport.json' }],
    ['junit',{outputFile: 'test-results/junitReport.xml'}],
    ['allure-playwright']
  ],
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'dev',
      use: {
        baseURL: 'http://localhost:4201',
        browserName: 'chromium',
        //fullyParallel:true
      }
    }, {
      name: 'stage',
      use: {
        baseURL: 'http://localhost:4200',
        browserName: 'firefox'
      },
    },
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
      //fullyParallel:true
    },

    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },

    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
    {
      name: 'pageObjectsFullScreen',
      testMatch: 'usePageObjects.spec.ts',
      use: {
        browserName: 'chromium',
        viewport: {
          width: 1920, height: 1080
        }
      },
    },
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/',
    reuseExistingServer: true
    // reuseExistingServer: !process.env.CI,
  },
});
