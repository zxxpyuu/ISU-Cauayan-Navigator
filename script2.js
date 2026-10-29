document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest('[data-auth-mode]');
    const container = button?.closest('.auth-page')?.querySelector('#container');

    if (!button || !container) return;

    container.classList.toggle('active', button.dataset.authMode === 'register');
});