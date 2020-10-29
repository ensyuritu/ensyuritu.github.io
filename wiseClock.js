
            let today = new Date()
            let year = today.getFullYear()
            let month = today.getMonth()
            let day = today.getDate()
            let hour = today.getHours()
            let min = today.getMinutes()
            let sec = today.getSeconds()
            let millsec = today.getMilliseconds()

            function force2digits(num){
                if(num < 10){num = "0" + num}
                return num
            }
            function force3digits(num){
                if(num < 10){num = "00" + num}
                else if(num < 100){num = "0" + num}
                return num
            }

            function update(){
                today = new Date()
                year = today.getFullYear()
                month = force2digits(today.getMonth()+1)
                day = force2digits(today.getDate())
                hour = force2digits(today.getHours())
                min = force2digits(today.getMinutes())
                sec = force2digits(today.getSeconds())
                millsec = force3digits(today.getMilliseconds())

                let text = "今は"+year+"/"+month+"/"+day+" "+hour+":"+min+":"+sec+"."+millsec+"です。"
                document.getElementById('WiseClock').innerHTML = text
            }
            setInterval('update()',13)