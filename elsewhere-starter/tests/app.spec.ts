import {test,expect} from '@playwright/test';
test('discover search, URL restoration, filters and reset',async({page})=>{
 await page.goto('/');await page.getByLabel('Find a place or neighbourhood').fill('JLT');await page.getByRole('search').getByRole('button',{name:'Search',exact:true}).click();
 await expect(page.locator('#q')).toHaveValue('JLT');await expect(page.locator('[data-place]:visible')).toHaveCount(2);
 await page.getByLabel('Place type').selectOption('Co-working');await expect(page.locator('[data-place]:visible')).toHaveCount(1);
 await page.goBack();await expect(page.getByLabel('Place type')).toHaveValue('');await expect(page.locator('[data-place]:visible')).toHaveCount(2);
 await page.locator('#q').fill('no-such-spot');await page.getByRole('button',{name:'Search',exact:true}).click();await expect(page.locator('#empty')).toBeVisible();
 await page.getByRole('button',{name:'Clear filters',exact:true}).click();await expect(page.locator('[data-place]:visible')).toHaveCount(8);
});
test('all work modes have usable direct routes',async({page})=>{
 for(const mode of ['Focus','Casual','Meetings','Together']){await page.goto(`/?test=${mode}`);await page.locator('.mode-grid').getByRole('link',{name:new RegExp(mode)}).click();await expect(page.getByRole('radio',{name:mode,exact:true})).toBeChecked();expect(await page.locator('[data-place]:visible').count()).toBeGreaterThan(0);}
});
test('save, reload, remove and focus empty action',async({page})=>{
 await page.goto('/explore/');await page.getByRole('button',{name:'Save Palm & Paper Studio',exact:true}).click();await expect(page.getByRole('button',{name:'Remove Palm & Paper Studio from saved places'})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('link',{name:'Saved',exact:true}).click();await page.reload();await expect(page.locator('[data-place]:visible')).toHaveCount(1);
 await page.getByRole('button',{name:'Remove Palm & Paper Studio from saved places'}).click();await expect(page.locator('#empty')).toBeVisible();await expect(page.locator('#empty a')).toBeFocused();
});
test('blocked storage gives temporary-save feedback',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(Storage.prototype,'setItem',{value(){throw new Error('blocked')}});});
 await page.goto('/explore/');await page.getByRole('button',{name:'Save Palm & Paper Studio',exact:true}).click();await expect(page.locator('#app-status')).toContainText('this page only');
 await page.goto('/saved/');await expect(page.locator('#storage-note')).toContainText('unavailable');
});
test('cross-tab saves and clearing update other tab',async({page,context})=>{
 await page.goto('/saved/');const second=await context.newPage();await second.goto('/explore/');await second.getByRole('button',{name:'Save Palm & Paper Studio',exact:true}).click();await expect(page.locator('[data-place]:visible')).toHaveCount(1);
 await second.evaluate(()=>localStorage.clear());await expect(page.locator('#empty')).toBeVisible();
});
test('detail evidence, demo directions and 404',async({page})=>{
 await page.goto('/places/palm-and-paper-studio/');await expect(page.locator('[data-evidence]')).toHaveCount(5);
 const link=page.getByRole('link',{name:/Neighbourhood directions/});await expect(link).toHaveAttribute('href',/destination=JVC/);await expect(link).toHaveAttribute('target','_blank');
 const response=await page.goto('/places/no-such-place/');expect(response?.status()).toBe(404);
});
test('no JavaScript preserves content and truthful saved state',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto('http://localhost:4321/explore/');await expect(page.locator('[data-place]')).toHaveCount(8);await expect(page.locator('#category')).toBeVisible();await expect(page.locator('[data-save]:visible')).toHaveCount(0);await page.goto('http://localhost:4321/saved/');await expect(page.locator('[data-place]:visible')).toHaveCount(0);await context.close();
});
test('responsive pages have no horizontal overflow',async({page})=>{
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});for(const route of ['/','/explore/','/places/palm-and-paper-studio/','/saved/']){await page.goto(route);await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} at ${width}`).toBe(true);}}
});
test('invalid URL values fall back to defaults; hidden filters report their count',async({page})=>{
 await page.goto('/explore/?mode=Nap&category=Spa&wifi=true');await expect(page.getByRole('radio',{name:'Any',exact:true})).toBeChecked();await expect(page.getByLabel('Place type')).toHaveValue('');
 await page.setViewportSize({width:390,height:844});await expect(page.locator('#filter-toggle')).toContainText('1 active');
 await expect(page.locator('#result-count')).toHaveText(`${await page.locator('[data-place]:visible').count()} matching fictional places`);
});
test('cards and Saved comparison show per-amenity evidence states',async({page})=>{
 await page.goto('/explore/');const card=page.locator('[data-place="demo-05"]');await expect(card.locator('[data-evidence="power"]')).toHaveAttribute('data-tone','caution');await expect(card.locator('[data-evidence="power"]')).toContainText('Needs recheck');
 await page.getByRole('button',{name:'Save The Long Table Works',exact:true}).click();await page.goto('/saved/');
 await expect(page.locator('#compare')).toBeVisible();await expect(page.locator('[data-compare]:visible')).toHaveCount(1);await expect(page.locator('[data-compare="demo-03"] [data-evidence]')).toHaveCount(5);
 await page.getByRole('button',{name:'Remove The Long Table Works from saved places'}).click();await expect(page.locator('#compare')).toBeHidden();
});
test('icon controls keep their icons and accessible text after state changes',async({page})=>{
 await page.goto('/places/palm-and-paper-studio/');
 await expect(page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Explore'})).toHaveAttribute('aria-current','true');
 const save=page.getByRole('button',{name:'Save Palm & Paper Studio',exact:true});
 await expect(save.locator('svg.icon')).toHaveCount(2);await save.click();
 const saved=page.getByRole('button',{name:'Remove Palm & Paper Studio from saved places'});
 await expect(saved).toHaveAttribute('aria-pressed','true');await expect(saved.locator('.save-text')).toHaveText('Saved');
 await expect(saved.locator('svg.icon')).toHaveCount(2);await expect(saved.locator('.heart-on')).toBeVisible();
 await page.goto('/explore/');const pill=page.locator('[data-place="demo-05"] [data-evidence="power"]');
 await expect(pill.locator('svg.icon')).toHaveCount(1);await expect(pill).toContainText('Power sockets');await expect(pill.locator('[data-evidence-label]')).toHaveText('Yes · Needs recheck');
});
test('submit a place link opens an honest, non-submitting page',async({page})=>{
 await page.goto('/');await page.getByRole('banner').getByRole('link',{name:'Submit a place'}).click();
 await expect(page).toHaveURL(/\/submit\/$/);await expect(page.getByRole('heading',{level:1})).toHaveText('Submit a place.');
 await expect(page.getByText('Submissions aren’t open in this demo.')).toBeVisible();await expect(page.locator('main form')).toHaveCount(0);
 await expect(page.getByRole('banner').getByRole('link',{name:'Submit a place'})).toHaveAttribute('aria-current','page');
});
