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
    "ボセックボウ",
    "ネメシスバーストAR"
]

let rnd = ((Date.now()*141350357)%4294967295)-2147483648;
let a = 13
let b = 17
let c = 5
let weaponDuplicationAvaliable = true
let params = (new URL(document.location)).searchParams;
let intervalDelay = 33
let spinning = false
let spinInterval = 0

seedMessage.textContent = "現在時刻に基づき、初期シード値["+rnd+"]が適用されています。"
if(params.has("a") && parseInt(params.get("a")) != NaN) a = parseInt(params.get("a"))
if(params.has("b") && parseInt(params.get("b")) != NaN) b = parseInt(params.get("b"))
if(params.has("c") && parseInt(params.get("c")) != NaN) c = parseInt(params.get("c"))
console.log(rnd)
console.log(a)
console.log(b)
console.log(c)
seed.value = rnd
shift1.value = a
shift2.value = b
shift3.value = c
rouletteDelay.value = intervalDelay
shiftMessage.textContent = "現在のビットシフトの組み合わせは["+a+"] ["+b+"] ["+c+"] です。"


function getRnd(){
    rnd = (rnd << a) ^ rnd
    rnd = (rnd >> b) ^ rnd
    rnd = (rnd << c) ^ rnd
    return (rnd/4294967296)+0.5
}

function setSeed(){
    const s = parseInt(seed.value)
    if(isNaN(s)){
        seedMessage.textContent = "数値を入力してください。"
    }
    else if(s < -2147483648 || 2147483647 < s){
        seedMessage.textContent = "数値が範囲外です。 -2147483648から2147483647の範囲内で入力してください。"
    }
    else if(s == 0){
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

function sethift(){
    const ta = shift1.value
    const tb = shift2.value
    const tc = shift3.value
    if(isNaN(parseInt(shift1.value) + parseInt(shift2.value) + parseInt(shift3.value))){
        shiftMessage.textContent = "数値を入力してください。"
        return
    }else if(ta == tb || tb == tc || tc == ta){
        shiftMessage.textContent = "同じ値がある場合適用できません。"
        return
    }
    a = ta
    b = tb
    c = tc
    shiftMessage.textContent = "ビットシフト["+a+"] ["+b+"] ["+c+"]が適用されました。"
}

function setAdvanced(){
    let elements = document.getElementsByClassName("advanced")
    activateAdvanced.hidden = "true"
    for(element of elements){
        element.hidden = false
    }
}

function setRouletteDelay(){
    const s = parseInt(rouletteDelay.value)
    if(isNaN(s)){
        rouletteDelayMessage.textContent = "数値を入力してください。"
    }else{
        rouletteDelayMessage.textContent = "抽選間隔["+s+"]msが適用されました。"
        intervalDelay = s
    }
}

function roulette(){
    console.log(spinning)
    if(!spinning){
        spinInterval = setInterval(randomize, intervalDelay)
        rouletteButton.textContent = "STOP"
        spinning = true
    }else{
        clearInterval(spinInterval)
        rouletteButton.textContent = "SPIN"
        spinning = false
    }
}

function randomize() {
    currentSeed.textContent = "この構成のシード値: "+rnd
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
    weapon1.textContent = "\u3000"+wp1+"\u3000"
    weapon2.textContent = "\u3000"+wp2+"\u3000"
}