(function () {
  'use strict';
  window.Pumpium = window.Pumpium || {};
  const C = window.Pumpium.Constants;
  const U = window.Pumpium.Utils;

  function createLog(dom) {
    const logLines = [];
    let searchQuery = '';
    let currentMatchIndex = 0;
    const outputEl = dom.logOutput || dom.logOutputRemote;

    function matchesFilters(line) {
      if (!dom.filter4xx && !dom.filter5xx) return true;
      const want4 = dom.filter4xx ? dom.filter4xx.checked : false;
      const want5 = dom.filter5xx ? dom.filter5xx.checked : false;
      if (!want4 && !want5) return true;
      const has4 = C.RE_4XX.test(line);
      const has5 = C.RE_5XX.test(line);
      if (want4 && want5) return has4 || has5;
      return want4 ? has4 : has5;
    }

    function buildHighlightedHtml(lines, query) {
      const re = new RegExp(U.escapeRegex(query), 'gi');
      const parts = [];
      for (const line of lines) {
        re.lastIndex = 0;
        if (!re.test(line)) {
          parts.push(U.escapeHtml(line), '\n');
          continue;
        }
        re.lastIndex = 0;
        let lastEnd = 0;
        let m;
        while ((m = re.exec(line)) !== null) {
          parts.push(U.escapeHtml(line.slice(lastEnd, m.index)));
          parts.push('<mark class="log-search-match">', U.escapeHtml(m[0]), '</mark>');
          lastEnd = m.index + m[0].length;
        }
        parts.push(U.escapeHtml(line.slice(lastEnd)), '\n');
      }
      if (parts[parts.length - 1] === '\n') parts.pop();
      return parts.join('');
    }

    function updateSearchUI(marks, total) {
      if (!dom.logSearchCount) return;
      marks.forEach((el, i) => el.classList.toggle('current', i === currentMatchIndex));
      dom.logSearchCount.textContent = total === 0 ? U.t('log.noMatches') : (total === 1 ? '1' : (currentMatchIndex + 1) + ' / ' + total);
      if (dom.logSearchPrev) dom.logSearchPrev.disabled = total === 0;
      if (dom.logSearchNext) dom.logSearchNext.disabled = total === 0;
      if (marks.length > 0) marks[currentMatchIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function renderLog() {
      if (!outputEl) return;
      const filtered = logLines.filter(matchesFilters);
      const text = filtered.length ? filtered.join('\n') : '';
      const q = searchQuery.trim();
      if (!q || !dom.logSearchBar) {
        outputEl.textContent = text;
        if (dom.logSearchCount) dom.logSearchCount.textContent = '';
        return;
      }
      outputEl.innerHTML = buildHighlightedHtml(filtered, q);
      const marks = outputEl.querySelectorAll('.log-search-match');
      updateSearchUI(marks, marks.length);
    }

    function addLogLine(text, isStderr) {
      if (!text) return;
      logLines.push(text);
      if (searchQuery.trim()) {
        renderLog();
        return;
      }
      if (matchesFilters(text)) {
        const cur = outputEl.textContent;
        outputEl.textContent = cur ? cur + '\n' + text : text;
      }
    }

    function goToMatch(delta) {
      if (!outputEl) return;
      const marks = outputEl.querySelectorAll('.log-search-match');
      const total = marks.length;
      if (total === 0) return;
      currentMatchIndex = (currentMatchIndex + delta + total) % total;
      updateSearchUI(marks, total);
    }

    function openSearch() {
      if (dom.logSearchBar) {
        dom.logSearchBar.classList.remove('hidden');
        if (dom.logSearchInput) dom.logSearchInput.focus();
      }
    }

    function closeSearch() {
      if (dom.logSearchBar) dom.logSearchBar.classList.add('hidden');
      searchQuery = '';
      if (dom.logSearchInput) dom.logSearchInput.value = '';
      currentMatchIndex = 0;
      renderLog();
    }

    function clearLog() {
      logLines.length = 0;
      if (outputEl) outputEl.textContent = '';
    }

    function setSearchQuery(q) {
      searchQuery = q;
      currentMatchIndex = 0;
    }

    return {
      addLogLine,
      renderLog,
      clearLog,
      goToMatch,
      openSearch,
      closeSearch,
      setSearchQuery,
      get searchQuery() { return searchQuery; },
      get logSearchBar() { return dom.logSearchBar || null; },
      get logSearchInput() { return dom.logSearchInput || null; },
    };
  }

  window.Pumpium.Log = { create: createLog };
})();
