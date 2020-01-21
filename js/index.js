var pathfinding = {
    set: {
        grid: function() {
            const cellWidth = 30;

            const gridDiv = document.getElementById('grid');
        
            
            const gridWidth = gridDiv.clientWidth;
            const gridHeight = gridDiv.clientHeight;

            const amountOfColumns = gridWidth / cellWidth;
            const amountOfRows = gridHeight / cellWidth;

            gridDiv.style.gridTemplateColumns = `repeat(${cellWidth}px, ${amountOfColumns})`;
            gridDiv.style.gridTemplateRows = `repeat(${cellWidth}px, ${amountOfRows})`;

            for (let c = 0; c < amountOfColumns; c++) {
                for (let r = 0; r < amountOfRows; r++) {
                    const cellDiv = document.createElement('div');
                    cellDiv.classList.add('gridCell');
                }
            }
        }
    },
    init: function() {
        pathfinding.set.grid();
    }
}

window.onload = pathfinding.init();