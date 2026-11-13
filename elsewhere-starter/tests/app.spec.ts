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
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Saved',exact:true}).click();await page.reload();await expect(page.locator('[data-place]:visible')).toHaveCount(1);
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
test('no JavaScript preserves content and truthful saved state',async({browser,baseURL})=>{
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto('/explore/');await expect(page.locator('[data-place]')).toHaveCount(8);await expect(page.locator('#category')).toBeVisible();await expect(page.locator('[data-save]:visible')).toHaveCount(0);await page.goto('/saved/');await expect(page.locator('[data-place]:visible')).toHaveCount(0);await context.close();
});
test('responsive pages have no horizontal overflow',async({page})=>{
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});for(const route of ['/','/explore/','/places/palm-and-paper-studio/','/saved/']){await page.goto(route);await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} at ${width}`).toBe(true);}}
});
test('invalid URL values fall back to defaults; hidden filters report their count',async({page})=>{
 await page.goto('/explore/?mode=Nap&category=Spa&wifi=true');await expect(page.getByRole('radio',{name:'Any',exact:true})).toBeChecked();await expect(page.getByLabel('Place type')).toHaveValue('');
 await page.setViewportSize({width:390,height:844});await expect(page.locator('#filter-toggle')).toContainText('1 active');
 await expect(page.locator('#result-count')).toHaveText(`${await page.locator('[data-place]:visible').count()} places`);
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
test('submit a new place: validation, local save and history',async({page})=>{
 await page.goto('/');await page.getByRole('banner').getByRole('link',{name:'Submit a place'}).click();
 await expect(page).toHaveURL(/\/submit\/$/);await expect(page.getByRole('banner').getByRole('link',{name:'Submit a place'})).toHaveAttribute('aria-current','page');
 await page.getByRole('button',{name:'Submit place'}).click();
 await expect(page.getByLabel('Place name')).toBeFocused();await expect(page.getByLabel('Place name')).toHaveAttribute('aria-invalid','true');
 await page.getByLabel('Place name').fill('Window Seat Café');await page.getByLabel('Neighbourhood').fill('Al Barsha');
 await page.getByRole('group',{name:'Wi-Fi'}).getByRole('radio',{name:'Yes',exact:true}).check();
 await page.getByRole('button',{name:'Submit place'}).click();
 await expect(page.getByRole('heading',{name:'Report saved.'})).toBeFocused();
 await expect(page.locator('#done-text')).toContainText('saved in this browser');
 await expect(page.locator('#my-reports li')).toHaveCount(1);await expect(page.locator('#my-reports li')).toContainText('Window Seat Café');
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('elsewhere:submissions:v1')!));
 expect(stored[0]).toMatchObject({kind:'new',placeId:null,neighbourhood:'Al Barsha',delivery:'device',amenities:{wifi:'yes',power:'unsure'}});
 await page.getByRole('button',{name:'Submit another'}).click();await expect(page.getByLabel('Place name')).toHaveValue('');await expect(page.getByLabel('Place name')).toBeFocused();
});
test('report on a listed place from its page; future dates are refused',async({page})=>{
 await page.goto('/places/the-long-table-works/');await page.getByRole('link',{name:'Report what you found'}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Report on The Long Table Works.');
 await expect(page.getByLabel('Place name')).toHaveValue('The Long Table Works');await expect(page.getByLabel('Neighbourhood')).toHaveValue('JLT');
 await page.getByLabel('When were you there?').evaluate((el:HTMLInputElement)=>{el.removeAttribute('max');el.value='2999-01-01'});
 await page.getByRole('button',{name:'Send report'}).click();await expect(page.locator('#visitedOn-error')).toBeVisible();
 await page.getByLabel('When were you there?').fill('2026-11-01');await page.getByRole('button',{name:'Send report'}).click();
 await expect(page.locator('#done-text')).toContainText('The Long Table Works');await expect(page.getByRole('link',{name:'Back to The Long Table Works'})).toHaveAttribute('href','/places/the-long-table-works/');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('elsewhere:submissions:v1')!)[0].kind)).toBe('update');
});
test('with an endpoint, reports are POSTed; failures keep the form',async({page})=>{
 let calls=0;let body:any=null;
 await page.route('https://example.invalid/reports',async r=>{calls++;body=r.request().postDataJSON();await r.fulfill(calls===1?{status:500,body:''}:{status:200,contentType:'application/json',body:'{}'})});
 // Simulates a build with PUBLIC_SUBMIT_ENDPOINT set; the script reads it at submit time.
 await page.goto('/submit/');await page.locator('#submit-form').evaluate((f:HTMLFormElement)=>{f.dataset.endpoint='https://example.invalid/reports'});
 await page.getByLabel('Place name').fill('Dock Desk');await page.getByLabel('Neighbourhood').fill('Dubai Marina');
 await page.getByRole('button',{name:'Submit place'}).click();await expect(page.locator('#form-error')).toContainText('couldn’t send');await expect(page.getByLabel('Place name')).toHaveValue('Dock Desk');
 await page.getByRole('button',{name:'Submit place'}).click();await expect(page.getByRole('heading',{name:'Thanks, that’s in.'})).toBeFocused();await expect(page.locator('#done-text')).toContainText('We’ll review');
 expect(calls).toBe(2);expect(body).toMatchObject({version:1,kind:'new',name:'Dock Desk',neighbourhood:'Dubai Marina'});
 await expect(page.locator('#my-reports li .pill')).toHaveText('Sent');
});
test('featured carousel moves between five places and keeps hidden slides out of reach',async({page})=>{
 await page.goto('/');const region=page.getByRole('region',{name:'Featured places'});await expect(region.locator('.slide')).toHaveCount(5);
 await expect(region.locator('[data-evidence]')).toHaveCount(0);
 await expect(region.getByRole('link',{name:/The Long Table Works/})).toBeVisible();
 await region.getByRole('button',{name:'Next place'}).click();await expect(region.locator('[data-dot="1"]')).toHaveAttribute('aria-current','true');
 await expect(region.locator('[data-carousel-status]')).toHaveText('2 of 5: Palm & Paper Studio');
 await expect(region.locator('.slide').nth(0)).toHaveJSProperty('inert',true);
 await region.getByRole('button',{name:'Previous place'}).click();await region.getByRole('button',{name:'Previous place'}).click();
 await expect(region.locator('[data-dot="4"]')).toHaveAttribute('aria-current','true');
 await region.getByRole('button',{name:'Show The Long Table Works'}).click();await expect(region.locator('[data-dot="0"]')).toHaveAttribute('aria-current','true');
 await region.getByRole('link',{name:/The Long Table Works/}).click();await expect(page).toHaveURL(/\/places\/the-long-table-works\/$/);
});
test('Wi-Fi speed, access and usual hours read as dated facts, never as live status',async({page})=>{
 await page.goto('/explore/');const card=page.locator('[data-place="demo-06"]');
 await expect(card).toContainText('112 Mbps');await expect(card).toContainText('tested 20 Oct');await expect(card).toContainText('No password');await expect(card).toContainText('Usually 6 am – 1 am today');
 await expect(page.locator('[data-place="demo-05"]')).toContainText('needs retest');
 await expect(page.locator('[data-place="demo-01"]')).not.toContainText('Speed not tested');
 await expect(page.locator('[data-place="demo-02"]')).toContainText('Speed not tested');
 await expect(page.locator('body')).not.toContainText(/open now|password:/i);
 await page.goto('/places/creekside-common-room/');
 await expect(page.locator('.wifi-details')).toContainText('112 Mbps down · 41 Mbps up · Plenty for video calls');
 await expect(page.locator('.week [aria-current="date"]')).toHaveCount(1);await expect(page.locator('.today-line')).toHaveText('Usually 6 am – 1 am today');
 await page.goto('/submit/');await page.getByLabel('Place name').fill('Test Café');await page.getByLabel('Neighbourhood').fill('JLT');
 await page.getByLabel(/Wi-Fi download speed/).fill('fast');await page.getByRole('button',{name:/Submit place/}).click();
 await expect(page.getByLabel(/Wi-Fi download speed/)).toBeFocused();await expect(page.locator('#wifiSpeed-error')).toBeVisible();
 await page.getByLabel(/Wi-Fi download speed/).fill('42,5');await page.getByLabel('Getting on the Wi-Fi').selectOption('signup');await page.getByRole('button',{name:/Submit place/}).click();
 await expect(page.getByRole('heading',{name:'Report saved.'})).toBeVisible();
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('elsewhere:submissions:v1')!)[0]);expect(stored.wifiDownMbps).toBe(42.5);expect(stored.wifiAccess).toBe('signup');
});
