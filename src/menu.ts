let gamesArray = [{
  name: 'Snake',
  id: 1,
},
{
  name: 'Crazy Surfer',
  id: 2,
},
{
  name: 'Cool Game',
  id: 3,
},

]

let navLinkArray = {
  1: 'https://github.com/RCThales/',
  2: 'https://www.instagram.com/thalescardris/',
  3: 'https://www.linkedin.com/in/thalesrodriguescardoso/',
  4: '../settings.html'
}

let currentGame = 1
let currentMenuOption = 1
let isGameStarting = false
let keyRepeated = true

let onMenu = false
let onGameList = true

const searchInput = document.querySelector('#search') as HTMLInputElement

let startGameAudio = new Audio('./audio/startgame.wav')
let gameInspectSound = new Audio('./audio/inspect.wav')

window.addEventListener('load', () => {

  renderListOfGames(gamesArray)
  selectGame(1, true)
  getNumberOfGames()

})

const getNumberOfGames = () => {
    const availableGames = document.querySelector('.availableGamesNumber') as HTMLElement
    availableGames.textContent = gamesArray.length.toString()
}

document.addEventListener('keydown', (keyPressed) => {
  if(keyRepeated){

    if(keyPressed.key === 'Enter' || keyPressed.key.toLowerCase() === 'k'){
      if(onGameList) startGame()
      if(onMenu) goToLink()
      return
    }
    selectMenuViaInput(keyPressed)
    keyRepeated = false
  }
  
})

document.addEventListener('keyup', (keyPressed) => {
  keyRepeated = true
})

const selectMenuViaInput = (keyPressed:KeyboardEvent) => {
  //if (document.activeElement === searchInput) return
  if(isGameStarting) return

  const movement = {
    W: currentGame-1 as number,
    w: currentGame-1 as number,
    S: currentGame+1 as number,
    s: currentGame+1 as number,
    ArrowUp: currentGame-1 as number,
    ArrowDown: currentGame+1 as number,
  }

  
  const movementMenu = {
    D: currentMenuOption+1 as number,
    d: currentMenuOption+1 as number,
    A: currentMenuOption-1 as number,
    a: currentMenuOption-1 as number,
    ArrowRight: currentMenuOption+1 as number,
    ArrowLeft: currentMenuOption-1 as number,  
    S: 10 as number,
    s: 10 as number,
    ArrowDown: 10 as number,
  }

  

  if(movement[keyPressed.key as keyof typeof movement] !== undefined){

    if(onGameList) selectGame(movement[keyPressed.key as keyof typeof movement], false) 

  }

  if(movementMenu[keyPressed.key as keyof typeof movementMenu] !== undefined){
 
    if(onMenu) selectNavOption(movementMenu[keyPressed.key as keyof typeof movementMenu]) 
  }

}

const renderListOfGames = (array:object[]) => {
  let gameList = document.querySelector('.gameList') as HTMLElement
  gameList.textContent = ''
  let counter = 1

    array.forEach((element:any) => {

    let gameListButton = document.createElement('button')
    gameListButton.className = 'game'
    gameListButton.id = `${counter++}`
    gameListButton.textContent = element.name
    gameListButton.onclick = function(){selectGame(parseInt(gameListButton.id), false)}
    gameList.appendChild(gameListButton)

  })

}

const startGame = () => {
  isGameStarting = true;
  startGameAudio.volume = 0.3
  startGameAudio.play()

  setTimeout(() => {
    window.location.href = `./games/game_${currentGame}/game_${currentGame}.html`
  }, 3000);

  animateGameStart()
}

const animateGameStart = () => {
  const container = document.querySelector(".container") as HTMLElement
  container.style.display = 'none'; //Start Effect
  const gameTransitionScreen = document.querySelector('.gameTransitionWrapper') as HTMLElement

  gameTransitionScreen.style.transform = 'scale(1.2)'
}

const selectNavOption = (menuOption:number) => {
    const listOfNavOptions = document.querySelectorAll('.menuOption')

    if(menuOption === 0) menuOption = 4
    if(menuOption === 5) menuOption = 1

    //Cleaning nav selection
    listOfNavOptions.forEach(element => {
      element.classList.remove("navMenuActive")
    });

    //Heading back to the game selection menu
    if(menuOption === 10){
      selectGame(1, false)
      onMenu = false
      onGameList = true
      return
    } 

    currentMenuOption = menuOption

    const selectedOption = document.querySelector(`.menuOption${menuOption}`) as HTMLElement
    selectedOption.classList.add('navMenuActive')

    gameInspectSound.currentTime = 0
    gameInspectSound.volume = 0.3
    gameInspectSound.play()
}

const goToLink = () => {


    let counter = 0
    const listOfNavOptions = document.querySelectorAll('.menuOption')
    listOfNavOptions.forEach(element => {
      counter++
      if(element.classList.contains('navMenuActive')){
        if(counter != 4){
          parent.window.open(navLinkArray[counter as keyof typeof navLinkArray], '_blank')
          return
        } 
        window.location.href = navLinkArray[counter as keyof typeof navLinkArray]    
      }
      
    });
}

const selectGame = (gameId:number, isStartup:boolean) => {

  //Current Game Array
  const fullListOfGames = document.querySelectorAll('.game')

  //Cleaning game selection
   fullListOfGames.forEach(element => {
    element.classList.remove("activeGame")
  });

  //Going to the navigation menu
  if(gameId === 0){
    selectNavOption(1)
    onMenu = true
    onGameList = false
    return
  }

    //Reversing selected game to the opposite extreme of the list if the selected game is first or last.
  if(gameId > fullListOfGames.length) gameId = 1

  const theSelectedGame = document.getElementById(gameId.toString()) as HTMLElement

  theSelectedGame.classList.add("activeGame")
  currentGame = gameId

  changeGameImage(gameId)

  if(!isStartup){
 
    gameInspectSound.currentTime = 0
    gameInspectSound.volume = 0.3
    gameInspectSound.play()
  }
}


const changeGameImage = (imageId:number) => {
  const gameText = document.querySelector('.selectedGameImageText') as HTMLElement;
  const gameImg = document.querySelector('.selectedGameImage') as HTMLImageElement
  const gameImgBg = document.querySelector('.selectedGameImageBg') as HTMLImageElement
  const gameImgTransition = document.querySelector('.selectedGameImageTransition') as HTMLImageElement

  if(gameImg.src = `./img/game_${imageId}.png`){
    gameImg.src = `./img/game_${imageId}.png`
    gameImgBg.src = `./img/game_${imageId}.png`
    gameImgTransition.src = `./img/game_${imageId}.png`

    //Getting name of the selected game.
    gamesArray.forEach((e) => {
        if(imageId === e.id) gameText.textContent = e.name
    })
    return
  }

  gameImg.src = `./img/game_1.png`
  gameImgBg.src = `./img/game_1.png`
  gameImgTransition.src = `./img/game_1.png`
  gameText.textContent = `Snake`
 
}

searchInput?.addEventListener('input', () => {
  filterGames(gamesArray)
})

const filterGames = (array:any[]) => {
  const filteredArray = array.filter(game => {
      const gameName = game.name.toLowerCase()
      const inputValue = searchInput?.value.toLowerCase()
      
      return gameName.includes(inputValue) 
    });

    renderListOfGames(filteredArray)
}