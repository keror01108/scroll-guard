/**
 * Scroll Guard 1.0.0
 * Combines the two temporary fixes verified by the user.
 * No source-file edits, network requests, or persistent data writes.
 */
const STATE_KEY = '__stScrollGuardV1';

function install() {
    if (window[STATE_KEY]?.active) return;

    const originalScrollIntoView = Element.prototype.scrollIntoView;
    const originalFocus = HTMLElement.prototype.focus;
    const state = {
        active: true,
        version: '1.0.0',
        qrCorrections: 0,
        copyCorrections: 0,
        uninstall,
    };

    function scrollIntoView(...args) {
        if (!state.active || !this.matches('#qrm-drawer .qrm-set-tab')) {
            return originalScrollIntoView.apply(this, args);
        }

        const strip = this.closest('.qrm-set-strip');
        if (!strip) return originalScrollIntoView.apply(this, args);

        // The original QR extension centers the selected tab after rerendering.
        // Move only its horizontal strip, never its ancestors or the viewport.
        const tabRect = this.getBoundingClientRect();
        const stripRect = strip.getBoundingClientRect();
        const stripCenter = stripRect.left + strip.clientLeft + strip.clientWidth / 2;
        strip.scrollLeft += tabRect.left + tabRect.width / 2 - stripCenter;
        state.qrCorrections++;
    }

    function focus(...args) {
        // This is the temporary textarea created by the converter's fallback
        // clipboard routine. Ordinary editors and chat input do not match.
        const isCopyBox = state.active
            && this instanceof HTMLTextAreaElement
            && this.parentElement === document.body
            && this.style.position === 'fixed'
            && this.style.opacity === '0'
            && this.style.pointerEvents === 'none';

        if (!isCopyBox) return originalFocus.apply(this, args);

        Object.assign(this.style, {
            top: '0px',
            left: '0px',
            width: '1px',
            height: '1px',
            margin: '0',
            padding: '0',
            fontSize: '16px',
        });
        this.readOnly = true;
        state.copyCorrections++;
        return originalFocus.call(this, { ...(args[0] || {}), preventScroll: true });
    }

    function uninstall() {
        // Also disable our behavior if another extension has wrapped our wrapper.
        state.active = false;
        if (Element.prototype.scrollIntoView === scrollIntoView) {
            Element.prototype.scrollIntoView = originalScrollIntoView;
        }
        if (HTMLElement.prototype.focus === focus) {
            HTMLElement.prototype.focus = originalFocus;
        }
    }

    Element.prototype.scrollIntoView = scrollIntoView;
    HTMLElement.prototype.focus = focus;
    window[STATE_KEY] = state;
    console.info('[화면 밀림 보정] QR · HTML 복사 보정 적용 (1.0.0)');
}

export function onEnable() {
    install();
}

export function onDisable() {
    window[STATE_KEY]?.uninstall();
}

// Immediate setup also supports loaders that do not invoke lifecycle hooks.
install();
