import { defineConfig } from '@playwright/test';
import { TestOptions } from './testOptions';

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig<TestOptions>({
    use: {
        baseURL: 'http://localhost:4200/',
        globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    },

    projects: [
        {
            name: 'chromium',
        }
    ],
    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'npm run start',
        url: 'http://localhost:4200/',
        //   reuseExistingServer: !process.env.CI,
    },
});
