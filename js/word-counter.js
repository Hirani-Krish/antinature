/* ============================================
   Word & Character Counter — Logic
   ============================================ */
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('text-input');
    if (!textarea) return;

    /* Stat elements */
    const stats = {
      words:       document.getElementById('stat-words'),
      characters:  document.getElementById('stat-characters'),
      sentences:   document.getElementById('stat-sentences'),
      paragraphs:  document.getElementById('stat-paragraphs'),
    };

    const details = {
      charsNoSpace:  document.getElementById('detail-chars-no-space'),
      letters:       document.getElementById('detail-letters'),
      numbers:       document.getElementById('detail-numbers'),
      special:       document.getElementById('detail-special'),
      spaces:        document.getElementById('detail-spaces'),
      lines:         document.getElementById('detail-lines'),
      avgWordLen:    document.getElementById('detail-avg-word'),
      readTime:      document.getElementById('detail-read-time'),
      speakTime:     document.getElementById('detail-speak-time'),
      longestWord:   document.getElementById('detail-longest-word'),
    };

    function analyze(text) {
      /* Empty check */
      if (!text || text.trim().length === 0) {
        return {
          words: 0, characters: 0, sentences: 0, paragraphs: 0,
          charsNoSpace: 0, letters: 0, numbers: 0, special: 0,
          spaces: 0, lines: 0, avgWordLen: 0, readTime: '0 sec',
          speakTime: '0 sec', longestWord: '—'
        };
      }

      const characters = text.length;
      const charsNoSpace = text.replace(/\s/g, '').length;

      /* Words — split by whitespace, filter empty */
      const wordArray = text.trim().split(/\s+/).filter(function(w) { return w.length > 0; });
      const words = wordArray.length;

      /* Sentences — split by . ? ! (with some smarts) */
      const sentenceMatches = text.match(/[^.!?]*[.!?]+/g);
      const sentences = sentenceMatches ? sentenceMatches.length : (words > 0 ? 1 : 0);

      /* Paragraphs — split by double newline or single newline with content */
      const paraArray = text.split(/\n\s*\n|\n/).filter(function(p) { return p.trim().length > 0; });
      const paragraphs = paraArray.length;

      /* Character breakdown */
      const letters = (text.match(/[a-zA-Z]/g) || []).length;
      const numbers = (text.match(/[0-9]/g) || []).length;
      const spaces = (text.match(/\s/g) || []).length;
      const special = charsNoSpace - letters - numbers;

      /* Lines */
      const lines = text.split('\n').length;

      /* Average word length */
      const avgWordLen = words > 0 
        ? (wordArray.reduce(function(sum, w) { return sum + w.replace(/[^a-zA-Z0-9]/g, '').length; }, 0) / words).toFixed(1)
        : 0;

      /* Read time (avg 200 wpm) */
      const readMinutes = words / 200;
      var readTime;
      if (readMinutes < 1) {
        readTime = Math.ceil(readMinutes * 60) + ' sec';
      } else {
        readTime = Math.floor(readMinutes) + ' min ' + Math.round((readMinutes % 1) * 60) + ' sec';
      }

      /* Speak time (avg 130 wpm) */
      const speakMinutes = words / 130;
      var speakTime;
      if (speakMinutes < 1) {
        speakTime = Math.ceil(speakMinutes * 60) + ' sec';
      } else {
        speakTime = Math.floor(speakMinutes) + ' min ' + Math.round((speakMinutes % 1) * 60) + ' sec';
      }

      /* Longest word */
      const longestWord = words > 0
        ? wordArray.reduce(function(a, b) { return a.length >= b.length ? a : b; }, '')
        : '—';

      return {
        words: words,
        characters: characters,
        sentences: sentences,
        paragraphs: paragraphs,
        charsNoSpace: charsNoSpace,
        letters: letters,
        numbers: numbers,
        special: special,
        spaces: spaces,
        lines: lines,
        avgWordLen: avgWordLen,
        readTime: readTime,
        speakTime: speakTime,
        longestWord: longestWord.length > 20 ? longestWord.substring(0, 20) + '…' : longestWord
      };
    }

    function formatNumber(n) {
      return n.toLocaleString('en-IN');
    }

    function update() {
      const result = analyze(textarea.value);

      /* Update main stats */
      if (stats.words)      stats.words.textContent      = formatNumber(result.words);
      if (stats.characters)  stats.characters.textContent  = formatNumber(result.characters);
      if (stats.sentences)   stats.sentences.textContent   = formatNumber(result.sentences);
      if (stats.paragraphs)  stats.paragraphs.textContent  = formatNumber(result.paragraphs);

      /* Update detail rows */
      if (details.charsNoSpace)  details.charsNoSpace.textContent  = formatNumber(result.charsNoSpace);
      if (details.letters)       details.letters.textContent       = formatNumber(result.letters);
      if (details.numbers)       details.numbers.textContent       = formatNumber(result.numbers);
      if (details.special)       details.special.textContent       = formatNumber(result.special);
      if (details.spaces)        details.spaces.textContent        = formatNumber(result.spaces);
      if (details.lines)         details.lines.textContent         = formatNumber(result.lines);
      if (details.avgWordLen)    details.avgWordLen.textContent     = result.avgWordLen;
      if (details.readTime)      details.readTime.textContent      = result.readTime;
      if (details.speakTime)     details.speakTime.textContent     = result.speakTime;
      if (details.longestWord)   details.longestWord.textContent   = result.longestWord;
    }

    /* Listen for input */
    textarea.addEventListener('input', update);

    /* Action buttons */
    var clearBtn = document.getElementById('btn-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        textarea.value = '';
        update();
        textarea.focus();
      });
    }

    var copyBtn = document.getElementById('btn-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', function() {
        if (textarea.value.trim()) {
          navigator.clipboard.writeText(textarea.value).then(function() {
            var original = copyBtn.textContent;
            copyBtn.textContent = '✓ Copied';
            setTimeout(function() { copyBtn.textContent = original; }, 1500);
          });
        }
      });
    }

    var pasteBtn = document.getElementById('btn-paste');
    if (pasteBtn) {
      pasteBtn.addEventListener('click', function() {
        navigator.clipboard.readText().then(function(text) {
          textarea.value = text;
          update();
        }).catch(function() {
          /* Clipboard permission denied — ignore silently */
        });
      });
    }

    /* Initialize with empty state */
    update();
  });
})();
