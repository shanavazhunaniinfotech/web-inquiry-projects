/* Sell HOU 2 You Team — shared lead-capture modals, sticky mobile bar and toast.
   Same funnels in both versions; each version styles them in its own CSS. */
(function () {
  var consent = '<label class="chk"><input type="checkbox" name="consent" required><span>I agree to be contacted by the Sell HOU 2 You Team by call or text about my inquiry. Consent isn’t a condition of service. Msg &amp; data rates may apply. Reply STOP to opt out.</span></label>';
  var contact = function (btn) {
    return '<div class="fld"><input name="name" type="text" placeholder=" " autocomplete="name" required><label>Full name</label></div>' +
      '<div class="fld"><input name="email" type="email" placeholder=" " autocomplete="email" required><label>Email</label></div>' +
      '<div class="fld"><input name="phone" type="tel" placeholder=" " autocomplete="tel" required><label>Mobile number</label></div>' +
      consent +
      '<div class="step-nav"><button type="button" class="btn btn-ghost" data-prev>Back</button><button type="submit" class="btn btn-primary">' + btn + '</button></div>';
  };
  var opts = function (name, list, stack) {
    return '<div class="opts' + (stack ? ' opts-stack' : '') + '">' + list.map(function (o) {
      return '<label><input type="radio" name="' + name + '" value="' + o + '" required><span>' + o + '</span></label>';
    }).join('') + '</div>';
  };
  var next = '<div class="step-nav"><button type="button" class="btn btn-ghost" data-prev>Back</button><button type="button" class="btn btn-primary" data-next>Continue</button></div>';
  var done = function (title, text) {
    return '<div class="step step-done" data-step="done"><div class="done-mark" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-15"/></svg></div>' +
      '<h3>' + title + '<span data-fill-name></span>!</h3><p>' + text + '</p><a class="btn btn-primary btn-block" href="tel:+18326930123">Can’t wait? Call 832-693-0123</a></div>';
  };
  var modal = function (id, kicker, body, wide) {
    return '<div class="modal' + (wide ? ' modal-wide' : '') + '" id="m-' + id + '" role="dialog" aria-modal="true" aria-labelledby="mt-' + id + '" aria-hidden="true">' +
      '<div class="modal-bg" data-close></div><div class="modal-panel">' +
      '<div class="modal-bar"><span data-progress></span></div>' +
      '<button type="button" class="modal-x" data-close aria-label="Close">×</button>' +
      '<p class="modal-kicker">' + kicker + '</p><p class="modal-step" data-step-label></p>' + body + '</div></div>';
  };

  var html = '';

  html += modal('valuation', 'Free home value report',
    '<form data-steps novalidate>' +
    '<div class="step" data-step="1"><h3 id="mt-valuation">Where’s the home you’re thinking of selling?</h3>' +
    '<div class="fld"><input name="address" type="text" placeholder=" " autocomplete="street-address" required><label>Property address</label></div>' +
    '<button type="button" class="btn btn-primary btn-block" data-next>Continue</button><p class="micro">Real local comps from a Realtor®, not a robot guess.</p></div>' +
    '<div class="step" data-step="2"><h3>Tell us a little about it.</h3><p class="q">Bedrooms</p>' + opts('beds', ['2', '3', '4', '5+']) +
    '<p class="q">Condition</p>' + opts('condition', ['Move-in ready', 'Needs a little love', 'Needs work']) + next + '</div>' +
    '<div class="step" data-step="3" data-auto><h3>When are you hoping to sell?</h3>' + opts('timeline', ['As soon as possible', 'In 1–3 months', 'In 3–6 months', 'Just curious about my value'], true) + '<div class="step-nav"><button type="button" class="btn btn-ghost" data-prev>Back</button></div></div>' +
    '<div class="step" data-step="4"><h3>Where should we send your report?</h3>' + contact('Get my home value') + '</div>' +
    done('You’re all set', 'Colby is pulling the comparable sales for your home now. Expect your personal price range within 24 hours, usually sooner.') +
    '</form>');

  html += modal('report', 'Free market report',
    '<form data-steps novalidate>' +
    '<div class="step" data-step="1"><h3 id="mt-report">Which market do you want to watch?</h3>' +
    opts('area', ['Katy', 'Fulshear', 'Richmond', 'Cypress', 'Sugar Land', 'Houston']) +
    '<p class="q">I’m mostly interested in</p>' + opts('interest', ['Selling', 'Buying', 'Investing']) +
    '<button type="button" class="btn btn-primary btn-block" data-next>Continue</button><p class="micro">Average list price, price reductions, new listings and days on market, every month.</p></div>' +
    '<div class="step" data-step="2"><h3>Where should we send it?</h3>' + contact('Send my free report') + '</div>' +
    done('Your report is on its way', 'Check your inbox for this month’s market report. We’ll send a fresh one every month. Unsubscribe anytime.') +
    '</form>');

  html += modal('preapproval', 'Get pre-approved',
    '<form data-steps novalidate>' +
    '<div class="step" data-step="1" data-auto><h3 id="mt-preapproval">What price range are you shopping in?</h3>' +
    opts('budget', ['Under $350K', '$350K–$500K', '$500K–$750K', '$750K–$1M', '$1M+'], true) + '</div>' +
    '<div class="step" data-step="2"><h3>A couple of quick details.</h3><p class="q">Estimated credit</p>' + opts('credit', ['Excellent', 'Good', 'Fair', 'Not sure']) +
    '<p class="q">First-time buyer?</p>' + opts('first', ['Yes', 'No']) + next + '</div>' +
    '<div class="step" data-step="3"><h3>Who should our lending partner contact?</h3>' + contact('Start my pre-approval') + '</div>' +
    done('Great start', 'Our trusted lending partners offer low rates, low fees and local underwriting. Expect a call within one business day.') +
    '</form>');

  html += modal('ask', 'Ask your agent',
    '<form data-steps novalidate data-toast="Thanks {name}! Colby or Kaylon will reply shortly.">' +
    '<div class="step" data-step="1"><h3 id="mt-ask">How can we help?</h3>' +
    '<div class="fld"><select name="topic" required><option value="" disabled selected></option><option>Schedule a showing</option><option>Ask a property question</option><option>Selling my home</option><option>Buying a home</option><option>Renting</option><option>Something else</option></select><label>Topic</label></div>' +
    '<div class="fld"><textarea name="message" rows="3" placeholder=" " required></textarea><label>Your message</label></div>' +
    '<div class="fld"><input name="name" type="text" placeholder=" " autocomplete="name" required><label>Full name</label></div>' +
    '<div class="fld-row"><div class="fld"><input name="email" type="email" placeholder=" " autocomplete="email" required><label>Email</label></div>' +
    '<div class="fld"><input name="phone" type="tel" placeholder=" " autocomplete="tel" required><label>Mobile</label></div></div>' +
    consent + '<button type="submit" class="btn btn-primary btn-block">Send message</button></div>' +
    done('Message sent', 'A real person (usually Colby) will get back to you within the hour during business hours.') +
    '</form>');

  html += modal('guide', 'Free download',
    '<div class="guide-art" aria-hidden="true"><div class="book"><small>2026 Edition</small><strong>The Katy Family <em>Relocation</em> Guide</strong><span>Sell HOU 2 You Team</span></div></div>' +
    '<form data-steps data-guide novalidate data-toast="Thanks {name}! Your Katy Family Guide is on its way.">' +
    '<div class="step" data-step="1"><h3 id="mt-guide">Moving to Katy with kids? Get the guide.</h3>' +
    '<p class="lede">Neighborhoods, school zones, commutes, HOA fees and our family’s favorite parks and restaurants.</p>' +
    '<div class="fld"><input name="name" type="text" placeholder=" " autocomplete="given-name" required><label>First name</label></div>' +
    '<div class="fld"><input name="email" type="email" placeholder=" " autocomplete="email" required><label>Email</label></div>' +
    '<button type="submit" class="btn btn-primary btn-block">Send me the guide</button><button type="button" class="decline" data-close>No thanks, I know Katy already</button></div>' +
    '</form>', true);

  html += modal('alerts', 'Listing alerts',
    '<form data-steps novalidate>' +
    '<div class="step" data-step="1"><h3 id="mt-alerts">Get new listings before the weekend crowd.</h3><p class="q">Budget</p>' +
    opts('budget', ['Under $350K', '$350K–$500K', '$500K–$750K', '$750K+']) +
    '<p class="q">Bedrooms</p>' + opts('beds', ['2+', '3+', '4+', '5+']) +
    '<p class="q">Area</p>' + opts('area', ['Katy', 'Fulshear', 'Richmond', 'Anywhere nearby']) +
    '<button type="button" class="btn btn-primary btn-block" data-next>Continue</button></div>' +
    '<div class="step" data-step="2"><h3>Where should we text your matches?</h3>' + contact('Start my alerts') + '</div>' +
    done('You’re on the list', 'We’ll text you new matches the moment they hit the MLS.') +
    '</form>');

  html += modal('join', 'Join our team',
    '<form data-steps novalidate>' +
    '<div class="step" data-step="1"><h3 id="mt-join">Open the door to a new world of luxury.</h3>' +
    '<p class="lede">Become part of the RE/MAX network. Request a confidential conversation with our team.</p>' +
    '<p class="q">Are you currently licensed?</p>' + opts('licensed', ['Yes, licensed agent', 'Getting licensed', 'Not yet']) +
    '<div class="fld"><input name="name" type="text" placeholder=" " autocomplete="name" required><label>Full name</label></div>' +
    '<div class="fld-row"><div class="fld"><input name="email" type="email" placeholder=" " autocomplete="email" required><label>Email</label></div>' +
    '<div class="fld"><input name="phone" type="tel" placeholder=" " autocomplete="tel" required><label>Mobile</label></div></div>' +
    consent + '<button type="submit" class="btn btn-primary btn-block">Request a confidential meeting</button></div>' +
    done('Thank you', 'Colby will reach out personally to set up a confidential meeting.') +
    '</form>');

  html += '<div class="sticky-bar" data-sticky aria-label="Quick actions">' +
    '<a href="tel:+18326930123" class="sb-btn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>Call</a>' +
    '<a href="sms:+18326930123" class="sb-btn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2z"/></svg>Text</a>' +
    '<button type="button" class="sb-main" data-open="valuation">Free home value</button></div>' +
    '<div class="toast" data-toast role="status" aria-live="polite"></div>';

  var wrap = document.createElement('div');
  wrap.innerHTML = html;
  while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
})();
