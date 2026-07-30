const sites = {
  mercari: kw => `https://jp.mercari.com/search?keyword=${encodeURIComponent(kw)}`,
  paypay: kw => `https://paypayfleamarket.yahoo.co.jp/search?keyword=${encodeURIComponent(kw)}`,
  yahoo: kw => `https://auctions.yahoo.co.jp/search/search?p=${encodeURIComponent(kw)}`,
  rakuma: kw => `https://fril.jp/s?query=${encodeURIComponent(kw)}`,
  zozo: kw => `https://zozo.jp/search/?p_keyv=${encodeURIComponent(kw)}`,
  vector: kw => `https://vector-park.jp/list/?kw=${encodeURIComponent(kw)}`,
  kindal: kw => `https://shop.kind.co.jp/search?q=${encodeURIComponent(kw)}`,
  ragtag: kw => `https://www.ragtag.jp/search?fr=${encodeURIComponent(kw)}`,
  second: kw => `https://www.2ndstreet.jp/search?keyword=${encodeURIComponent(kw)}`
};

// 全部選択
document.getElementById("checkAll").addEventListener("click", () => {
  document.querySelectorAll(".siteCheck").forEach(check => {
    check.checked = true;
  });
});

// 全部解除
document.getElementById("uncheckAll").addEventListener("click", () => {
  document.querySelectorAll(".siteCheck").forEach(check => {
    check.checked = false;
  });
});

// 検索
document.getElementById("searchSelected").addEventListener("click", () => {

  const keyword = document.getElementById("keyword").value.trim();
 saveHistory(keyword);
  if (!keyword) {
    alert("検索キーワードを入力してください");
    return;
  }

  const checked = document.querySelectorAll(".siteCheck:checked");

  if (checked.length === 0) {
    alert("検索サイトを選択してください");
    return;
  }

  const resultArea = document.getElementById("resultArea");
  resultArea.innerHTML = "";

  checked.forEach(item => {

    const btn = document.createElement("button");

    btn.textContent = item.parentElement.textContent.trim();

    btn.addEventListener("click", () => {
      window.open(sites[item.value](keyword), "_blank");
    });

    resultArea.appendChild(btn);

  });

});
// 検索履歴を保存
function saveHistory(keyword){

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history = history.filter(item => item !== keyword);

    history.unshift(keyword);

    history = history.slice(0,10);

    localStorage.setItem("history", JSON.stringify(history));

    drawHistory();

}

// 検索履歴を表示
function drawHistory(){

    const history = JSON.parse(localStorage.getItem("history")) || [];

    const area = document.getElementById("history");

    area.innerHTML = "";

    history.forEach(word=>{

        const btn = document.createElement("button");

        btn.textContent = word;

        btn.onclick = ()=>{

            document.getElementById("keyword").value = word;

        };

        area.appendChild(btn);

    });

}

drawHistory();