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
    "ヴァンテージ",
    "カタリスト",
    "バリスティック",
    "コンジット"
]

const normalWeapons = [
    "30-30リピーター",
    "CAR",
    "EVA-8オート",
    "G7スカウト",
    "Lスター",
    "P2020",
    "R-301カービン",
    "オルタネーター",
    "スピットファイア",
    "センチネル",
    "チャージライフル",
    "ディヴォーション",
    "トリプルテイク",
    "ネメシス",
    "ハボック",
    "ピースキーパー",
    "フラットライン",
    "プラウラー",
    "ボルト",
    "マスティフ",
    "モザンビーク",
    "ロングボウ",
    "R-99",
    "ヘムロック",
    "ランページ"
]

const legendaryWeapons = [
    "RE-45",
    "クレーバー",
    "ウィングマン",
    "ボセック"
]

const craftWeapons = [
//一時的に未使用
]

const wildWeapons = [
    "任意のライトアモ武器",
    "任意のヘビーアモ武器",
    "任意のエネルギーアモ武器",
    "任意のスナイパーアモ武器",
    "任意のショットガンアモ武器",
    "任意のアロー武器"
]



let weaponDuplicationAvaliable = true
let params = (new URL(document.location)).searchParams;
let intervalDelay = 33
let spinning = false
let spinInterval = 0

let weightNormalWeapon = normalWeapons.length
console.log(weightNormalWeapon)
let weightLegendaryWeapon = legendaryWeapons.length
console.log(weightLegendaryWeapon)
let weightCraftWeapon = craftWeapons.length
console.log(weightCraftWeapon)
let weightWildWeapon = 0


function changeWeaponDuplication(){
    weaponDuplicationAvaliable = !weaponDuplicationAvaliable
    if(weaponDuplicationAvaliable){
        weaponDuplicationText.textContent = "そのままにする"
    }else{
        weaponDuplicationText.textContent = "スキップする"
    }
}

function roulette(){
    

    weightNormalWeapon = normalWeaponWeightVal.value - 0
    weightLegendaryWeapon = legendaryWeaponWeightVal.value - 0
    weightCraftWeapon = craftWeaponWeightVal.value - 0
    weightWildWeapon = wildWeaponWeightVal.value - 0

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
    //キャラクターの抽選
    let chr = legends[Math.floor(Math.random() * legends.length)]
    legend.textContent = (chr)
    let wp1 = ""
    let wp2 = ""
    //武器の抽選
    if(weaponDuplicationAvaliable){
        wp1 = chooseWeapon()
        wp2 = chooseWeapon()
    }else{
        while(wp1 == wp2){
            wp1 = chooseWeapon()
            wp2 = chooseWeapon()
        }
    }
    weapon1.textContent = "\u3000"+wp1+"\u3000"
    weapon2.textContent = "\u3000"+wp2+"\u3000"
    if(chr == "バリスティック"){
        let bwp = ""
        let tmpWeightLegendaryWeapon = weightLegendaryWeapon
        weghtLegendaryWeapon = 0
        if(weaponDuplicationAvaliable){
            
            bwp = chooseWeapon()
        }else{
            while(wp1 == bwp || wp2 == bwp){
                bwp = chooseWeapon()
            }
        }
        weightLegendaryWeapon = tmpWeightLegendaryWeapon
        ballisticWeapon.textContent = "\u3000"+"スリング: "+bwp+"\u3000"
    }else{
        ballisticWeapon.textContent = "\u3000"+"スリング: なし"+"\u3000"
    }
}

function chooseWeapon(){//武器選択
    let rnd = Math.random()
    let total = weightNormalWeapon + weightLegendaryWeapon + weightCraftWeapon + weightWildWeapon
    rnd = rnd * total
    
    wp = ""
    if(rnd < weightNormalWeapon){
        wp = normalWeapons[Math.floor(Math.random() * normalWeapons.length)]
    }else if(rnd < weightNormalWeapon + weightLegendaryWeapon){
        wp = legendaryWeapons[Math.floor(Math.random() * legendaryWeapons.length)]
    }else if(rnd < weightNormalWeapon + weightLegendaryWeapon + weightCraftWeapon){
        wp = craftWeapons[Math.floor(Math.random() * craftWeapons.length)]
    }else if((rnd < weightNormalWeapon + weightLegendaryWeapon + weightCraftWeapon + weightWildWeapon)){
        wp = wildWeapons[Math.floor(Math.random() * wildWeapons.length)]
    }

    return wp
}