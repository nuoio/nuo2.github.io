(() => {
    const themeButton = document.querySelector('.theme-toggle');
    const themeKey = 'community-island-theme';
    const isLocalFile = window.location.protocol === 'file:';
    const pageUrl = new URL(window.location.href);
    const linkedTheme = isLocalFile ? pageUrl.searchParams.get('theme') : null;

    let savedTheme;
    try {
        savedTheme = localStorage.getItem(themeKey);
    } catch {
        // The switch still works when browser storage is unavailable.
    }

    function applyTheme(theme) {
        const isNight = theme === 'night';
        document.documentElement.classList.toggle('night-mode', isNight);
        themeButton.textContent = isNight ? 'Day mode' : 'Night mode';

        // Local HTML files may not share storage. Carry the choice through site links.
        if (isLocalFile) {
            for (const link of document.querySelectorAll('a[href]')) {
                const href = link.getAttribute('href');
                if (!/^(?:\.\/)?[\w-]+\.html(?:\?[^#]*)?(?:#.*)?$/.test(href) && !href.startsWith('file:')) continue;
                const target = new URL(href, window.location.href);
                if (new URL('.', target).href !== new URL('.', window.location.href).href || !target.pathname.endsWith('.html')) continue;
                target.searchParams.set('theme', theme);
                link.href = target.href;
            }
        }
    }

    const initialTheme = linkedTheme === 'day' || linkedTheme === 'night' ? linkedTheme : savedTheme;
    applyTheme(initialTheme === 'night' ? 'night' : 'day');
    themeButton.hidden = false;

    themeButton.addEventListener('click', function() {
        const theme = document.documentElement.classList.contains('night-mode') ? 'day' : 'night';
        applyTheme(theme);

        try {
            localStorage.setItem(themeKey, theme);
        } catch {
            // The theme is already applied to the current page.
        }

        if (isLocalFile) {
            pageUrl.searchParams.set('theme', theme);
            try {
                history.replaceState(history.state, '', pageUrl);
            } catch {
                // The updated links still carry the selected theme.
            }
        }
    });
})();
