/*
 * neobrutalism-css — optional behavior helper (~1KB)
 *
 * Pure vanilla, zero dependencies, no build required. Drop it in with a
 * <script> tag (or import it) and it auto-wires modals and dropdowns declared
 * with data attributes. The CSS works fully without this file — the helper
 * only adds open/close behavior.
 *
 *   Modal:    <button data-nb-open="#id">…   <div class="nb-modal" id="id" hidden>…
 *             close with [data-nb-close] inside, Esc, or backdrop click.
 *   Dropdown: <div class="nb-dropdown"><button data-nb-toggle>…</button>
 *             <div class="nb-dropdown__panel">…</div></div>
 *             closes on outside-click and Esc.
 *
 * Re-runnable: call window.Neobrutalism.init() after injecting new markup.
 */
(function (root) {
    'use strict';

    function openModal(modal) {
        if (!modal) return;
        modal.removeAttribute('hidden');
        // Force reflow so the transition runs from the hidden state.
        void modal.offsetWidth;
        modal.classList.add('is-open');
        document.documentElement.classList.add('nb-modal-open');
        var focusable = modal.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable) focusable.focus();
    }

    function closeModal(modal) {
        if (!modal || !modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open');
        document.documentElement.classList.remove('nb-modal-open');
        var onEnd = function () {
            modal.setAttribute('hidden', '');
            modal.removeEventListener('transitionend', onEnd);
        };
        modal.addEventListener('transitionend', onEnd);
        // Fallback if transitionend doesn't fire (reduced motion, display swap).
        setTimeout(onEnd, 250);
    }

    function closeAllDropdowns(except) {
        var open = document.querySelectorAll('.nb-dropdown.is-open');
        for (var i = 0; i < open.length; i++) {
            if (open[i] !== except) open[i].classList.remove('is-open');
        }
    }

    function onClick(e) {
        // Open a modal.
        var opener = e.target.closest('[data-nb-open]');
        if (opener) {
            e.preventDefault();
            openModal(document.querySelector(opener.getAttribute('data-nb-open')));
            return;
        }

        // Close a modal (explicit close button or backdrop click).
        var closer = e.target.closest('[data-nb-close]');
        if (closer) {
            e.preventDefault();
            closeModal(closer.closest('.nb-modal'));
            return;
        }
        if (e.target.classList && e.target.classList.contains('nb-modal')) {
            closeModal(e.target); // clicked the backdrop itself
            return;
        }

        // Toggle a dropdown.
        var toggle = e.target.closest('[data-nb-toggle]');
        if (toggle) {
            e.preventDefault();
            var dd = toggle.closest('.nb-dropdown');
            var willOpen = dd && !dd.classList.contains('is-open');
            closeAllDropdowns(dd);
            if (dd) dd.classList.toggle('is-open', willOpen);
            return;
        }

        // Click outside any open dropdown closes them.
        if (!e.target.closest('.nb-dropdown')) {
            closeAllDropdowns(null);
        }
    }

    function onKeydown(e) {
        if (e.key !== 'Escape' && e.key !== 'Esc') return;
        closeAllDropdowns(null);
        var open = document.querySelector('.nb-modal.is-open');
        if (open) closeModal(open);
    }

    function init() {
        // Idempotent: listeners are attached once to the document.
        document.removeEventListener('click', onClick, true);
        document.addEventListener('click', onClick, true);
        document.removeEventListener('keydown', onKeydown);
        document.addEventListener('keydown', onKeydown);
    }

    var api = { init: init, open: openModal, close: closeModal };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    root.Neobrutalism = api;

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }
})(typeof window !== 'undefined' ? window : this);
