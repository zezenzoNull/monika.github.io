# Happy Girlfriend Day — for Monika 💛

A single-page interactive surprise. No build step, no dependencies, no server —
just three files and a folder of photos.

## The nine scenes

| # | Scene | What she does |
|---|-------|---------------|
| 1 | Envelope | taps anywhere; the envelope opens, hearts burst |
| 2 | Heart battery | three batteries charge up, the last one overloads |
| 3 | **Scratch cards** | scratches six cards with her finger to reveal hidden notes |
| 4 | **Balloon pop** | taps floating balloons; each pops and shows a message |
| 5 | Polaroid deck | swipes through your nine photos with handwritten captions |
| 6 | Our statistics | animated counters |
| 7 | Quick quiz | three questions, every answer gets a reply |
| 8 | The letter | types itself out on paper (tap to skip) |
| 9 | Finale | confetti, and a heart she holds down |

Balloons drift in the background the whole way through, and the ♪ button in the
corner plays a soft loop.

---

## Put it on GitHub Pages

1. Create a new **public** repo on GitHub (e.g. `girlfriend-day`).
2. Upload everything in this folder — `index.html`, `styles.css`, `app.js`,
   `.nojekyll`, and the whole `photos/` folder.
   *(You can drag them straight into the browser on the "uploading an existing file" page.)*
3. Repo → **Settings** → **Pages** → under *Build and deployment*, set
   **Source: Deploy from a branch**, **Branch: `main`**, **Folder: `/ (root)`** → **Save**.
4. Wait ~1 minute. Your link is `https://<your-username>.github.io/girlfriend-day/`.

Or with git:

```bash
git init && git add . && git commit -m "for monika" && git branch -M main && git remote add origin https://github.com/<you>/girlfriend-day.git && git push -u origin main
```

Everything uses relative paths, so it works from a repo subfolder without changes.

### Test it locally first

```bash
python -m http.server 5599
```

Then open `http://localhost:5599`. (Opening `index.html` by double-clicking also
mostly works, but a local server matches what GitHub Pages does.)

---

## Things you'll want to change

Open **`app.js`** — everything editable is in the first ~90 lines.

**`CONFIG`** — at the very top:

```js
signature: '— Anuj',      // ← put your own name here
togetherSince: null,      // ← e.g. '2021-11-14' adds a "days of you" counter
scratchToUnlock: 3,       // cards she must scratch before she can move on
balloonsToUnlock: 4,
```

If you leave `togetherSince` as `null`, that tile shows "∞ — more of this,
please" instead, so it's safe to leave alone.

Then, further down: `SCRATCH_CARDS`, `BALLOON_NOTES`, `PHOTOS` (captions),
`STATS`, `QUIZ`, and `LETTER`. They're plain lists — edit the text and you're done.

> In `LETTER`, don't add your own line breaks mid-sentence. Leave a **blank line**
> between paragraphs and let it wrap itself, so it reads correctly on every phone.

### Swapping photos

Drop new images into `photos/` and update the `PHOTOS` list in `app.js`. Keep them
under ~1500px on the long edge so the page stays fast on mobile data.

### Using a real song instead of the built-in loop

The ♪ button synthesises a gentle loop in the browser, so there's no audio file to
upload and nothing to license. To use an actual track, drop `music.mp3` next to
`index.html` and replace the `musicButton` block at the bottom of `app.js` with:

```js
(function musicButton(){
  const btn = document.querySelector('#musicBtn');
  const audio = new Audio('./music.mp3');
  audio.loop = true;
  btn.addEventListener('click', () => {
    if (audio.paused) { audio.play(); btn.classList.add('is-on'); }
    else { audio.pause(); btn.classList.remove('is-on'); }
  });
})();
```

Phones won't autoplay audio — she has to tap the button. That's a browser rule,
not a bug.

---

## Notes

- **Preview one screen:** add `?s=3` to the URL to jump straight to scene 3.
- Works on Android Chrome, Samsung Internet, Firefox, and iOS Safari. Uses
  pointer events, so finger and mouse both work.
- Photos were re-encoded and stripped of EXIF, so no GPS or camera data is
  published with them.
- Respects "reduce motion" if she has it switched on.
- Total page weight is about 1.3 MB, nearly all of it the nine photos.
