if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./serviceWork.js').catch(err => {
            console.log('Falha ao registrar o Service Worker:', err);
        });
    });
}

const form = document.getElementById('player-form');
const playerList = document.getElementById('player-list');
const idInput = document.getElementById('player-id');
const nameInput = document.getElementById('name');
const teamInput = document.getElementById('team');
const positionInput = document.getElementById('position');
const goalsInput = document.getElementById('goals');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');

function getPlayers() {
    const players = localStorage.getItem('jogadoresPWA');
    return players ? JSON.parse(players) : [];
}

function savePlayersData(players) {
    localStorage.setItem('jogadoresPWA', JSON.stringify(players));
}

function renderPlayers() {
    playerList.innerHTML = '';
    const players = getPlayers();


    if (players.length === 0) {
        playerList.innerHTML = '<p style="color: var(--text-muted);">Nenhum jogador cadastrado ainda.</p>';
        return;
    }

    players.forEach(player => {
        const div = document.createElement('div');
        div.classList.add('player-card');

        div.innerHTML = `
    <div>
        <h3>${player.name}</h3>
        <p>Time: <span class="highlight">${player.team}</span></p>
        <p>Posição: <span class="highlight">${player.position}</span></p> <!-- A classe foi adicionada aqui! -->
        <p>Gols: <span class="highlight">${player.goals}</span></p>
        </div>
    <div class="card-actions">
        <button class="btn btn-edit" onclick="editPlayer(${player.id})">Editar</button>
        <button class="btn btn-danger" onclick="deletePlayer(${player.id})">Excluir</button>
    </div>
    `;
        playerList.appendChild(div);
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const players = getPlayers();
    const playerId = idInput.value;

    const playerData = {
        id: playerId ? parseInt(playerId) : Date.now(),
        name: nameInput.value,
        team: teamInput.value,
        position: positionInput.value,
        goals: parseInt(goalsInput.value)
    };

    if (playerId) {
        const index = players.findIndex(p => p.id === parseInt(playerId));
        players[index] = playerData;
        resetForm();
    } else {
        players.push(playerData);
    }

    savePlayersData(players);
    renderPlayers();
    form.reset();
});

function deletePlayer(id) {
    if (confirm('Tem certeza que deseja excluir este jogador?')) {
        let players = getPlayers();
        players = players.filter(player => player.id !== id);
        savePlayersData(players);
        renderPlayers();
    }
}


function editPlayer(id) {
    const players = getPlayers();
    const player = players.find(p => p.id === id);

    if (player) {
        idInput.value = player.id;
        nameInput.value = player.name;
        teamInput.value = player.team;
        positionInput.value = player.position;
        goalsInput.value = player.goals;

        formTitle.textContent = 'Editar Jogador';
        saveBtn.textContent = 'Atualizar';
        cancelBtn.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    form.reset();
    idInput.value = '';
    formTitle.textContent = 'Adicionar Jogador';
    saveBtn.textContent = 'Salvar Jogador';
    cancelBtn.style.display = 'none';
}

renderPlayers();