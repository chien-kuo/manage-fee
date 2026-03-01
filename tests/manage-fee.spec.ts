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

  test('使用者應能成功提交匯款資料 (含銀行資訊)', async ({ page }) => {
    await page.locator('select').first().selectOption('2');
    await page.getByPlaceholder('轉帳銀行').fill('玉山銀行');
    await page.getByPlaceholder('末五碼').fill('12345');
    await page.getByRole('button', { name: '送出資料' }).click();

    // 驗證表格內容
    await expect(page.locator('table tbody tr').getByText('2', { exact: true }).first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('table tbody tr').getByText('玉山銀行')).toBeVisible();
    await expect(page.locator('table tbody tr').getByText('12345')).toBeVisible();
  });

  test('管理者應能將資料標記為已對帳', async ({ page }) => {
    test.setTimeout(60000); // 增加超時時間到 60 秒
    // 1. 先送出一筆資料
    await page.locator('select').first().selectOption('3');
    await page.getByRole('button', { name: '送出資料' }).click();
    await expect(page.locator('table tbody tr').getByText('3', { exact: true }).first()).toBeVisible({ timeout: 15000 });

    // 2. 登入管理者
    await page.getByRole('button', { name: '管理者後台' }).click();
    await expect(page.getByText('登入後台')).toBeVisible();

    await page.getByPlaceholder('example@mail.com').fill('cksu.orz@gmail.com');
    await page.getByPlaceholder('••••••••').fill('RU%7pjjcAQ@1N^');
    await page.getByRole('button', { name: '安全登入' }).click();
    
    // 檢查是否有錯誤訊息
    const errorMsg = page.locator('.text-red-500');
    // 如果在 5 秒內彈窗還在，檢查是否有錯誤訊息
    await page.waitForTimeout(3000); 
    if (await page.getByText('登入後台').isVisible()) {
      if (await errorMsg.isVisible()) {
        const errorText = await errorMsg.textContent();
        console.error('登入失敗:', errorText);
        throw new Error(`登入失敗: ${errorText}`);
      }
    }

    // 等待彈窗消失，代表登入成功
    await expect(page.getByText('登入後台')).not.toBeVisible({ timeout: 10000 });

    // 等待管理者工具列出現
    await expect(page.getByText('後台操作', { exact: false })).toBeVisible({ timeout: 10000 });

    // 3. 勾選資料並點擊已對帳
    // 監聽對話框 (例如 alert)
    page.on('dialog', dialog => {
      console.log(`對話框訊息: ${dialog.message()}`);
      dialog.accept();
    });

    // 找到 3 號那一行，並勾選該行的 checkbox
    // 確保我們點擊的是正確行的 checkbox
    const houseThreeRow = page.locator('tr').filter({ has: page.getByText('3', { exact: true }) }).first();
    await houseThreeRow.locator('input[type="checkbox"]').check();
    
    // 點擊藍色對帳按鈕 (用 title 找)
    console.log('點擊對帳按鈕...');
    await page.getByTitle('標記為已對帳').click();

    // 等待 Firestore 更新並同步回來到前端
    console.log('等待同步...');
    await page.waitForTimeout(8000);

    // 4. 驗證對帳後的狀態 (顏色變為藍色)
    // ProgressOverview 中的 3 號應該變藍色
    const statusCell = page.getByTestId('status-cell-3');
    await expect(statusCell).toHaveClass(/from-blue-500/);

    // 5. 再次點擊「已對帳」按鈕，應該會取消對帳狀態 (變回橘色)
    console.log('再次點擊對帳按鈕以取消狀態...');
    await houseThreeRow.locator('input[type="checkbox"]').check();
    await page.getByTitle('標記為已對帳').click();
    
    // 等待同步
    await page.waitForTimeout(8000);
    
    // 驗證是否變回橘色 (from-orange-500)
    await expect(statusCell).toHaveClass(/from-orange-500/);
    console.log('已成功驗證取消對帳狀態 (變回橘色)');
  });
});
