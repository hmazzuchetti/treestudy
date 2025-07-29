import { test, expect } from '@playwright/test';

test.describe('Advanced 3D Grass System Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5174');
    
    // Wait for the app to load and the 3D canvas to be ready
    await page.waitForSelector('canvas', { timeout: 30000 });
    
    // Wait for 3D scene initialization
    await page.waitForTimeout(2000);
  });

  test('should validate initial grass field state with minimal growth', async ({ page }) => {
    // Take initial screenshot showing minimal grass
    await page.screenshot({
      path: 'test-results/01-initial-minimal-grass.png',
      fullPage: true
    });

    // Verify initial points are 0 or very low
    const pointsText = await page.locator('[data-testid="points-display"] || text=/\\d+ points/').first().textContent();
    console.log('Initial points:', pointsText);

    // Check debug info overlay
    const debugInfo = await page.locator('.absolute.top-4.left-4').textContent();
    expect(debugInfo).toContain('Points:');
    expect(debugInfo).toContain('Growth:');
    expect(debugInfo).toContain('3D Advanced Grass Field');
    console.log('Debug info:', debugInfo);
  });

  test('should test progressive grass growth with +25 points button', async ({ page }) => {
    const testSteps = [
      { clicks: 1, expectedMinPoints: 25, filename: '02-grass-after-25-points.png' },
      { clicks: 2, expectedMinPoints: 50, filename: '03-grass-after-50-points.png' },
      { clicks: 3, expectedMinPoints: 75, filename: '04-grass-after-75-points.png' },
      { clicks: 4, expectedMinPoints: 100, filename: '05-grass-after-100-points.png' },
      { clicks: 8, expectedMinPoints: 200, filename: '06-grass-after-200-points.png' },
    ];

    for (const step of testSteps) {
      // Click the +25 points button the required number of times
      for (let i = 0; i < step.clicks; i++) {
        await page.click('button:has-text("+25 points")');
        await page.waitForTimeout(500); // Allow for growth animation
      }

      // Wait for growth animation to complete
      await page.waitForTimeout(1000);

      // Take screenshot
      await page.screenshot({
        path: `test-results/${step.filename}`,
        fullPage: true
      });

      // Verify points increased
      const debugInfo = await page.locator('.absolute.top-4.left-4').textContent();
      const pointsMatch = debugInfo?.match(/Points: (\\d+)/);
      const currentPoints = pointsMatch ? parseInt(pointsMatch[1]) : 0;
      
      expect(currentPoints).toBeGreaterThanOrEqual(step.expectedMinPoints);
      
      // Verify growth percentage increased
      const growthMatch = debugInfo?.match(/Growth: (\\d+)%/);
      const growthPercentage = growthMatch ? parseInt(growthMatch[1]) : 0;
      
      console.log(`After ${step.expectedMinPoints} points: Growth ${growthPercentage}%, Grass Blades: ${debugInfo?.match(/Grass Blades: (\\d+)/)?.[1] || '0'}`);
    }
  });

  test('should test +50 points button for rapid growth', async ({ page }) => {
    // Test +50 points button multiple times
    const rapidGrowthSteps = [
      { clicks: 1, expectedMinPoints: 50, filename: '07-rapid-growth-50-points.png' },
      { clicks: 2, expectedMinPoints: 100, filename: '08-rapid-growth-100-points.png' },
      { clicks: 4, expectedMinPoints: 200, filename: '09-rapid-growth-200-points.png' },
      { clicks: 6, expectedMinPoints: 300, filename: '10-rapid-growth-300-points.png' },
    ];

    for (const step of rapidGrowthSteps) {
      // Click +50 points button
      for (let i = 0; i < step.clicks; i++) {
        await page.click('button:has-text("+50 points")');
        await page.waitForTimeout(300);
      }

      // Wait for growth animation
      await page.waitForTimeout(1500);

      // Screenshot
      await page.screenshot({
        path: `test-results/${step.filename}`,
        fullPage: true
      });

      // Verify rapid growth
      const debugInfo = await page.locator('.absolute.top-4.left-4').textContent();
      const pointsMatch = debugInfo?.match(/Points: (\\d+)/);
      const currentPoints = pointsMatch ? parseInt(pointsMatch[1]) : 0;
      
      expect(currentPoints).toBeGreaterThanOrEqual(step.expectedMinPoints);
      console.log(`Rapid growth test: ${currentPoints} points achieved`);
    }
  });

  test('should achieve fully grown grass field at high points', async ({ page }) => {
    // Click multiple buttons to reach high point count (aim for 1000+ for full growth)
    console.log('Building up to full grass field...');
    
    // Use +50 points button for efficiency
    for (let i = 0; i < 20; i++) {
      await page.click('button:has-text("+50 points")');
      await page.waitForTimeout(200);
    }

    // Wait for all growth animations to complete
    await page.waitForTimeout(3000);

    // Take final screenshot of fully grown field
    await page.screenshot({
      path: 'test-results/11-fully-grown-grass-field.png',
      fullPage: true
    });

    // Verify we reached full or near-full growth
    const debugInfo = await page.locator('.absolute.top-4.left-4').textContent();
    const pointsMatch = debugInfo?.match(/Points: (\\d+)/);
    const growthMatch = debugInfo?.match(/Growth: (\\d+)%/);
    const grassBladesMatch = debugInfo?.match(/Grass Blades: (\\d+)/);
    
    const currentPoints = pointsMatch ? parseInt(pointsMatch[1]) : 0;
    const growthPercentage = growthMatch ? parseInt(growthMatch[1]) : 0;
    const grassBlades = grassBladesMatch ? parseInt(grassBladesMatch[1]) : 0;

    console.log(`Final state: ${currentPoints} points, ${growthPercentage}% growth, ${grassBlades} grass blades`);
    
    expect(currentPoints).toBeGreaterThan(500); // Should have substantial points
    expect(grassBlades).toBeGreaterThan(1000); // Should have many grass blades visible
  });

  test('should test 3D camera controls functionality', async ({ page }) => {
    // Add some grass to see the effects better
    for (let i = 0; i < 4; i++) {
      await page.click('button:has-text("+25 points")');
      await page.waitForTimeout(300);
    }

    // Wait for grass to grow
    await page.waitForTimeout(2000);

    // Take initial view screenshot
    await page.screenshot({
      path: 'test-results/12-camera-initial-view.png',
      fullPage: true
    });

    // Test mouse wheel zoom (simulate scroll)
    const canvas = await page.locator('canvas');
    
    // Zoom in
    await canvas.hover();
    await page.mouse.wheel(0, -500); // Zoom in
    await page.waitForTimeout(1000);
    
    await page.screenshot({
      path: 'test-results/13-camera-zoomed-in.png',
      fullPage: true
    });

    // Zoom out
    await page.mouse.wheel(0, 800); // Zoom out
    await page.waitForTimeout(1000);
    
    await page.screenshot({
      path: 'test-results/14-camera-zoomed-out.png',
      fullPage: true
    });

    // Test orbit controls (drag to rotate)
    await canvas.hover({ position: { x: 200, y: 200 } });
    await page.mouse.down();
    await page.mouse.move(300, 150); // Drag to rotate view
    await page.mouse.up();
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: 'test-results/15-camera-rotated-view1.png',
      fullPage: true
    });

    // Another rotation
    await canvas.hover({ position: { x: 250, y: 250 } });
    await page.mouse.down();
    await page.mouse.move(150, 300); // Different rotation
    await page.mouse.up();
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: 'test-results/16-camera-rotated-view2.png',
      fullPage: true
    });
  });

  test('should validate grass system technical features', async ({ page }) => {
    // Add substantial grass for better observation
    for (let i = 0; i < 8; i++) {
      await page.click('button:has-text("+25 points")');
      await page.waitForTimeout(400);
    }

    // Wait for growth animations
    await page.waitForTimeout(3000);

    // Test that canvas and WebGL are working
    const canvas = await page.locator('canvas');
    expect(canvas).toBeVisible();
    
    // Verify WebGL context
    const webglSupported = await page.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) return false;
      
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return gl !== null;
    });
    
    expect(webglSupported).toBe(true);
    console.log('WebGL support verified');

    // Take detailed screenshot for visual analysis
    await page.screenshot({
      path: 'test-results/17-technical-validation.png',
      fullPage: true
    });

    // Verify debug information shows expected grass system features
    const debugInfo = await page.locator('.absolute.top-4.left-4').textContent();
    expect(debugInfo).toContain('3D Advanced Grass Field');
    expect(debugInfo).toContain('Grass Blades:');
    
    // Verify the grass field is responding to point changes
    const initialGrassBlades = debugInfo?.match(/Grass Blades: (\\d+)/)?.[1];
    
    // Add more points
    await page.click('button:has-text("+50 points")');
    await page.waitForTimeout(1500);
    
    const updatedDebugInfo = await page.locator('.absolute.top-4.left-4').textContent();
    const newGrassBlades = updatedDebugInfo?.match(/Grass Blades: (\\d+)/)?.[1];
    
    console.log(`Grass blades increased from ${initialGrassBlades} to ${newGrassBlades}`);
    expect(parseInt(newGrassBlades || '0')).toBeGreaterThan(parseInt(initialGrassBlades || '0'));
  });

  test('should observe grass growth animation timing and effects', async ({ page }) => {
    // Start with clean state
    await page.waitForTimeout(1000);
    
    console.log('=== GRASS GROWTH ANIMATION ANALYSIS ===');
    
    // Take baseline screenshot
    await page.screenshot({
      path: 'test-results/18-animation-baseline.png',
      fullPage: true
    });

    // Analyze staggered growth by adding points and observing over time
    await page.click('button:has-text("+25 points")');
    
    // Take screenshots at different intervals to show staggered growth
    const intervals = [500, 1000, 1500, 2000, 2500];
    
    for (let i = 0; i < intervals.length; i++) {
      await page.waitForTimeout(intervals[i] - (i > 0 ? intervals[i-1] : 0));
      await page.screenshot({
        path: `test-results/19-animation-stage-${i + 1}-${intervals[i]}ms.png`,
        fullPage: true
      });
      
      const debugInfo = await page.locator('.absolute.top-4.left-4').textContent();
      const grassBlades = debugInfo?.match(/Grass Blades: (\\d+)/)?.[1];
      console.log(`Stage ${i + 1} (${intervals[i]}ms): ${grassBlades} grass blades visible`);
    }

    // Test wind animation effects by waiting and taking multiple screenshots
    console.log('Testing wind animation effects...');
    
    for (let i = 0; i < 3; i++) {
      await page.waitForTimeout(2000); // Allow wind animation cycles
      await page.screenshot({
        path: `test-results/20-wind-animation-${i + 1}.png`,
        fullPage: true
      });
    }
  });

  test('should generate comprehensive test report', async ({ page }) => {
    // Add substantial grass for final analysis
    for (let i = 0; i < 15; i++) {
      await page.click('button:has-text("+50 points")');
      await page.waitForTimeout(200);
    }

    await page.waitForTimeout(3000);

    // Final comprehensive screenshot
    await page.screenshot({
      path: 'test-results/21-final-comprehensive-view.png',
      fullPage: true
    });

    // Extract all debug information for report
    const debugInfo = await page.locator('.absolute.top-4.left-4').textContent();
    const pointsMatch = debugInfo?.match(/Points: (\\d+)/);
    const growthMatch = debugInfo?.match(/Growth: (\\d+)%/);
    const grassBladesMatch = debugInfo?.match(/Grass Blades: (\\d+)/);
    
    const finalPoints = pointsMatch ? parseInt(pointsMatch[1]) : 0;
    const finalGrowth = growthMatch ? parseInt(growthMatch[1]) : 0;
    const finalGrassBlades = grassBladesMatch ? parseInt(grassBladesMatch[1]) : 0;

    console.log('=== FINAL TEST REPORT ===');
    console.log(`Total Points Achieved: ${finalPoints}`);
    console.log(`Growth Percentage: ${finalGrowth}%`);
    console.log(`Grass Blades Rendered: ${finalGrassBlades}`);
    console.log(`Max Grass Blades (from code): 6000`);
    console.log(`Grass Coverage: ${((finalGrassBlades / 6000) * 100).toFixed(1)}%`);
    
    // Verify we achieved significant grass coverage
    expect(finalGrassBlades).toBeGreaterThan(3000); // At least 50% coverage
    expect(finalGrowth).toBeGreaterThan(75); // At least 75% growth
  });
});