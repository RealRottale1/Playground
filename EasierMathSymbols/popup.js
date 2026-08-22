async function wait(duration) { return new Promise((complete) => { setTimeout(() => { complete(); }, duration); }) }


async function getWebPage() {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: ()=> {
            const sqrtButton = document.querySelector('[title="Square root"]');
            const rootButton = document.querySelector('[title="Root"]');
            const infButton = document.querySelector('[title="Infinity"]');
            const piButton = document.querySelector('[title="Pi"]');
            const thetaButton = document.querySelector('[title="Theta"]');

            const validShortcuts = ["sqrt", "root", "inf", "pi", "theta"];
            const shortCutButtons = [sqrtButton, rootButton, infButton, piButton, thetaButton];

            for (const shortCutButton of shortCutButtons) {
                if (shortCutButton == null) {
                    return false;
                }
            }

            if (window.__mathShortcutListenerActive == true) return;
            window.__mathShortcutListenerActive = true;

            async function runShortCut(shortCut) {
                const target = document.querySelector('.mq-textarea textarea') || document.activeElement;
                for (let i = 0; i < shortCut.length; i++) {
                    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', keyCode: 8, bubbles: true }));
                    target.dispatchEvent(new KeyboardEvent('keyup', { key: 'Backspace', keyCode: 8, bubbles: true }));
                }
                shortCutButtons[validShortcuts.indexOf(shortCut)].click();
            }

            const keyInputs = [];
            document.addEventListener("keydown", async (event)=> {
                keyInputs.push(event.key);

                async function wait(duration) { return new Promise((complete) => { setTimeout(() => { complete(); }, duration); }) }
                await wait(100);

                let k = keyInputs.length-1;
                for (let i = 0; i < validShortcuts.length; i++) {
                    const shortCut = validShortcuts[i];
                    k = keyInputs.length-1;
                    if (k < shortCut.length-1) {
                        continue;
                    }
                    let matched = true;
                    for (let j = shortCut.length-1; j >= 0; j--) {
                        if (shortCut[j] != keyInputs[k]) {
                            matched = false;
                            break;
                        }
                        k--;
                    }
                    if (matched) {
                        runShortCut(shortCut);
                        keyInputs.length = 0;
                        break;
                    };
                }
            });
        }
    });
}

getWebPage();