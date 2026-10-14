import json, sys, shutil, os
from playwright.sync_api import sync_playwright
EXT = sys.argv[1]; HERE = os.path.dirname(os.path.abspath(__file__))
prof = os.path.join(HERE, 'profile'); shutil.rmtree(prof, ignore_errors=True)
pages = {'group': open(os.path.join(HERE,'group.html'),encoding='utf-8').read(), 'market': open(os.path.join(HERE,'market.html'),encoding='utf-8').read()}
with sync_playwright() as p:
    ctx = p.chromium.launch_persistent_context(prof, executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless=True,
        args=[f'--disable-extensions-except={EXT}', f'--load-extension={EXT}', '--headless=new'], viewport={'width':1000,'height':900})
    def route(r):
        u = r.request.url
        body = pages['market'] if '/marketplace' in u else pages['group']
        r.fulfill(status=200, content_type='text/html; charset=utf-8', body=body)
    ctx.route('https://www.facebook.com/**', route)
    sw = ctx.service_workers[0] if ctx.service_workers else ctx.wait_for_event('serviceworker')
    ext_id = sw.url.split('/')[2]
    pg = ctx.new_page()
    pg.on('console', lambda m: print('console:', m.text))
    pg.goto('https://www.facebook.com/groups/autoattiki/')
    pg.wait_for_timeout(2000)
    print('chips after load:', pg.eval_on_selector_all('.cc-chip', 'els => els.map(e => e.dataset.label)'))
    pg.mouse.wheel(0, 2600); pg.wait_for_timeout(2000)
    print('chips after scroll:', pg.eval_on_selector_all('.cc-chip', 'els => els.map(e => e.dataset.label)'))
    pg.screenshot(path=os.path.join(HERE,'group.png'))
    pg.goto('https://www.facebook.com/marketplace/category/vehicles'); pg.wait_for_timeout(2000)
    data = sw.evaluate('chrome.storage.local.get(null)')
    posts = {k:v for k,v in data.items() if k.startswith('p:')}
    for k,v in posts.items():
        print(k, json.dumps({x:v[x] for x in ('parsed','prices','sold','offers','missing','days','groupName')}, ensure_ascii=False))
        print('   text:', v['text'][:160].replace('\n',' / '))
    print('stats', data.get('stats'), 'groups', data.get('groups'))
    pop = ctx.new_page(); pop.set_viewport_size({'width':360,'height':700})
    pop.goto(f'chrome-extension://{ext_id}/popup/popup.html'); pop.wait_for_timeout(800)
    pop.screenshot(path=os.path.join(HERE,'popup.png'), full_page=True)
    with pop.expect_download() as d: pop.click('#csv')
    d.value.save_as(os.path.join(HERE,'out.csv'))
    ctx.close()
