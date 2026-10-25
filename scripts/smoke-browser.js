// Called by smoke-dist --browser against its temporary fixture and server.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const toolRequire = createRequire(path.resolve(__dirname, '../build-tools/package.json'));

module.exports = async function smokeBrowser(base, fixture) {
    const { chromium } = toolRequire('playwright');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('console', message => {
        if (message.type() === 'error' || message.text().includes('(SystemJS)')) errors.push(message.text());
    });
    const screenshots = path.resolve(__dirname, '../dist/browser-smoke');
    fs.mkdirSync(screenshots, { recursive: true });
    try {
        await page.goto(base);
        await page.waitForSelector('.home-navigation a[href="/settings/language"]');
        assert.equal(await page.locator('.home-navigation a').count(), 3);
        await page.locator('.home-navigation a[href="/settings/language"]').click();
        await page.getByText('简体中文', { exact: true }).click();
        await page.waitForURL('**/settings');
        await page.reload();
        await page.getByText('按键设置', { exact: true }).waitFor();
        await page.goto(base);
        await page.getByRole('heading', { name: 'NES 游戏厅' }).waitFor();
        assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(245, 247, 251)');
        await page.locator('a[href="/' + fixture + '"]').click();
        await page.getByText('单人游戏', { exact: true }).click();
        await page.waitForSelector('canvas');
        await page.goto(base + '/settings/controller');
        await page.getByText('键盘映射', { exact: true }).waitFor();
        await page.goto(base);
        await page.getByRole('heading', { name: 'NES 游戏厅' }).waitFor();
        await page.setViewportSize({ width: 390, height: 844 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
        assert.deepEqual(errors, []);
        console.log('Browser smoke passed: Angular bootstrap, Chinese, routes, ROM loading, light theme, mobile');
    } catch (error) {
        error.message += '\nBrowser errors: ' + errors.join('\n');
        throw error;
    } finally {
        await page.screenshot({ path: path.join(screenshots, 'page.png'), fullPage: true }).catch(() => {});
        await browser.close();
    }
};
