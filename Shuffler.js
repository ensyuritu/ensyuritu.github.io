
let entryList = []

let forceEnd = 1000
let result
let intervalMillsec = 50
let interval;

let spinning = false

function prepare(){
    let rawList = inputCommand.value
	entryList = rawList.split(/\n/g)
    let count = 0
    while(entryList.length > count){
        if(entryList[count] == ""){
            entryList.splice(count,1)
        }else{
            count++
        }
        
    }
}

function run(){
    while(output.firstChild){//中身リセット
        output.removeChild(output.firstChild)
    }

    let randomizedList = []
    while(entryList.length > 0){
        let listIndex = Math.floor(Math.random()*entryList.length)
        let selected = entryList.splice(listIndex,1)
        randomizedList.push(selected[0])
    }
    
    if(memberCount.value == 1){
        randomizedList.forEach((e) => {
            let str = e + "\n"
            let doc = document.createElement("p")
            doc.textContent = str
            output.appendChild(doc)
        })
    }else if(memberCount.value > 1){
        
        let teamCounter = 0
        let listCounter = 0
        
        // for(let i=0; i<; i++){
        //     memberList += randomizedList[i]
        //     if(i % memberCount.value == 0){
        //         doc.textContent += "\n" + memberList
        //         output.appendChild(doc)
        //     }
            
        // }

        while(listCounter < randomizedList.length){
            let memberList = ""
            let doc = document.createElement("p")
            teamCounter++
            for(let i=0; i<memberCount.value; i++){
                memberList += randomizedList[listCounter] + " , "
                listCounter++
                if(listCounter >= randomizedList.length){
                    break
                }
            }
            console.log(memberList)
            memberList = memberList.slice(0,-3)
            console.log(memberList)
            doc.innerText = "-- Group " + teamCounter + " --\n" + memberList
            output.appendChild(doc)
        }

    }else{
        let doc = document.createElement("p")
        doc.textContent = "memberListの値が不正なため結果を表示できません"
        output.appendChild(doc)
    }

    
}

//以下ボタンイベント

function randomize(){
	prepare()
    run()
}

function toggle(){
    if(!spinning){
        interval = setInterval(randomize,50)
        toggleRandomize.textContent = "STOP"
    }else{
        clearInterval(interval)
        toggleRandomize.textContent = "SPIN"
    }
    spinning = !spinning
}
