/**
 * form.js — contact form validation and submission.
 *
 * Validation runs on blur, not input: correcting someone mid-way through their
 * own email address is hostile. Spam is caught by a honeypot and a timestamp
 * rather than a CAPTCHA, which taxes the person you want to hear from.
 *
 * The endpoint comes from data-endpoint on the <form>, so adding a real form endpoint
 * is an HTML change rather than a JS edit. While it is empty the form validates
 * and says nothing was sent — it does not fake success. Voeg later een echt verzendadres toe.
 */

const MIN_FILL_SECONDS = 3;

const RULES = {
  naam: {
    test: (value) => value.trim().length >= 2,
    message: 'Vul je naam in, ook als het maar een voornaam is.',
  },
  email: {
    // Deliberately loose. The only authority on whether an address works is
    // the mail server, and over-strict patterns reject valid addresses.
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    message: 'Dit adres mist een @ of een punt. Kijk het even na.',
  },
  bericht: {
    test: (v) => v.trim().length >= 10,
    message: 'Schrijf een zin of twee over wat je nodig hebt.',
  },
};

export function initForm(form) {
  const endpoint = form.dataset.endpoint || '';
  const success = document.querySelector('.form-success');
  const status = form.querySelector('[data-form-status]');
  const loadedAt = Date.now();

  const errorOf = (input) => {
    const field = input.closest('.form-field');
    return field ? field.querySelector('.form-error') : null;
  };

  const showError = (input, message) => {
    const error = errorOf(input);
    input.setAttribute('aria-invalid', 'true');
    if (!error) return;
    const text = error.querySelector('[data-error-text]');
    if (text) text.textContent = message;
    error.dataset.visible = 'true';
  };

  const clearError = (input) => {
    const error = errorOf(input);
    input.setAttribute('aria-invalid', 'false');
    if (error) error.dataset.visible = 'false';
  };

  const validate = (input) => {
    const rule = RULES[input.name];
    if (!rule) return true;
    if (input.name === 'bericht' || input.required || input.value.trim()) {
      if (!rule.test(input.value)) {
        showError(input, rule.message);
        return false;
      }
    }
    clearError(input);
    return true;
  };

  const inputs = Array.from(form.querySelectorAll('input, textarea')).filter(
    (input) => RULES[input.name]
  );

  inputs.forEach((input) => {
    input.addEventListener('blur', () => validate(input));
    // Once marked wrong, re-check while typing so the error clears as soon as
    // it stops being true.
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') validate(input);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const results = inputs.map(validate);
    if (results.includes(false)) {
      const firstBad = inputs.find(
        (input) => input.getAttribute('aria-invalid') === 'true'
      );
      if (firstBad) firstBad.focus();
      return;
    }

    // A real person never sees this field, so anything in it is a bot.
    const trap = form.querySelector('[name="website"]');
    if (trap && trap.value) return;

    // Too fast to have been typed by a human.
    if ((Date.now() - loadedAt) / 1000 < MIN_FILL_SECONDS) return;

    const button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true;
    if (status) status.textContent = 'Bezig met versturen…';

    if (!endpoint) {
      if (status) {
        status.textContent =
          'Er is nog geen verzendadres ingesteld, dus dit bericht is niet verstuurd. ' +
          'Voeg later een echt verzendadres toe.';
      }
      if (button) button.disabled = false;
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);

      form.dataset.submitted = 'true';
      if (success) {
        success.dataset.visible = 'true';
        const char = success.querySelector('.char-inner');
        if (char) char.classList.add('is-rising');
        const heading = success.querySelector('h2, h3');
        if (heading) heading.focus();
      }
    } catch (error) {
      if (status) {
        status.textContent =
          'Het versturen lukte niet. Probeer het later opnieuw.';
      }
      if (button) button.disabled = false;
    }
  });
}
