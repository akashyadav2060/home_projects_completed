const playerImage = document.getElementById('img1');
const computerImage = document.getElementById('img2');
const choiceButtons = document.querySelectorAll('.play button');
const startButton = document.getElementById('start');
const playContainer = document.querySelector('.play');
const resultDiv = document.querySelector('.result');

const scoreElements = {
    player: document.querySelector('.player'),
    computer: document.querySelector('.computer')
};

const options =[
    { name: 'rock', image: './rock.png'},
    {name:'paper', image:'./paper.png'},
    {name:'scissor', image:'./scissors.png'}
];
let scores = {player: 0, computer: 0}

playContainer.style.display = 'none';

startButton.addEventListener('click', ()=>{
    scores = {player: 0, computer: 0};
    scoreElements.player.textContent = 'Player: 0';
    scoreElements.computer.textContent = 'Computer: 0';
    
    playContainer.style.display='flex';
    startButton.style.display='none';

    playerImage.src = './rock.png';
    computerImage.src ='./rock.png'
})
choiceButtons.forEach(button =>{
    button.addEventListener('click', ()=>{
        const playerChoice = options.find(opt=>opt.name ===button.id);
        const computerChoice = options[Math.floor(Math.random()*options.length)];
        playerImage.classList.add('shakeLeft');
        computerImage.classList.add('shakeRight');

        setTimeout(()=>{
            playerImage.src = playerChoice.image;
            computerImage.src = computerChoice.image;

            playerImage.classList.remove('shakeLeft');
            computerImage.classList.remove('shakeRight');

            determineWinner(playerChoice.name, computerChoice.name);
        
        }, 1000);
    });
});
function determineWinner(player, computer) {
    resultDiv.classList.remove('win', 'lose', 'tie');
    
    if (player === computer) {
        resultDiv.textContent = "It's a Tie!";
        resultDiv.classList.add('tie');
        // Clear message after 2 seconds
        setTimeout(() => {
            resultDiv.textContent = '';
        }, 2000);
        return;
    }

    const winConditions = {
        rock: 'scissor',
        paper: 'rock',
        scissor: 'paper'
    };

    if (winConditions[player] === computer) {
        scores.player++;
        scoreElements.player.textContent = `Player: ${scores.player}`;
        scoreElements.player.classList.add('green')
        resultDiv.textContent = "Player Wins!";
        resultDiv.classList.add('win');
    } else {
        scores.computer++;
        scoreElements.computer.textContent = `Computer: ${scores.computer}`;
        scoreElements.computer.classList.add('red')
        resultDiv.textContent = "Computer Wins!";
        resultDiv.classList.add('lose');
    }

    // Clear message after 2 seconds
    setTimeout(() => {
        resultDiv.textContent = '';
        resultDiv.classList.remove('win', 'lose');
    }, 2000);
}