
const regNumTag = /#\d+/g



let commands = []
let ids = []
let texts = []
let forceEnd = 1000
let result
let intervalMillsec = 50
let interval;

let spinning = false

function readText(){
	
	let text = inputCommand.value//ここでテキストの読み取り
   texts = text.split(/\n/g)
}

function setCode(codes){
	const regGroup = /\[[\w\.]+\]/
	const regInside = /[\w\.]+/
	let i = 0
	let currId = -1
	commands = []
	ids = []
	
	while(codes[i] != undefined){
		if(regGroup.test(codes[i]) == true){
			currId++
			ids.push(regInside.exec(codes[i])[0])
			i++
			commands.push([])
		}
		if(codes[i] != ""){
			commands[currId].push(codes[i])
		}
		i++
	}
}

function runCommand(command){
	let str = ""+command
	let arr;
	const regGroupTag = /\([\w\.]+\)|(\{[\w\.]+\})|(\<[\w\.]+\>)/g
	while ((arr = regGroupTag.exec(command)) !== null) {
	
		if(forceEnd <= 0){
            overloadMessage.hidden = false
			break
		}
		forceEnd -= 1
		let res = ""
		let comm = arr[0]
		if(comm.indexOf("(") == 0){
			res = runCommand(comm.slice(1,-1))
		}
		else if(comm.indexOf("<") == 0){
			const id = ids.indexOf(comm.slice(1,-1))
			res = commands[id][Math.floor(Math.random()*commands[id].length)]
			commands[id].splice(commands[id].indexOf(res),1)
			res = runCommand(res)
		}
		else if(comm.indexOf("{") == 0){
			const id = ids.indexOf(comm.slice(1,-1))
			res = commands[id][Math.floor(Math.random()*commands[id].length)]
			res = runCommand(res)
		}else{
			console.error("どういうわけか正規表現をすりぬけてきやがりました")
		}
		
		str = str.replace(comm, res)
	}
	return str
}

function run(){
	let rootPos = ids.indexOf("root")
	let i = 0
	let str = ""
    overloadMessage.hidden = true
    processingMessage.hidden = false
    while(output.firstChild){
        output.removeChild(output.firstChild)
    }

	while(commands[rootPos][i] != undefined){
        forceEnd = overloadCount.value
		str = runCommand(commands[rootPos][i])
        let doc = document.createElement("p")
        doc.textContent = str
        output.appendChild(doc)
		i++
	}
	console.log(forceEnd)
    processingMessage.hidden = true
}

function prepare(){
	readText()
	setCode(texts)
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
