let xp = 0
let health = 100
let gold = 50
let currentWeapon = 0
let fighting
let monsterHealth
let inventory = ["stick"]


const button1 = document.querySelector('#button1')
const button2 = document.querySelector("#button2")
const button3 = document.querySelector("#button3")
const text = document.querySelector("#text")
const xpText = document.querySelector("#xpText")
const healthText = document.querySelector("#healthText")
const goldText = document.querySelector("#goldText")
const monsterStats = document.querySelector("#monsterStats")
const monsterHealthText = document.querySelector("#monsterHealth")
const monsterName = document.querySelector("#monsterName")
const monsterImage = document.querySelector("#monsterImage")

const weapons = [
    { name: 'stick', power: 5},
    {name: 'adaga', power: 30},
    {name: 'machado', power: 50},
    {name: 'espada', power: 100}
]

const monsters = [
    {
        name: "Slime",
        level: 2,
        health: 15,
        image: "images/slime.png"
    },
    {
        name: "Worg",
        level: 8,
        health: 60,
        image: "images/worg.png"
    },
    {
        name: "Dragao",
        level: 20,
        health: 300,
        image: "images/dragao.png"
    }
]

const locations = [
    {
        name: "centro cidade",
        "button text": ["Ir a loja", "Ir a caverna", "Lutar contra o dragão"],
        "button functions": [goStore, goCave, fightDragon],
        text: "Você esta no centro da cidade. Você vê uma placa escrito \"Loja\"."
    },
    {
        name: "loja",
        "button text": ["Comprar 10 de vida (10 ouro)", "Comprar arma (30 ouro)", "Voltar ao centro"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "Você entrou na loja."
    },
    {
        name: "caverna",
        "button text": ["Lutar contra slime", "Lutar contra Worg", "Voltar ao centro"],
        "button functions": [fightSlime, fightWorg, goTown],
        text: "Você entrou na caverna. Você vê alguns monstros."
    },
    {
        name: "lutar",
        "button text": ["Atacar", "Esquivar", "Correr"],
        "button functions": [attack, dodge, goTown],
        text: "Você esta lutando contra um monstro."
    },
    {
        name: "matar monstro",
        "button text": ["Voltar ao centro", "Voltar ao centro", "Voltar ao centro"],
        "button functions": [goTown, goTown, goTown],
        text: 'O monstro grita "Ahh!" antes de morrer. Você ganhou pontos de experiência e encontra ouro.'
    },
    {
        name: "perder",
        "button text": ["Jogar de novo?", "Jogar de novo?", "Jogar de novo?"],
        "button functions": [restart, restart, restart],
        text: "Você morreu. &#x2620;"
    },
    {
        name: "ganhar",
        "button text": ["Jogar de novo?", "Jogar de novo?", "Jogar de novo?"],
        "button functions": [restart, restart, restart],
        text: "Você derrotou o dragão! VOCÊ VENCEU O JOGO! &#x1F389;"
    }
]

// botões de inicialização

button1.onclick = goStore
button2.onclick = goCave
button3.onclick = fightDragon

function update(location){
    monsterStats.style.display = "none"
    button1.innerText = location["button text"][0]
    button2.innerText = location["button text"][1]
    button3.innerText = location["button text"][2]
    button1.onclick = location["button functions"][0]
    button2.onclick = location["button functions"][1]
    button3.onclick = location["button functions"][2]
    text.innerHTML = location.text
}

function goTown(){
    update(locations[0])
}

function goStore(){
    update(locations[1])
}

function goCave(){
    update(locations[2])
}

function buyHealth(){
    if(gold >= 10){
        gold -= 10
        health +=10
        goldText.innerText = gold
        healthText.innerText = health
    } else {
        text.innerText = "você não tem ouro o suficiente para comprar vida."
    }
}

function buyWeapon(){
    if(currentWeapon < weapons.length - 1){
        if (gold >= 30){
            gold -= 30
            currentWeapon++
            goldText.innerText = gold
            let newWeapon = weapons[currentWeapon].name
            text.innerText = "Agora você tem " + newWeapon + "."
            inventory.push(newWeapon)
            text.innerText = "No seu inventario tem: " + inventory
        } else {
            text.innerText = "Você não tem ouro o suficiente para comprar uma arma."
        } 
    }else{
            text.innerText = "Você já tem a arma mais forte!"
            button2.innerText = "Vender arma por 15 moedas."
            button2.onclick = sellWeapon
        }
}

function sellWeapon(){
    if(inventory.length > 1){
        gold += 15
        goldText.innerText = gold
        let currentWeapon = inventory.shift()
        text.innerText = "Você vendeu " + currentWeapon + "."
    } else {
        text.innerHTML = "Não venda sua unica arma!"
    }
}

function fightSlime (){
    fighting = 0
    goFight()
}

function fightWorg (){
    fighting = 1
    goFight()
}

function fightDragon (){
    fighting = 2
    goFight()
}

function goFight (){
    update(locations[3])
    monsterHealth = monsters[fighting].health
    monsterStats.style.display = "block"
    monsterName.innerText = monsters[fighting].name
    monsterHealthText.innerText = monsterHealth
    showMonsterImage(monsters[fighting].image)
}

function showMonsterImage(imageSrc){
    monsterImage.innerHTML = ''
    const img = document.createElement('img')
    img.src = imageSrc
    img.alt = monsters[fighting].name
    img.style.maxWidth = '150px'
    img.style.maxHeight = '150px'
    img.style.borderRadius = '10px'
    img.style.marginTop = '10px'
    img.style.border = '2px solid #ff6b6b'

    monsterImage.appendChild(img)
}

function attack(){
    text.innerText = "O " + monsters[fighting].name + " ataca."
    text.innerText += " Você ataca o monstro com " + weapons[currentWeapon].name + "."
    health -= getMonsterAttackValue(monsters[fighting].level)
    if (isMonsterHit()){
        monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1
    } else {
        text.innerText += " Você erra o ataque."
    }
    healthText.innerText = health
    monsterHealthText.innerText =  monsterHealth
    if (health <= 0){
        lose()
    } else if (monsterHealth <= 0){
        if(fighting === 2){
            winGame()
        } else {
            defeatMonster()
        }
    }
    if(Math.random() <= .1 && inventory.length !== 1){
        text.innerText += "Sua " + inventory.pop() + " quebrou!"
        currentWeapon--
    }
}

function getMonsterAttackValue(level){
    const hit = (level * 5) - (Math.floor(Math.random() * xp))
    console.log(hit)
    return hit > 0 ? hit : 0
}

function isMonsterHit(){
    return Math.random() > .2 || health < 20
}

function dodge(){
    text.innerText  = "Você esquivou do ataque do " + monsters[fighting].name
}

function defeatMonster(){
    gold += Math.floor(monsters[fighting].level)
    xp += monsters[fighting].level
    goldText.innerText = gold
    xpText.innerText = xp
    update(locations[4])
}

function lose(){
    update(locations[5])
}

function winGame(){
    update(locations[6])
}

function restart(){
    xp = 0
    health = 100
    gold = 50
    currentWeapon = 0
    inventory = ["stick"]
    goldText.innerText = gold
    healthText.innerText = health
    xpText.innerText = xp
    goTown()
}
