const legends = [
    "ブラッドハウンド",
    "ジブラルタル",
    "ライフライン",
    "パスファインダー",
    "レイス",
    "バンガロール",
    "ミラージュ",
    "コースティック",
    "オクタン",
    "ワットソン",
    "クリプト",
    "レブナント",
    "ローバ",
    "ランパート",
    "ホライゾン",
    "ヒューズ",
    "ヴァルキリー",
    "シア",
    "アッシュ",
    "マッドマギー",
    "ニューキャッスル",
    "カタリスト"]

const weapons = [
    "P2020",
    "RE-45オート",
    "オルタネーターSMG",
    "G7スカウト",
    "R99 SMG",
    "R301カービン",
    "スピットファイア",
    "CAR SMG",
    "ランページLMG",
    "30-30リピーター",
    "ウィングマン",
    "プラウラー",
    "ヘムロック",
    "フラットライン",
    "ボルトSMG",
    "ハボック",
    "ディヴォーション",
    "モザンビーク",
    "マスティフ",
    "ピースキーパー",
    "EVA8 オート",
    "センチネル",
    "チャージライフル",
    "トリプルテイク",
    "ロングボウDMR",
    "クレーバー",
    "ボセックボウ"
]

let rnd = ((Date.now()*141350357)%4294967295)-2147483648;
let a = 7
let b = 13
let c = 17
let params = (new URL(document.location)).searchParams;
if(params.has("seed") && parseInt(params.get("seed")) != NaN) rnd = parseInt(params.get("seed"))
if(params.has("a") && parseInt(params.get("a")) != NaN) a = parseInt(params.get("a"))
if(params.has("b") && parseInt(params.get("b")) != NaN) b = parseInt(params.get("b"))
if(params.has("c") && parseInt(params.get("c")) != NaN) c = parseInt(params.get("c"))
console.log(rnd)
console.log(a)
console.log(b)
console.log(c)

function getRnd(){
    rnd = (rnd << a) ^ rnd
    rnd = (rnd >> b) ^ rnd
    rnd = (rnd << c) ^ rnd
    return (rnd/4294967296)+0.5
}

function randomize() {
    legend.textContent = (legends[Math.floor(getRnd() * legends.length)])
    weapon1.textContent = (weapons[Math.floor(getRnd() * weapons.length)])
    weapon2.textContent = (weapons[Math.floor(getRnd() * weapons.length)])
}