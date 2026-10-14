# Auto-scroll check: starts from the popup, scrolls, then pauses on a Facebook dialog.
import sys, os, shutil, json
from playwright.sync_api import sync_playwright
EXT = sys.argv[1]; HERE = os.path.dirname(os.path.abspath(__file__))
prof = os.path.join(HERE, 'profile2'); shutil.rmtree(prof, ignore_errors=True)
html = open(os.path.join(HERE, 'group.html'), encoding='utf-8').read()
with sync_playwright() as p:
    ctx = p.chromium.launch_persistent_context(prof, executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless=True,
        args=[f'--disable-extensions-except={EXT}', f'--load-extension={EXT}', '--headless=new'], viewport={'width': 1000, 'height': 800}, color_scheme='dark')
    ctx.route('https://www.facebook.com/**', lambda r: r.fulfill(status=200, content_type='text/html; charset=utf-8', body=html))
    sw = ctx.service_workers[0] if ctx.service_workers else ctx.wait_for_event('serviceworker')
    ext_id = sw.url.split('/')[2]
    pg = ctx.new_page(); pg.goto('https://www.facebook.com/groups/autoattiki/'); pg.wait_for_timeout(1500)
    pop = ctx.new_page(); pop.goto(f'chrome-extension://{ext_id}/popup/popup.html'); pop.wait_for_timeout(500)
    print(pop.evaluate("""async () => { const [t] = await chrome.tabs.query({url: 'https://www.facebook.com/*'}); return await chrome.tabs.sendMessage(t.id, {type: 'autoscroll', on: true}); }"""))
    pop.close(); pg.bring_to_front()
    y0 = pg.evaluate('scrollY'); pg.wait_for_timeout(9000)
    print('scrolled', y0, '->', pg.evaluate('scrollY'))
    print('overlay', pg.eval_on_selector('#cc-auto', 'e => [e.dataset.state, e.innerText]'))
    pg.screenshot(path=os.path.join(HERE, 'auto.png'))
    pg.evaluate("""() => { const d = document.createElement('div'); d.setAttribute('role','dialog'); d.style.cssText='position:fixed;top:100px;left:100px;width:400px;height:200px;background:#333;color:#fff'; d.textContent='Είσαι προσωρινά αποκλεισμένος'; document.body.append(d); }""")
    pg.wait_for_timeout(7000)
    print('after dialog', pg.eval_on_selector('#cc-auto', 'e => [e.dataset.state, e.innerText]'))
    pop = ctx.new_page(); pop.set_viewport_size({'width': 360, 'height': 900}); pop.goto(f'chrome-extension://{ext_id}/popup/popup.html'); pop.wait_for_timeout(800)
    pop.screenshot(path=os.path.join(HERE, 'popup-dark.png'), full_page=True)
    ctx.close()
