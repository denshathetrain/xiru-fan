  // ==============================
  // 노래책
  // (script.js의 DOMContentLoaded 안, "네비게이션 현재 페이지 표시" 위에 붙여넣기)
  // ==============================

  const songList = document.getElementById("song-list");

  if (songList) {
    /* ===== 곡 데이터: 여기에 곡을 추가하세요 =====
       title  : 곡 제목
       artist : 가수
       yt     : 유튜브 링크 (없으면 "" → 버튼이 안 나옴)
       lyrics : 가사 (백틱 ` 안에서 Enter로 줄바꿈)
    */
    const SONGS = [
      {
        title: "그래도 나 사랑하지",
        artist: "송하영",
        yt: "https://youtu.be/TimDZZpB4hI?si=PhXREeuPOr4qj8Gc",
        lyrics: `보고 싶다 말해도 심드렁한 너
서운하고 속상해 미워지다가도
또 싱거운 네 한마디에
웃음이 나는 나야
그래도 나 사랑하지
아직도 난 네가 너무 좋아
배가 나오고 대머리가 돼도
난 네가 좋을 것 같아
아직도 나 사랑하지
사랑을 말했던 그날처럼
언제나 이렇게 있어줘
바보 같은 네 농담에
너보다 더 바보처럼 웃고 있는 나를
다정하게 눈 맞추며
함께 웃어주는 너
그래도 나 사랑하지
아직도 난 네가 너무 좋아
배가 나오고 대머리가 돼도
난 네가 좋을 것 같아
아직도 나 사랑하지
사랑을 말했던 그날처럼
언제나 이렇게 있어줘
그래도 나 사랑하지
아직도 난 네가 너무 좋아
배가 나오고 대머리가 돼도
난 네가 좋을 것 같아
아직도 나 사랑하지
사랑을 말했던 그날처럼
언제나 이렇게 있어줘
언제나 이렇게 있어줘`
      },
      {
        title: "예시 곡 2",
        artist: "예시 가수 B",
        yt: "https://www.youtube.com/watch?v=BBBBBBBBBBB",
        lyrics: `두 번째 곡의 가사 자리예요.`
      },
      {
        title: "예시 곡 3 (가사 미등록)",
        artist: "예시 가수 C",
        yt: "https://youtu.be/CCCCCCCCCCC",
        lyrics: ""
      }
    ];
    /* ============================================ */

    const songSearch = document.getElementById("song-search");
    const songCount = document.getElementById("song-count");
    const songEmpty = document.getElementById("song-empty");

    const norm = s => (s || "").toLowerCase().replace(/\s+/g, "");

    function ytId(url) {
      const m = /(?:youtu\.be\/|[?&]v=|shorts\/|embed\/)([\w-]{11})/.exec(url || "");
      return m ? m[1] : null;
    }

    function safeUrl(url) {
      try {
        const u = new URL(url);
        return /^https?:$/.test(u.protocol) ? u.href : null;
      } catch {
        return null;
      }
    }

    function toggleSong(li) {
      const willOpen = !li.classList.contains("open");
      songList.querySelectorAll(".song-item.open").forEach(el => {
        el.classList.remove("open");
        el.querySelector(".song-row").setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        li.classList.add("open");
        li.querySelector(".song-row").setAttribute("aria-expanded", "true");
      }
    }

    function buildSong(song, i) {
      const li = document.createElement("li");
      li.className = "song-item";

      const row = document.createElement("button");
      row.type = "button";
      row.className = "song-row";
      row.setAttribute("aria-expanded", "false");
      row.setAttribute("aria-controls", "song-detail-" + i);

      const num = document.createElement("span");
      num.className = "song-num";
      num.textContent = i + 1;

      const thumb = document.createElement("span");
      thumb.className = "song-thumb";
      const id = ytId(song.yt);
      if (id) {
        const img = document.createElement("img");
        img.src = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
        img.alt = "";
        img.loading = "lazy";
        img.onerror = () => img.remove();
        thumb.appendChild(img);
      }
      const thumbHref = safeUrl(song.yt);
      if (thumbHref) {
        thumb.classList.add("link");
        thumb.title = "유튜브에서 열기";
        thumb.addEventListener("click", e => {
          e.stopPropagation(); // 곡이 펼쳐지는 동작은 막기
          window.open(thumbHref, "_blank", "noopener,noreferrer");
        });
      }

      const info = document.createElement("span");
      info.className = "song-info";
      const title = document.createElement("span");
      title.className = "song-title";
      title.textContent = song.title;
      const artist = document.createElement("span");
      artist.className = "song-artist";
      artist.textContent = song.artist;
      info.append(title, artist);

      const tag = document.createElement("span");
      tag.className = "song-tag";
      tag.textContent = "가사 일치";
      tag.hidden = true;

      const chev = document.createElement("span");
      chev.className = "song-chev";
      chev.setAttribute("aria-hidden", "true");
      chev.textContent = "▾";

      row.append(num, thumb, info, tag, chev);

      const detail = document.createElement("div");
      detail.className = "song-detail";
      detail.id = "song-detail-" + i;
      const inner = document.createElement("div");
      inner.className = "song-detail-inner";
      const body = document.createElement("div");
      body.className = "song-detail-body";

      const lyrics = document.createElement("pre");
      lyrics.className = "song-lyrics";
      if (song.lyrics && song.lyrics.trim()) {
        lyrics.textContent = song.lyrics;
      } else {
        lyrics.textContent = "아직 등록된 가사가 없어요.";
        lyrics.classList.add("empty");
      }
      body.appendChild(lyrics);

      const href = safeUrl(song.yt);
      if (href) {
        const link = document.createElement("a");
        link.className = "song-yt";
        link.href = href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "유튜브에서 듣기";
        body.prepend(link);
      }

      inner.appendChild(body);
      detail.appendChild(inner);
      li.append(row, detail);

      row.addEventListener("click", () => toggleSong(li));
      return li;
    }

    const songItems = SONGS.map(buildSong);
    songItems.forEach(li => songList.appendChild(li));

    function filterSongs() {
      const q = norm(songSearch.value);
      let shown = 0;

      songItems.forEach((li, i) => {
        const s = SONGS[i];
        const inMeta = norm(s.title).includes(q) || norm(s.artist).includes(q);
        const inLyrics = norm(s.lyrics).includes(q);
        const match = !q || inMeta || inLyrics;

        li.hidden = !match;
        li.querySelector(".song-tag").hidden = !(q && !inMeta && inLyrics);
        if (match) shown++;
      });

      songCount.textContent = q
        ? `${SONGS.length}곡 중 ${shown}곡`
        : `총 ${SONGS.length}곡 · 곡을 누르면 가사와 유튜브 링크가 나와요`;
      songEmpty.hidden = shown !== 0;
    }

    songSearch.addEventListener("input", filterSongs);
    filterSongs();
  }

