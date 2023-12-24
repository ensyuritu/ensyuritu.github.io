const SP7K_CHANNELS = ["16","11","12","13","14","15","18","19"]
//                      SC   01   02   03   04   05   06   07
//DP7KかPMS9Kは需要があり次第


let defines=[]//BMSのコマンドを全部入れるやつ

let bpm = 0//基本BPM
let notesCount = 0//総ノーツ数
let duration = 0//曲の長さ(ミリ秒)

let notesDefines=[]//ノーツ定義まとめ
let notes=[]//ノーツの位置をms単位でまとめたもの

let measureLengths=[]//小節の長さ 1小節=1.0 
let bpms=[]//0:小節数 1:小節内での位置 2:変更するBPM
let measureTimes=[]//小節の時間の長さ
//1小節が1の場合は4分割で4分音符
//1小節が0.5(半分)の場合4分割は8分音符の長さ

let legacyBpmDefines = []//通常BPM定義 1~255の整数値 0は変化しない
let extendBpmDefines = []//拡張BPM定義 実数値 undefinedは変化しない
//let modernBpmDefines = []
let bpmDefines = []//拡張BPM定義によるBPM実数値
let bpmChangeDefines = []//BPM変化をlegacyのものとまとめたもの

let timings = []//それぞれの小節で何msなのかを置いておく 未定義区間は線形補完で大丈夫

let loglevel = 0

//legacyBpmDefined || extendBpmDefined
let legacyBpmDefined = false
let extendBpmDefined = false

let difficultys = []

function changeFile(){
    
    processStatus.innerText="処理中...\n"
    
    
    const BMS_FILES = document.querySelector("#bms_file").files
    const BMS_FILE = BMS_FILES[0]
    let result
    
    const reader = new FileReader()
    reader.readAsText(BMS_FILE)

    reader.onload = () => {
        result = reader.result
        loadIntervalID = setTimeout(loadbms,0,result)
        //loadbms(result)
    }

    reader.onerror = () => {
        console.log("FileReadError")
    }
}

function loadbms(text){
    

    defines = text.split("\n")
    //小節の長さ書き出し
    
    setTimeout(loadMeasureLengths,0)
    //loadMeasureLengths()


    //BPM定義読み取り
    bpmString = filterString(defines, "#BPM ")[0].slice(5)
    bpm = bpmString - 0
    console.log("bpm = "+bpm)

    //BPM変化書き出し
    //旧定義
    setTimeout(loadBPMLegacy,0)
    //loadBPMLegacy()

    //BPM割り当て定義
    ///loadBPMDefine()
    setTimeout(loadBPMDefine,0)
    //08チャンネルによるBPM変化定義

    //loadBPMExtend()
    setTimeout(loadBPMExtend,0)

    //BPM変化最終定義
    //defineBPM()
    setTimeout(defineBPM,0)
    
    //経過時間を小節ごとに記録
    //defineTiming()
    setTimeout(defineTiming,0)
    
    //鍵盤とスクラッチ書き出し SP7K
    //notesDefines = [] //使わない説浮上
    //defineNotesTimings_SP7K()
    setTimeout(defineNotesTimings_SP7K,0)

    //難易度推定
    setTimeout(estimateDiff_SP7K,0)

    //clearInterval(repaintIntervalID)
    processStatus.innerText += "小節長の読み取り\n"
}

//以下汎用関数
function filterString(array, target){//コマンド読み取りに使用
    return array.filter((str) => str.includes(target))
}

function zeroPadding(num, len){
	return ( Array(len).join('0') + num ).slice( -len );
}

function greatestCommonDivisor(value1,value2){
    let r , a = value1 , b = value2

    do{
        r = a % b
        a = b;b = r
    }while( r !== 0 )

    return a
}

function leastCommonMultiple(value1, value2){
    return value1 * value2 / greatestCommonDivisor(value1, value2)
}

function BPMtoMSPM(bpm){//1小節で経過する時間
    let a = bpm
    a = a / 60 //bpm to bps
    a = a / 4 //bps to mps
    a = 1 / a //mps to spm
    a = a * 1000 //spm to mspm
    return a
}

function BPMtoSPMes(bpm){
    let a = bpm
    a = a / 60 //b/m to b/s
    a = a / 4 //b/s to mes/s
    a = 1 / a //mes/s to s/mes
    return a
}

/**
 * 
 * @param {string} data 
 * @returns {string[]}
 */
function readData(data){
    console.log("data="+data)
    let slicedData = []
    let c = 0
    while(data.length > c*2+1){
        slicedData.push(data.slice(c*2,c*2+2))
        c++
    }
    console.log(slicedData)
    return slicedData
}

function linear(start, end, index){
    
    const diff = end - start
    console.log(start+"~"+end+"("+index+")"+" result="+(start + index * diff))
    return start + index * diff
}

/**
 * 
 * @param {int} measure 
 * @param {int} scale
 * @param {int} index 
 * 
 * @returns {float}
 */
function timing(measure, scale, index){
    let milsec = 0
    if(scale == timings[measure].length){
        milsec = timings[measure][index]
    }else{
        const place = index / scale * timings[measure].length //小節内でのtimingsにおける場所
        console.log("length:"+timings[measure].length+" place:"+place+"(sc="+scale+" , index="+index+")")

        if(Math.ceil(place) == timings[measure].length){
            milsec = linear(timings[measure][Math.floor(place)], timings[measure+1][0], place - Math.floor(place))
        }else{
            milsec = linear(timings[measure][Math.floor(place)], timings[measure][Math.ceil(place)], place - Math.floor(place))
        }
    }
    console.log("ms="+milsec)
    return milsec
}

function scrapeArray(array, lowest, highest){
    let arr = []
    for(let i=0; i<array.length; i++){
        if(lowest < array[i] && array[i] < highest){
            arr.push(array[i])
        }
    }
    return arr
}

//以下BMS読み取り処理
function loadMeasureLengths(){//小節長
    let measureDefined = false
    measureLengths = []
    
    for(let i=0; i<1000; i++){
        let measureDefine = filterString(defines, "#"+zeroPadding(i,3)+"02")

        if(measureDefine.length == 0){//定義されてないとき
            measureLengths[i] = 1
        }

        else{//定義されてるとき
            measureLengths[i] = measureDefine[measureDefine.length - 1].slice(7) - 0
            measureDefined = true
        }
    }
    if(measureDefined){
        console.log("特殊小節長は定義されている")
    }else{
        console.log("特殊小節長は未定義")
    }
    processStatus.innerText += "BPM定義読み取り(1/4)\n"
}

function loadBPMLegacy(){
    legacyBpmDefines=[]
    legacyBpmDefined = false
    for(let i=0; i<1000; i++){
        let bpmDefine = filterString(defines, "#"+zeroPadding(i,3)+"03")

        if(bpmDefine.length >= 1){
            legacyBpmDefined = true
            let defineText = bpmDefine[bpmDefine.length - 1].slice(7)
            console.log(i+":"+defineText)
            let c = 0
            legacyBpmDefines[i]=[]
            while(defineText.length > c*2+1){
                let bpmHex = defineText.slice(c*2,c*2+2)
                console.log("c:"+c, " bpmHex:"+bpmHex+" parsedBPM:"+parseInt(bpmHex,16))
                let bpmInt = parseInt(bpmHex,16)
                if(bpmInt == 0) legacyBpmDefines[i][c] = undefined
                else legacyBpmDefines[i][c] = bpmInt
                c++
            }
        }
    }
    if(legacyBpmDefined){
        console.log("BPM変化(legacy)は定義されている")
    }else{
        console.log("BPM変化(legacy)は未定義")
    }
    processStatus.innerText += "BPM定義読み取り(2/4)\n"
}

function loadBPMDefine(){
    bpmDefines = []
    bpmDefines["00"] = undefined
    let bpmChangeDefined = false
    for(let i=0; i<1296; i++){
        let defineSuffix = i.toString(36).toUpperCase()
        defineSuffix = zeroPadding(defineSuffix, 2)
        let bpmDefine = filterString(defines, "#BPM"+defineSuffix)
        let bpmstr = ""
        if(bpmDefine.length >= 1){
            bpmChangeDefined = true
            bpmstr = bpmDefine[bpmDefine.length - 1].slice(6)
            console.log(bpmstr)
            bpmDefines[defineSuffix] = parseFloat(bpmstr)
            console.log("BPM"+defineSuffix+": "+bpmDefines[defineSuffix])
        }
    }
    if(bpmChangeDefined){
        console.log("拡張BPMは定義されている")
    }else{
        console.log("拡張BPMは未定義")
    }
    processStatus.innerText += "BPM定義読み取り(3/4)\n"
}

function loadBPMExtend(){
    
    extendBpmDefines = []
    extendBpmDefined = false
    for(let i=0; i<1000; i++){
        let bpmDefine = filterString(defines, "#"+zeroPadding(i,3)+"08")

        if(bpmDefine.length != 0){
            extendBpmDefined = true
            let defineText = bpmDefine[bpmDefine.length - 1].slice(7)
            console.log(i+":"+defineText)
            let c = 0
            extendBpmDefines[i]=[]
            while(defineText.length > c*2+1){
                let bpmDef = defineText.slice(c*2,c*2+2)
                console.log("c:"+c+ " bpmDef:"+bpmDef+" bpm:"+bpmDefines[bpmDef])
                let bpm = bpmDefines[bpmDef]

                extendBpmDefines[i][c] = bpm
                c++
            }
        }
    }
    if(extendBpmDefined){
        console.log("拡張BPM変化は定義されている")
    }else{
        console.log("拡張BPM変化は未定義")
    }
    processStatus.innerText += "BPM定義読み取り(4/4)\n"
}

function defineBPM(){
    if(legacyBpmDefined || extendBpmDefined){//BPM変化が一切定義されていない場合全スキップ
        for(let i=0; i<1000; i++){
            if(legacyBpmDefines[i] != undefined && extendBpmDefines[i] != undefined){
                console.log("i:"+i+" 両方")
                bpmChangeDefines[i] = []
                let bpmDefsLCM = leastCommonMultiple(legacyBpmDefines[i].length, extendBpmDefines[i].length)

                let legacyDefsStep = bpmDefsLCM / legacyBpmDefines[i].length
                let extendDefsStep = bpmDefsLCM / extendBpmDefines[i].length

                let legacyDefIndex = 0
                let extendDefIndex = 0

                for(let j=0; j<bpmDefsLCM; j++){
                    if(j%legacyDefsStep == 0 && j%extendDefsStep == 0){
                        if(legacyBpmDefines[i][legacyDefIndex] == undefined){
                            bpmChangeDefines[i][j] = extendBpmDefines[i][extendDefIndex]
                        }
                        else if(extendBpmDefines[i][extendDefIndex] == undefined){
                            bpmChangeDefines[i][j] = legacyBpmDefines[i][legacyDefIndex]
                        }else{
                            processStatus.innerText += "完全なBPMの重複定義のため処理できません"
                            reflow(processStatus)
                            return
                        }
                        legacyDefIndex++
                        extendDefIndex++
                    }else if(j%legacyDefsStep== 0){
                        bpmChangeDefines[i][j] = legacyBpmDefines[i]
                        legacyDefIndex++
                    }else if(j%extendDefsStep == 0){
                        bpmChangeDefines[i][j] = extendBpmDefines[i][extendDefIndex]
                        extendDefIndex++
                    }else{
                        bpmChangeDefines[i][j] = undefined
                    }
                }
            }
            else if(legacyBpmDefines[i] != undefined){
                console.log("i:"+i+" legacy length:")
                bpmChangeDefines[i] = []
                for(let j=0; j<legacyBpmDefines[i].length; j++){
                    bpmChangeDefines[i][j] = legacyBpmDefines[i][j]
                }
            }
            else if(extendBpmDefines[i] != undefined){
                console.log("i:"+i+" 拡張定義")
                bpmChangeDefines[i] = []
                for(let j=0; j<extendBpmDefines[i].length; j++){
                    bpmChangeDefines[i][j] = extendBpmDefines[i][j]
                }
            }
        }
        console.log("BPM変化の最終定義が完了")
    }
    processStatus.innerText += "経過時間の計算\n"
}

function defineTiming(){
    timings = []
    
    let currentTiming = 0 //処理中の場所 単位msの浮動小数
    let currentBPM = bpm
    for(let i=0; i<1000; i++){
        timings[i] = []
        if(bpmChangeDefines[i] != undefined){
            const changeDefCount = bpmChangeDefines[i].length
            for(let j=0; j<changeDefCount; j++){
                timings[i][j] = currentTiming
                console.log("mes#"+i+"-"+j+": "+currentTiming)
                currentTiming += BPMtoMSPM(currentBPM) * measureLengths[i] / changeDefCount
                if(bpmChangeDefines[i][j] != undefined) currentBPM = bpmChangeDefines[i][j]
            }

        }else{
            timings[i][0] = currentTiming
            console.log("mes#"+i+": "+currentTiming)
            currentTiming += BPMtoMSPM(currentBPM) * measureLengths[i]
        }
    }
    processStatus.innerText += "ノーツの読み取り\n"
}

function defineNotesTimings_SP7K(){
    notes=[]
    notesCount = 0
    duration = 0

    for(let i=0; i<8; i++){//i 鍵盤
        const ChannelSuffix = SP7K_CHANNELS[i]
        notes[i] = []
        for(let j=0; j<1000; j++){//j 小節
            const notesRawData = filterString(defines, "#"+zeroPadding(j,3)+ChannelSuffix+":")
            
            if(notesRawData.length >= 1) console.log("#"+zeroPadding(j,3)+ChannelSuffix+"の定義数:"+notesRawData.length)

            for(let k=0; k<notesRawData.length; k++){//k 多重定義の読み取り
                const data = readData(notesRawData[k].slice(7))

                for(let l=0; l<data.length; l++){//l ノーツの読み取り
                    
                    if(data[l] != "00"){//そこにノーツがあったとき
                        notesCount += 1
                        const thisTiming = timing(j, data.length, l)
                        notes[i].push(thisTiming)

                        if(thisTiming > duration) duration = thisTiming

                    }
                }
            }
        }
        notes[i].sort((a, b) => a - b)
    }
    processStatus.innerText += "難易度推定計算(1/?)\n"
}

function estimateDiff_SP7K(){
    for(let i=0; i<8; i++){
        setTimeout(calculateDiff_SP7K,0,i)
    }
    setTimeout(outputDiff_SP7K,0)
    console.log("総ノーツ数: "+notesCount)
    console.log("曲の長さ: "+duration)
}

function calculateDiff_SP7K(lane){
    let diff = 0
    
    let notesCounter = 0
    let calculateCounter = 0
    for(let i=0; i<notes[lane].length; i++){
        for(let j=0; j<8; j++){
            const afterNotes = scrapeArray(notes[j], notes[lane][i], notes[lane][i] + (duration / notesCount) * 10)


            for(let k=0; k<afterNotes.length; k++){
                diff += 1 / (afterNotes[k] - notes[lane][i])
                calculateCounter += 1
            }
            
        }
        
        notesCounter += 1
    }
    diff = diff / notesCounter
    diff = diff * 440

    console.log("鍵盤#"+lane+" ノーツ数:"+notesCounter+" 計算回数:"+calculateCounter+" 難易度:"+diff)
    difficultys[lane] = diff
    if(lane == 7){
        processStatus.innerText += "難易度推定終了\n"
    }else{
        processStatus.innerText += "難易度推定計算("+(lane+2)+"/8)\n"
    }
}

function outputDiff_SP7K(){
    const sc_diff = difficultys[0]
    let key_diff = 0
    for(let i=0; i<7; i++){
        key_diff += difficultys[i+1]
    }
    key_diff = key_diff / 7
    diffOutput.innerText = ""
    diffOutput.innerText += "難易度\n"
    diffOutput.innerText += key_diff.toFixed(3)+" + SC"+sc_diff.toFixed(3)
}