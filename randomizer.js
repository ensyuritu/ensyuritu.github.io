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
let weaponDuplicationAvaliable = true
let params = (new URL(document.location)).searchParams;
if(params.has("seed") && parseInt(params.get("seed")) != NaN) rnd = parseInt(params.get("seed"))
if(params.has("a") && parseInt(params.get("a")) != NaN) a = parseInt(params.get("a"))
if(params.has("b") && parseInt(params.get("b")) != NaN) b = parseInt(params.get("b"))
if(params.has("c") && parseInt(params.get("c")) != NaN) c = parseInt(params.get("c"))
console.log(rnd)
console.log(a)
console.log(b)
console.log(c)
seed.textContent = rnd

function getRnd(){
    rnd = (rnd << a) ^ rnd
    rnd = (rnd >> b) ^ rnd
    rnd = (rnd << c) ^ rnd
    return (rnd/4294967296)+0.5
}

function setSeed(){
    const s = parseInt(seed.textContent)
    if(isNaN(s)){
        seedMessage.textContent = "数値を半角数字で入力してください。"
    }else if(s < -2147483648 || 2147483647 < s){
        seedMessage.textContent = "数値が範囲外です。 -2147483648~2147483647の範囲で入力してください。"
    }else if(s == 0){
        seedMessage.textContent = "シード値は0にできません。"
    }
    else{
        seedMessage.textContent = "シード値["+s+"]が適用されました。小数は反映されません。"
        rnd = s
    }
}

function changeWeaponDuplication(){
    weaponDuplicationAvaliable = !weaponDuplicationAvaliable
    if(weaponDuplicationAvaliable){
        weaponDuplicationText.textContent = "そのままにする"
    }else{
        weaponDuplicationText.textContent = "スキップする"
    }
}

function randomize() {
    legend.textContent = (legends[Math.floor(getRnd() * legends.length)])
    let wp1 = ""
    let wp2 = ""
    
    if(weaponDuplicationAvaliable){
        wp1 = (weapons[Math.floor(getRnd() * weapons.length)])
        wp2 = (weapons[Math.floor(getRnd() * weapons.length)])
    }else{
        while(wp1 == wp2){
            wp1 = (weapons[Math.floor(getRnd() * weapons.length)])
            wp2 = (weapons[Math.floor(getRnd() * weapons.length)])
        }
    }
    weapon1.textContent = wp1
    weapon2.textContent = wp2
}