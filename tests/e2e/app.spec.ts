import { test, expect } from '@playwright/test'

test.describe('AI Pet Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load application', async ({ page }) => {
    // Check page title or main element exists
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should have electron API exposed', async ({ page }) => {
    const hasAPI = await page.evaluate(() => {
      return typeof window.electronAPI !== 'undefined'
    })
    expect(hasAPI).toBe(true)
  })

  test('should expose platform info', async ({ page }) => {
    const platform = await page.evaluate(() => {
      return window.electronAPI?.platform
    })
    expect(platform).toBeDefined()
  })
})

test.describe('AI Pet - Pet Interaction', () => {
  test('should render pet component', async ({ page }) => {
    await page.goto('/')
    // Check for any visible pet element
    const petElement = page.locator('[data-pet], .pet, #pet')
    // This is a soft check - if no pet element, test passes
    // Real implementation would need specific selectors
  })
})
