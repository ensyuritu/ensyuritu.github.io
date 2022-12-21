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

function randomize() {
    legend.textContent = (legends[Math.floor(Math.random() * legends.length)])
    weapon1.textContent = (weapons[Math.floor(Math.random() * weapons.length)])
    weapon2.textContent = (weapons[Math.floor(Math.random() * weapons.length)])
}