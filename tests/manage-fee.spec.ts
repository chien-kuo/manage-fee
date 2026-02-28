import { test, expect } from '@playwright/test';

test.describe('管理費匯整 E2E 測試', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 關鍵優化：等待連線狀態變為「已連線」才開始測試
    await expect(page.locator('footer')).toContainText('已連線', { timeout: 15000 });
  });

  test('頁面應正確渲染主要元件', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('管理費匯整');
    await expect(page.getByText('填寫區')).toBeVisible();
    await expect(page.getByText('填寫進度總覽')).toBeVisible();
  });

  test('使用者應能成功提交匯款資料', async ({ page }) => {
    // 攔截並記錄可能出現的 Alert 錯誤訊息
    page.on('dialog', async dialog => {
      console.log('偵測到系統錯誤訊息:', dialog.message());
      await dialog.dismiss();
    });

    // 1. 選擇門牌號碼
    await page.locator('select').first().selectOption('1');

    // 2. 點擊送出按鈕
    await page.getByRole('button', { name: '送出資料' }).click();

    // 3. 驗證右側表格是否出現 1 號的紀錄 (增加等待時間至 15 秒)
    const houseBadge = page.locator('table tbody tr').getByText('1', { exact: true }).first();
    await expect(houseBadge).toBeVisible({ timeout: 15000 });
  });

  test('管理者登入彈窗功能驗證', async ({ page }) => {
    await page.getByRole('button', { name: '管理者後台' }).click();
    await expect(page.getByText('登入後台')).toBeVisible();
    await expect(page.getByPlaceholder('example@mail.com')).toBeVisible();
    await page.locator('button:has(.lucide-x)').click();
    await expect(page.getByText('登入後台')).not.toBeVisible();
  });
});
