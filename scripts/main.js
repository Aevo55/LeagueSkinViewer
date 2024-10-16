//Dawson Gilmore
let freeRotationURL = "https://na1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=RGAPI-350700f9-a5f4-4559-b8c9-491023ae5705"
let allChampionsURL = "https://ddragon.leagueoflegends.com/cdn/14.19.1/data/en_US/champion.json"
let championDataURL = "https://ddragon.leagueoflegends.com/cdn/14.19.1/data/en_US/champion/" // + Name.json
let championSquareURL = "https://ddragon.leagueoflegends.com/cdn/14.19.1/img/champion/" // + Name.png
let championSplashURL = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/" // + "Name_" + skins[x].num
let championLoadingURL = "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/" //+ "Name_" + skins[x].num
let championPassiveURL = "https://ddragon.leagueoflegends.com/cdn/14.19.1/img/passive/" // + passive.image.full
let championAbilityURL = "https://ddragon.leagueoflegends.com/cdn/14.19.1/img/spell/" // + spells[x].image.full

let currentChampion = 0
let currChampImg
let championList = []

let championColumn = document.getElementsByClassName("champColumn")[0]
let scrollButtonTop = document.getElementsByClassName("scrollButtonTop")[0]
scrollButtonTop.addEventListener('mouseover', scrollUpStart)
scrollButtonTop.addEventListener('mouseout', scrollUpStop)

let scrollButtonBottom = document.getElementsByClassName("scrollButtonBot")[0]
scrollButtonBottom.addEventListener('mouseover', scrollDownStart)
scrollButtonBottom.addEventListener('mouseout', scrollDownStop)

let scrollUp = false
let scrollDown = false

function scrollDownStart(){
     scrollDown = true
     console.log("SCROLLDOWNSTART")
}
function scrollDownStop(){
     scrollDown = false
     console.log("SCROLLDOWNSTOP")
}
function scrollUpStart(){
     scrollUp = true
     console.log("SCROLLUPSTART")
}
function scrollUpStop(){
     scrollUp = false
     console.log("SCROLLUPSTOP")
}

let bgx = 0
let bgdir = -0.5
var intervalId = window.setInterval(function(){
     document.body.style.backgroundPositionX = bgx+"px";
     bgx += bgdir
     if(bgx <= -getBgWidth() + window.innerWidth){
          bgdir = 0.5
     }else if(bgx >= 0){
          bgdir = -0.5
     }

     if(scrollUp){
          console.log("we scrollin up")
          championColumn.scrollTop -= 5
     }else if(scrollDown){
          console.log("we scrolling down")
          championColumn.scrollTop += 5
     }
     if(randSkin){
          if(window.innerWidth > 950){
               skinImage.src = championSplashURL + currentChampion.name + "_" + currentChampion.skins[randSkin].id + ".jpg"
          }else{
               skinImage.src = championLoadingURL + currentChampion.name + "_" + currentChampion.skins[randSkin].id + ".jpg"
          }
     }
}, 10);

//Calculate background size (adjusted by window width/height)
const bgimg = new Image()
bgimg.src = "../img/leagueBackground.webp"
function getBgWidth(){
     return (4096 * (window.innerHeight / 1558))
}
//#endregion

class Champion{
     constructor(name, num){
          this.name = name
          this.skins = []
          this.num = num
     }
}

class Skin{
     constructor(name, id){
          this.name = name
          this.id = id
     }
}

async function init(){
     await fetchChampions()
     loadChampionSquares()
}

async function fetchChampions(){
     let n = 0
     for(const c of Object.keys((await fetchJSON(allChampionsURL)).data)){
          let tmp = new Champion(c, n++)
          tmp.skins = await fetchSkins(c)
          championList.push(tmp)
     }
     //console.log(championList)
}

async function fetchSkins(championName){
     let skins = []
     let json = await fetchJSON(championDataURL + championName + ".json")
     //console.log(json)
     eval("json.data." + championName + ".skins").forEach((s) => {
          skins.push(new Skin(s.name, s.num))
     })
     return skins
}

async function loadChampionSquares(){
     championList.forEach((c) => {
          let currImg = document.createElement("img")
          currImg.src = `${championSquareURL}${c.name}.png`
          currImg.classList.add("champSquareImg")
          currImg.id = `${c.name}Img`
          currImg.num = c.num
          
          championColumn.insertAdjacentElement('beforeend', currImg)

          currImg.addEventListener('click', onChampImgClick)
     })
}

let skinImage = document.getElementById("skinImg")
let skinName = document.getElementById("champName")
let randSkin

function onChampImgClick(evt){
     //Lock Square Highlight
     if(currChampImg){
          currChampImg.classList.remove("champSquareImgSelected")
     }
     currChampImg = evt.currentTarget
     currentChampion = championList[currChampImg.num]
     currChampImg.classList.add("champSquareImgSelected")

     randSkin = Math.floor(Math.random() * currentChampion.skins.length)
     
     //Update Name
     skinName.innerText = currentChampion.skins[randSkin].name

     if(window.innerWidth > 950){
          skinImage.src = championSplashURL + currentChampion.name + "_" + currentChampion.skins[randSkin].id + ".jpg"
     }else{
          skinImage.src = championLoadingURL + currentChampion.name + "_" + currentChampion.skins[randSkin].id + ".jpg"
     }

     console.log(currentChampion.name);
}

async function fetchJSON(url){
     let val
     await fetch(url)
     .then(r => {
          return r.json();
     })
     .then(d => {
          val = d
     })
     .catch(e => {
          console.log("ERROR")
          console.log(e)
     })
     return val
}

init()