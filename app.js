// =========================
// せどり検索Pro Ver.3
// app.js (1/4)
// =========================
// =========================
// Supabase
// =========================


const SUPABASE_URL =
  "https://bhnereolemciurihpgnj.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_s_rzaq1CRUse2q17Q4OqVA_j-li-JA2";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );
let selectedBrand = "";
let brandDatabase = {};
let myBrands =
JSON.parse(localStorage.getItem("myBrands")) || [];
let favoriteBrands = [];
let recentBrands =
  JSON.parse(localStorage.getItem("recentBrands")) || [];
// ブランドデータ読み込み
fetch("data/brands.json?v=20260810")
  .then(response => response.json())
  .then(data => {
    brandDatabase = data;
    drawBrands();
  })
  .catch(error => {
    console.error("brands.json 読み込み失敗", error);
  });
  async function loadFavoriteBrands() {

  const { data, error } = await supabaseClient
    .from("favorite_brands")
    .select("brand")
    .order("created_at", {
      ascending: true
    });

  if (error) {
    console.error(
      "お気に入り読み込みエラー",
      error
    );
    return;
  }

  favoriteBrands =
    data.map(item => item.brand);

  drawBrands();
}
loadFavoriteBrands();

// -------------------------
// ブランド一覧表示
// -------------------------
function drawBrands() {

  // ブランドデータ読み込み前は何もしない
  if (Object.keys(brandDatabase).length === 0) {
    return;
  }

  const area = document.getElementById("favoriteBrands");
  const favoriteArea = document.getElementById("favoriteArea");
const recentArea = document.getElementById("recentArea");
  area.innerHTML = "";
  favoriteArea.innerHTML = "";
  recentArea.innerHTML = "";

  const keyword =
    document
      .getElementById("brandSearch")
      .value
      .toLowerCase()
      .trim();

  // =========================
  // 全ブランド
  // =========================

  const allBrands = [...new Set([
    ...Object.keys(brandDatabase),
    ...myBrands
  ])];


// =========================
// 🕘 最近見たブランド
// =========================

recentBrands
  .filter(brand =>
    brand.toLowerCase().includes(keyword)
  )
  .forEach(brand => {

    const wrapper =
      document.createElement("div");

    wrapper.style.display = "inline-flex";
    wrapper.style.margin = "5px";


    // ブランドボタン
    const button =
      document.createElement("button");

    button.textContent = brand;

    button.className = "brandButton";

    if (selectedBrand === brand) {
      button.classList.add("active");
    }

    button.onclick = function() {

  selectedBrand = brand;

  document.getElementById("keyword").value =
    brand;

  document.getElementById("brandSearch").value =
    "";

  addRecentBrand(brand);

  showBrandInfo(brand);

  // 📷 保存画像のブランド欄に自動入力
  const imageBrand =
    document.getElementById("imageBrandFilter");

  if (imageBrand) {
    imageBrand.value = brand;
  }

  // 📷 そのブランドの保存画像を表示
  displaySavedImages(
    savedImageData.filter(item =>
      String(item.brand)
        .trim()
        .toLowerCase() ===
      String(brand)
        .trim()
        .toLowerCase()
    )
  );

  drawBrands();

};

    // ×ボタン
    const deleteButton =
      document.createElement("button");

    deleteButton.textContent = "×";

    deleteButton.className =
      "recentDeleteButton";

    deleteButton.onclick = function(e) {

      e.stopPropagation();

      removeRecentBrand(brand);

    };


    wrapper.appendChild(button);

    wrapper.appendChild(deleteButton);

    recentArea.appendChild(wrapper);

  });
  // =========================
  // ⭐ お気に入りブランド
  // =========================

  favoriteBrands
  .filter(brand =>
    brand.toLowerCase().includes(keyword)
  )
  .forEach(brand => {

    const wrapper =
      document.createElement("div");

    wrapper.style.display = "inline-flex";
    wrapper.style.margin = "5px";

    // ブランドボタン
    const button =
      document.createElement("button");

    button.textContent = "★ " + brand;

    button.className =
      "brandButton favoriteButton";

    if (selectedBrand === brand) {
      button.classList.add("active");
    }

    button.onclick = function() {

      selectedBrand = brand;

      document.getElementById("keyword").value =
        brand;

      addRecentBrand(brand);

      showBrandInfo(brand);

      drawBrands();

    };

    // ×削除ボタン
    const deleteButton =
      document.createElement("button");

    deleteButton.textContent = "×";

    deleteButton.className =
      "recentDeleteButton";

    deleteButton.onclick = function(e) {

      e.stopPropagation();

      removeFavoriteBrand(brand);

    };

    wrapper.appendChild(button);
    wrapper.appendChild(deleteButton);

    favoriteArea.appendChild(wrapper);

  });

     
  // =========================
  // 📚 ブランド一覧
  // =========================

  allBrands
    .sort((a, b) => a.localeCompare(b))
    .filter(brand =>
      brand.toLowerCase().includes(keyword)
    )
    .forEach(brand => {

     const wrapper = document.createElement("div");

wrapper.style.display = "inline-flex";
wrapper.style.margin = "5px";


// =========================
// ブランドボタン
// =========================

const button = document.createElement("button");

button.textContent = brand;

button.className = "brandButton";

if (selectedBrand === brand) {
  button.classList.add("active");
}

button.onclick = function() {

  selectedBrand = brand;

  document.getElementById("keyword").value = brand;

  document.getElementById("brandSearch").value = "";

  addRecentBrand(brand);

  showBrandInfo(brand);

  drawBrands();

};


// =========================
// ★ お気に入りボタン
// =========================

const favoriteButton =
  document.createElement("button");

favoriteButton.textContent =
  favoriteBrands.includes(brand)
    ? "★"
    : "☆";

favoriteButton.className =
  "favoriteToggle";

favoriteButton.onclick = function(e) {

  e.stopPropagation();

  toggleFavorite(brand);

};


wrapper.appendChild(button);
wrapper.appendChild(favoriteButton);

area.appendChild(wrapper);

    });


  // =========================
  // ブランドが見つからない
  // =========================

 if (
  favoriteArea.children.length === 0 &&
  area.children.length === 0
) {

  const keyword =
    document
      .getElementById("brandSearch")
      .value
      .trim();

  if (keyword) {

    const info =
      document.getElementById("brandInfo");

    info.innerHTML = "";

    const title =
      document.createElement("h3");

    title.textContent =
      `「${keyword}」が見つかりません`;

    const text =
      document.createElement("p");

    text.textContent =
      "このブランドを追加できます。";

    const button =
      document.createElement("button");

    button.textContent =
      "➕ このブランドを追加";

    button.onclick = function() {
      addBrand(keyword);
    };

    info.appendChild(title);
    info.appendChild(text);
    info.appendChild(button);

   } else {

    document.getElementById("brandInfo").innerHTML = "";

  }
}
}
//
// -------------------------
// ブランド検索
// -------------------------
document
  .getElementById("brandSearch")
  .addEventListener("input", drawBrands);
  // =========================
// ブランド情報表示
// =========================

function showBrandInfo(brand) {

  let data = brandDatabase[brand];

  // brands.jsonに無いブランドなら空データを作る
  if (!data) {

    data = {
      ai: {
        rank: "",
        season: "",
        items: [],
        models: [],
        tips: [],
        highValue: [],
        colors: [],
        materials: []
      }
    };

  }

  const area = document.getElementById("brandInfo");

  area.innerHTML = `

<h2>

${brand}

<button
onclick="toggleFavorite('${brand}')">

${favoriteBrands.includes(brand) ? "★" : "☆"}

</button>

</h2>

<p><strong>利益度</strong> ${data.ai.rank}</p>

<p><strong>売れる季節</strong> ${data.ai.season}</p>

<hr>

<h3>人気アイテム</h3>

<ul>
${data.ai.items.map(item =>
`<li>${item}</li>`
).join("")}
</ul>

<hr>

<h3>人気型番</h3>

<div id="modelArea">

${getModels(brand).map(model => `

<div style="display:inline-block;margin:6px;">

<button
class="modelButton"
onclick="searchModel('${brand}','${model}')">

${model}

</button>

<button
onclick="deleteModel('${brand}','${model}')">

❌

</button>

</div>

`).join("")}

</div>

<br>

<input
id="newModel"
type="text"
placeholder="型番を追加">

<button onclick="addModel('${brand}')">
＋追加
</button>

<hr>

<details>
<summary>⭐ 高値要素</summary>

<ul>
${[
    ...(data.ai.highValue || []),
    ...(JSON.parse(localStorage.getItem("highValue_" + brand)) || [])
].map(item => `
<li>${item}</li>
`).join("")}
</ul>

<br>

<input
id="newHighValue"
type="text"
placeholder="高値要素を追加">

<button onclick="addHighValue('${brand}')">
＋追加
</button>

</details>

<br>

<details>
<summary>🎨 人気カラー</summary>

<ul>
${(data.ai.colors || []).map(item =>
`<li>${item}</li>`
).join("")}
</ul>

</details>

<br>

<details>
<summary>🧵 人気素材</summary>

<ul>
${(data.ai.materials || []).map(item =>
`<li>${item}</li>`
).join("")}
</ul>

</details>

<br>

<details>
<summary>💡 仕入れポイント</summary>

<ul>
${data.ai.tips.map(tip =>
`<li>${tip}</li>`
).join("")}
</ul>

</details>

<br>

<details>
<summary>📝 自分データ</summary>

<br>

<label>⭐ 高値要素</label><br>

<textarea
id="highMemo"
rows="2"
style="width:100%;"
>${localStorage.getItem("highMemo_"+brand)||""}</textarea>

<br><br>

<label>🎨 人気カラー</label><br>

<textarea
id="colorMemo"
rows="2"
style="width:100%;"
>${localStorage.getItem("colorMemo_"+brand)||""}</textarea>

<br><br>

<label>🧵 人気素材</label><br>

<textarea
id="materialMemo"
rows="2"
style="width:100%;"
>${localStorage.getItem("materialMemo_"+brand)||""}</textarea>

<br><br>

<label>💰 売値メモ</label><br>

<input
id="sellMemo"
style="width:100%;"
value="${localStorage.getItem("sellMemo_"+brand)||""}">

<br><br>

<label>🛒 仕入れ基準</label><br>

<input
id="buyRule"
style="width:100%;"
value="${localStorage.getItem("buyRule_"+brand)||""}">

<br><br>

<label>⚠️ 注意点</label><br>

<textarea
id="noticeMemo"
rows="3"
style="width:100%;"
>${localStorage.getItem("noticeMemo_"+brand)||""}</textarea>

<br><br>

<label>📒 自由メモ</label><br>

<textarea
id="memo"
rows="6"
style="width:100%;"
>${localStorage.getItem("memo_"+brand)||""}</textarea>

<br><br>

<button onclick="saveMemo('${brand}')">
💾 保存
</button>

</details>

`;

}
// =========================
// メモ保存
// =========================


function saveMemo(brand){

  localStorage.setItem(
    "memo_" + brand,
    document.getElementById("memo").value
  );

  localStorage.setItem(
    "highMemo_" + brand,
    document.getElementById("highMemo").value
  );

  localStorage.setItem(
    "colorMemo_" + brand,
    document.getElementById("colorMemo").value
  );

  localStorage.setItem(
    "materialMemo_" + brand,
    document.getElementById("materialMemo").value
  );

  localStorage.setItem(
    "sellMemo_" + brand,
    document.getElementById("sellMemo").value
  );

  localStorage.setItem(
    "buyRule_" + brand,
    document.getElementById("buyRule").value
  );

  localStorage.setItem(
    "noticeMemo_" + brand,
    document.getElementById("noticeMemo").value
  );

  alert("保存しました！");
}
// =========================
// 型番一覧取得
// =========================

function getModels(brand){

  const base =
    brandDatabase[brand]?.ai?.models || [];

  const mine =
    JSON.parse(
      localStorage.getItem("models_" + brand)
    ) || [];

  return [...new Set([
    ...base,
    ...mine
  ])];

}

// =========================
// 型番追加
// =========================

function addModel(brand){

  const input =
    document.getElementById("newModel");

  const model = input.value.trim();

  if(!model){
    alert("型番を入力してください");
    return;
  }

  let models =
    JSON.parse(
      localStorage.getItem("models_"+brand)
    ) || [];

  if(!models.includes(model)){

    models.push(model);

    localStorage.setItem(
      "models_"+brand,
      JSON.stringify(models)
    );

  }

  input.value = "";

showBrandInfo(brand);

document.getElementById("keyword").value =
    brand + " " + model;


}

// =========================
// 型番削除
// =========================

function deleteModel(brand,model){

  if(!confirm(model+" を削除しますか？")){
    return;
  }

  let models =
    JSON.parse(
      localStorage.getItem("models_"+brand)
    ) || [];

  models =
    models.filter(item => item !== model);

  localStorage.setItem(
    "models_"+brand,
    JSON.stringify(models)
  );

  showBrandInfo(brand);

}

// =========================
// 型番検索
// =========================

function searchModel(brand, model){

    const keyword = `${brand} ${model}`;

    document.getElementById("keyword").value = keyword;

    search();
}



// =========================
// 検索ボタン
// =========================

document
  .getElementById("searchButton")
  .addEventListener("click", search);
  // =========================
// app.js (4/4)
// Ver.3 完成
// =========================

// Enterキーで検索
document
  .getElementById("keyword")
  .addEventListener("keydown", function(e){

    if(e.key==="Enter"){
      search();
    }

});

// Enterキーでブランド検索
document
// =========================
// ブランド検索 Enter
// =========================

document
  .getElementById("brandSearch")
  .addEventListener("keydown", function(e) {

    if (e.key !== "Enter") {
      return;
    }

    const keyword =
      document
        .getElementById("brandSearch")
        .value
        .trim();

    if (!keyword) {
      return;
    }

    // brands.json + 自分で追加したブランド
    const allBrands = [
      ...new Set([
        ...Object.keys(brandDatabase),
        ...myBrands
      ])
    ];

    // 部分一致検索
    const brands = allBrands.filter(brand =>
      brand.toLowerCase().includes(
        keyword.toLowerCase()
      )
    );

    if (brands.length > 0) {

      // 最初に一致したブランドを選択
      selectedBrand = brands[0];

      // サイト検索欄にはブランド名を入れる
      document.getElementById("keyword").value =
        brands[0];

      // ブランド検索欄は空にする
      document.getElementById("brandSearch").value =
        "";

      addRecentBrand(brands[0]);

      showBrandInfo(brands[0]);

      drawBrands();

    } else {

      // 見つからなければ追加画面
      document.getElementById("brandInfo").innerHTML = `

        <h3>「${keyword}」が見つかりません</h3>

        <p>このブランドを追加できます。</p>

        <button onclick="addBrand('${keyword}')">
          ➕ このブランドを追加
        </button>

      `;

    }

  });
// ブランドが無い場合
function showEmptyBrand(){

  document.getElementById("brandInfo").innerHTML=`

  <h3>ブランドが見つかりません</h3>

  <p>

  brands.jsonへ追加すると表示されます。

  </p>

  `;

}




// =========================
// 検索サイト追加
// =========================

function search(){

  const keyword =
    document.getElementById("keyword").value.trim() ||
    document.getElementById("brandSearch").value.trim();

  if(!keyword){
    alert("検索キーワードを入力してください");
    return;
  }

  // ブランド検索欄をクリア
  document.getElementById("brandSearch").value = "";

  document.getElementById("searchResult").innerHTML = `

  // ここから下は今の検索ボタンのコード

<button onclick="window.open('https://jp.mercari.com/search?keyword=${encodeURIComponent(keyword)}','_blank')">
🛒 メルカリ
</button>

<button onclick="window.open('https://paypayfleamarket.yahoo.co.jp/search/${encodeURIComponent(keyword)}?page=1','_blank')">
🟡 Yahoo!フリマ
</button>

<button onclick="window.open('https://auctions.yahoo.co.jp/search/search?p=${encodeURIComponent(keyword)}','_blank')">
🔨 ヤフオク
</button>

<button onclick="window.open('https://fril.jp/s?query=${encodeURIComponent(keyword)}','_blank')">
💎 ラクマ
</button>

<button onclick="window.open('https://zozo.jp/search/?p_keyv=${encodeURIComponent(keyword)}','_blank')">
👕 ZOZOUSED
</button>

<button onclick="window.open('https://vector-park.jp/list/?kw=${encodeURIComponent(keyword)}','_blank')">
🏬 ベクトル
</button>

<button onclick="window.open('https://www.2ndstreet.jp/search?keyword=${encodeURIComponent(keyword)}','_blank')">
♻️ セカンドストリート
</button>

<button onclick="window.open('https://www.ragtag.jp/search?fr=${encodeURIComponent(keyword)}','_blank')">
🛍️ RAGTAG
</button>

<button onclick="window.open('https://shop.kind.co.jp/search?q=${encodeURIComponent(keyword)}','_blank')">
👞 カインドオル
</button>
<button onclick="window.open('https://www.trefac.jp/store/search_result.html?srchword=&step=1&k_uid=hDolW1eY1XGIQR60CCnpmcdyHYnRjt&q=${encodeURIComponent(keyword)}&searchbox=1','_blank')">
👔 トレファクスタイル
</button>

<button onclick="window.open('https://okoku.jp/pages/search-results-page?q=${encodeURIComponent(keyword)}','_blank')">
👑 買取王国
</button>
`;

}
function addHighValue(brand){

    const input = document.getElementById("newHighValue");

    const value = input.value.trim();

    if(!value){
        alert("高値要素を入力してください");
        return;
    }

    let list = JSON.parse(
        localStorage.getItem("highValue_" + brand)
    ) || [];

    if(!list.includes(value)){
        list.push(value);
    }

    localStorage.setItem(
        "highValue_" + brand,
        JSON.stringify(list)
    );

    showBrandInfo(brand);

}
async function toggleFavorite(brand) {

  try {

    // お気に入りから削除
    if (favoriteBrands.includes(brand)) {

      const { error } = await supabaseClient
        .from("favorite_brands")
        .delete()
        .eq("brand", brand);

      if (error) {
        console.error(
          "お気に入り削除エラー",
          error
        );
        alert("お気に入りの削除に失敗しました");
        return;
      }

      favoriteBrands =
        favoriteBrands.filter(
          item => item !== brand
        );

    } else {

      // お気に入りに追加
      const { error } = await supabaseClient
        .from("favorite_brands")
        .insert({
          brand: brand
        });

      if (error) {
        console.error(
          "お気に入り追加エラー",
          error
        );
        alert("お気に入りの追加に失敗しました");
        return;
      }

      favoriteBrands.push(brand);

    }

    drawBrands();
    showBrandInfo(brand);

  } catch (error) {

    console.error(
      "お気に入り処理エラー",
      error
    );

    alert("エラーが発生しました");

  }

}
  

function addBrand(brand) {

  brand = brand.trim();

  if (!brand) {
    return;
  }

  // 自分のブランド一覧に追加
  if (!myBrands.includes(brand)) {

    myBrands.push(brand);

    localStorage.setItem(
      "myBrands",
      JSON.stringify(myBrands)
    );

  }

  // 選択中ブランドにする
  selectedBrand = brand;

  // 最近見たブランドにも追加
  addRecentBrand(brand);

  // ブランド検索欄を空にする
  document.getElementById("brandSearch").value = "";

  // 検索欄にブランド名を入れる
  document.getElementById("keyword").value = brand;

  // 一覧を更新
  drawBrands();

  // ブランド情報を表示
  showBrandInfo(brand);

}
function addRecentBrand(brand) {

  // すでにある場合はいったん削除
  recentBrands =
    recentBrands.filter(item => item !== brand);

  // 一番上に追加
  recentBrands.unshift(brand);

  // 最大10件
  recentBrands =
    recentBrands.slice(0, 10);

  localStorage.setItem(
    "recentBrands",
    JSON.stringify(recentBrands)
  );
}
function removeRecentBrand(brand) {

  recentBrands =
    recentBrands.filter(
      item => item !== brand
    );

  localStorage.setItem(
    "recentBrands",
    JSON.stringify(recentBrands)
  );

  drawBrands();

}
// =========================
// ⭐ お気に入りブランド削除
// =========================

function removeFavoriteBrand(brand) {

  if (!confirm(brand + " をお気に入りから削除しますか？")) {
    return;
  }

  favoriteBrands =
    favoriteBrands.filter(item => item !== brand);

  localStorage.setItem(
    "favoriteBrands",
    JSON.stringify(favoriteBrands)
  );

  drawBrands();
}


// =========================
// 📚 自分で登録したブランド削除
// =========================

function removeMyBrand(brand) {

  if (!confirm(brand + " を登録ブランドから削除しますか？")) {
    return;
  }

  myBrands =
    myBrands.filter(item => item !== brand);

  localStorage.setItem(
    "myBrands",
    JSON.stringify(myBrands)
  );

  // お気に入りにも入っていたら削除
  favoriteBrands =
    favoriteBrands.filter(item => item !== brand);

  localStorage.setItem(
    "favoriteBrands",
    JSON.stringify(favoriteBrands)
  );

  drawBrands();

  // 削除したブランドを表示していたら消す
  if (selectedBrand === brand) {
    selectedBrand = "";
    document.getElementById("brandInfo").innerHTML = "";
  }
}
// =========================
// 画像アップロード
// =========================

async function uploadImage(file, brand, memo = "") {

  if (!file) {
    alert("画像を選択してください");
    return;
  }

  try {

    // ファイル名を安全にする
    const extension = file.name.split(".").pop();

    const fileName =
      `${Date.now()}_${Math.random().toString(36).substring(2)}.${extension}`;

    // -------------------------
    // Storageへアップロード
    // -------------------------

    const { data: uploadData, error: uploadError } =
      await supabaseClient.storage
        .from("images")
        .upload(fileName, file);

    if (uploadError) {
      console.error("画像アップロード失敗", uploadError);
      alert("画像のアップロードに失敗しました");
      return;
    }

    // -------------------------
    // 公開URL取得
    // -------------------------

    const { data: publicUrlData } =
      supabaseClient.storage
        .from("images")
        .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // -------------------------
    // imagesテーブルへ保存
    // -------------------------

    const { data, error } =
      await supabaseClient
        .from("images")
        .insert([
          {
            brand: brand,
            image_url: imageUrl,
            memo: memo
          }
        ])
        .select();

    if (error) {
      console.error("データベース保存失敗", error);
      alert("画像情報の保存に失敗しました");
      return;
    }

    console.log("保存成功", data);

    alert("画像を保存しました！");

  } catch (error) {

    console.error("予期しないエラー", error);
    alert("エラーが発生しました");

  }
}
// =========================
// 仕入れ画像保存
// =========================

document
  .getElementById("saveImageButton")
  .addEventListener("click", saveImage);


async function saveImage() {

  const brand =
    document
      .getElementById("imageBrand")
      .value
      .trim();

  const memo =
    document
      .getElementById("imageMemo")
      .value
      .trim();

  const file =
    document
      .getElementById("imageFile")
      .files[0];

  const status =
    document.getElementById("imageSaveStatus");


  // -------------------------
  // 入力チェック
  // -------------------------

  if (!brand) {
    alert("ブランド名を入力してください");
    return;
  }

  if (!file) {
    alert("画像を選択してください");
    return;
  }


  status.textContent =
    "画像をアップロードしています…";


  try {

    // -------------------------
    // ファイル名作成
    // -------------------------

    const extension =
      file.name.split(".").pop();

    const fileName =
      `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}.${extension}`;


    // -------------------------
    // Supabase Storage
    // -------------------------

    const { error: uploadError } =
      await supabaseClient
        .storage
        .from("images")
        .upload(
          fileName,
          file
        );


    if (uploadError) {

      console.error(
        "画像アップロードエラー",
        uploadError
      );

      status.textContent =
        "画像のアップロードに失敗しました";

      return;
    }


    // -------------------------
    // 公開URL取得
    // -------------------------

    const { data: publicData } =
      supabaseClient
        .storage
        .from("images")
        .getPublicUrl(fileName);


    const imageUrl =
      publicData.publicUrl;


    // -------------------------
    // データベース保存
    // -------------------------

    const { error: dbError } =
      await supabaseClient
        .from("images")
        .insert([
          {
            brand: brand,
            image_url: imageUrl,
            memo: memo
          }
        ]);


    if (dbError) {

      console.error(
        "データベース保存エラー",
        dbError
      );

      status.textContent =
        "画像情報の保存に失敗しました";

      return;
    }


    // -------------------------
    // 完了
    // -------------------------

    status.textContent =
      "✅ 画像を保存しました！";

    document
      .getElementById("imageBrand")
      .value = "";

    document
      .getElementById("imageMemo")
      .value = "";

    document
      .getElementById("imageFile")
      .value = "";


  } catch (error) {

    console.error(
      "予期しないエラー",
      error
    );

    status.textContent =
      "エラーが発生しました";

  }

}


// =========================
// 保存画像
// =========================

let savedImageData = [];


// 保存画像読み込み
const loadImagesButton =
  document.getElementById("loadImagesButton");

if (loadImagesButton) {

  loadImagesButton.addEventListener(
    "click",
    function () {

      console.log("保存画像ボタンが押されました");

      loadSavedImages();

    }
  );

}
// =========================
// ブランド絞り込み
// =========================



// すべて表示
document
  .getElementById("clearImageFilter")
  .addEventListener("click", function() {

    document
      .getElementById("imageBrandFilter")
      .value = "";

    displaySavedImages(savedImageData);

  });


// =========================
// データ取得
// =========================

// =========================
// 保存画像をブランド指定で取得
// =========================

async function loadSavedImages() {

  console.log("保存画像を読み込み開始");

  const area =
    document.getElementById("savedImages");

  area.innerHTML =
    "画像を読み込んでいます…";


  try {

    const brand =
      document
        .getElementById("imageBrandFilter")
        .value
        .trim();


    console.log(
      "検索ブランド:",
      brand
    );


    // -------------------------
    // Supabase検索
    // -------------------------

    let query =
      supabaseClient
        .from("images")
        .select("*");


    // ブランドが入力されている場合
    // → そのブランドだけ取得

    if (brand) {

  query = query.ilike(
    "brand",
    brand
  );

}


    // 新しい画像順

    const { data, error } =
      await query
        .order("created_at", {
          ascending: false
        });


    console.log(
      "取得件数:",
      data ? data.length : 0
    );


    // -------------------------
    // エラー
    // -------------------------

    if (error) {

      console.error(
        "画像読み込みエラー",
        error
      );

      area.innerHTML =
        "画像の読み込みに失敗しました";

      return;

    }


    // -------------------------
    // 保存
    // -------------------------

    savedImageData =
      data || [];

console.log("★ Supabaseから返ってきたブランド:");

data.forEach(item => {
  console.log(item.brand);
});
    // -------------------------
    // 表示
    // -------------------------

    displaySavedImages(
      savedImageData
    );


  } catch (error) {

    console.error(
      "予期しないエラー",
      error
    );

    area.innerHTML =
      "エラーが発生しました";

  }

}


// =========================
// 画像表示
// =========================

function displaySavedImages(data) {

  const area =
    document.getElementById("savedImages");

  area.innerHTML = "";


  if (!data || data.length === 0) {

    area.innerHTML =
      "該当する画像がありません";

    return;
  }


  data.forEach(item => {

    const card =
      document.createElement("div");

    card.style.border =
      "1px solid #ddd";

    card.style.borderRadius =
      "10px";

    card.style.padding =
      "10px";

    card.style.margin =
      "15px 0";


    const image =
      document.createElement("img");

    image.src =
      item.image_url;

    image.style.width =
      "100%";

    image.style.maxWidth =
      "400px";

    image.style.display =
      "block";

    image.style.borderRadius =
      "8px";

    image.style.cursor =
      "pointer";


    // 画像クリックで拡大
    image.onclick = function() {

      window.open(
        item.image_url,
        "_blank"
      );

    };


    const brand =
      document.createElement("h4");

    brand.textContent =
      "ブランド： " +
      item.brand;


    const memo =
      document.createElement("p");

    memo.textContent =
      item.memo || "";


    const date =
      document.createElement("small");

    date.textContent =
      item.created_at
        ? new Date(item.created_at)
            .toLocaleString("ja-JP")
        : "";


    card.appendChild(image);

    card.appendChild(brand);

    if (item.memo) {
      card.appendChild(memo);
    }

    card.appendChild(date);

    area.appendChild(card);

  });

}