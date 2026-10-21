// Vercel 서버리스 함수: 위플랩 업보시트의 "획득 기록" 표를 읽어 JSON으로 돌려줍니다.
// 위치: 저장소 맨 위의 api 폴더 → /api/upbo-history
// 확인: 배포 후 /api/upbo-history 를 열어 보세요. 안 되면 /api/upbo-history?debug=1

const SOURCE =
  "https://weflab-upbo-mvp.vercel.app/xirunyang?tab=history&design=ref-u";

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&nbsp;": " ",
};

function decode(text) {
  return text
    .replace(/&(?:amp|lt|gt|quot|nbsp|#39|#x27);/g, (m) => ENTITIES[m])
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

// 태그를 지우되, 글자 사이에 끼는 주석(<!-- -->)과 태그는 공백 없이 붙입니다.
function textOf(html) {
  return decode(
    html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]*>/g, "")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function parseRows(html) {
  const rows = [];
  const trs = html.match(/<tr[\s>][\s\S]*?<\/tr>/gi) || [];

  for (const tr of trs) {
    const cells = (tr.match(/<td[\s>][\s\S]*?<\/td>/gi) || []).map(textOf);
    if (cells.length < 4) continue; // 제목 줄(th)이나 다른 표는 건너뜀

    rows.push({
      nickname: cells[0],
      item: cells[1],
      set: cells[2],
      time: cells[3],
    });
  }

  return rows;
}

function parseUpdatedAt(html) {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
  const m = textOf(body).match(
    /마지막 반영\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}\s*KST)/
  );
  return m ? m[1] : "";
}

module.exports = async (req, res) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(SOURCE, {
      headers: { "User-Agent": "xiru-fan-site/1.0 (fan site)" },
      signal: controller.signal,
      cache: "no-store",
    });
    const html = await response.text();
    const items = parseRows(html);

    if (req.query && req.query.debug) {
      const at = html.search(/<table/i);
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json({
        sourceStatus: response.status,
        htmlLength: html.length,
        rowsFound: items.length,
        firstRows: items.slice(0, 3),
        htmlAroundTable: html.slice(Math.max(at, 0), Math.max(at, 0) + 1500),
      });
    }

    if (!response.ok || items.length === 0) {
      res.setHeader("Cache-Control", "no-store");
      return res.status(502).json({ error: "원본에서 획득 기록을 읽지 못했어요." });
    }

    // 30초 동안은 같은 결과를 재사용 → 방문자가 많아도 원본 사이트에 요청이 몰리지 않음
    res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
    return res.status(200).json({
      updatedAt: parseUpdatedAt(html),
      total: items.length,
      fetchedAt: new Date().toISOString(),
      items,
    });
  } catch (err) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(502).json({ error: "원본에 연결하지 못했어요." });
  } finally {
    clearTimeout(timer);
  }
};
