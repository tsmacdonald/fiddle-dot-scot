// Renders approved comments from the published Google Sheet CSV and submits new ones to the Google Form.
(function () {
  var section = document.getElementById('comments');
  if (!section) return;
  var list = section.querySelector('.comment-list');
  var form = section.querySelector('form');
  var status = section.querySelector('.comment-status');

  // RFC 4180-ish: quoted fields may contain commas, newlines and doubled quotes.
  function parseCSV(text) {
    var rows = [], row = [], field = '', quoted = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (quoted) {
        if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (c === '"') quoted = false;
        else field += c;
      } else if (c === '"') quoted = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c !== '\r') field += c;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  function el(tag, className, text) {
    var e = document.createElement(tag);
    e.className = className;
    e.textContent = text; // never innerHTML: comment text is untrusted
    return e;
  }

  fetch(section.dataset.csv)
    .then(function (r) { if (!r.ok) throw r.status; return r.text(); })
    .then(function (text) {
      var rows = parseCSV(text), header = rows.shift() || [];
      var col = function (name) { return header.indexOf(name); };
      var t = col('Timestamp'), n = col('Name'), c = col('Comment'), p = col('Post');
      rows.filter(function (r) { return r[p] === section.dataset.post; }).forEach(function (r) {
        var li = document.createElement('li');
        li.className = 'comment';
        li.appendChild(el('div', 'comment-meta', r[n] + ' · ' + r[t]));
        li.appendChild(el('p', 'comment-body', r[c]));
        list.appendChild(li);
      });
    })
    .catch(function () {
      list.appendChild(el('li', 'comment-note', 'Comments could not be loaded right now.'));
    });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var button = form.querySelector('button');
    button.disabled = true;
    // Google Forms sends no CORS headers, so the response is opaque; a network failure is the only error we can see.
    fetch(form.action, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(new FormData(form)) })
      .then(function () {
        form.reset();
        status.textContent = 'Thank you! Your comment will appear once it has been approved.';
      })
      .catch(function () {
        status.textContent = 'Sorry, your comment could not be sent. Please try again.';
      })
      .then(function () { button.disabled = false; });
  });
})();
