const bandas = [
    'Nirvana', 'Nine Inch Nails', 'Backstreet Boys', 
    'Stone Temple Pilots', 'Pearl Jam', 'Red Hot Chili Peppers', 
    'The Beatles', 'Metallica', 'Radiohead', 'Daft Punk',
    'Bad Bunny', 'Feid', 'Jhayco'
];

const generos = [
    'Grunge', 'Rock', 'Industrial', 'Pop', 
    'Alternative', 'Metal', 'Electronic', 'Reggaeton', 'Latin Trap', 'Urbano Latino'
];

const bandFeatsData = [
    [1, 1, 0, 0, 1, 0, 0, 0, 0, 0], 
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0], 
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0], 
    [1, 1, 0, 0, 1, 0, 0, 0, 0, 0], 
    [1, 1, 0, 0, 1, 0, 0, 0, 0, 0], 
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0], 
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0], 
    [0, 1, 0, 0, 0, 1, 0, 0, 0, 0], 
    [0, 1, 0, 0, 1, 0, 1, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0], 
    [0, 0, 0, 1, 0, 0, 0, 1, 1, 1], 
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 1], 
    [0, 0, 0, 1, 0, 0, 0, 1, 1, 1]  
];
        
    
function generarInterfaz() {
    const container = document.getElementById('grupos-container');
    let gruposHTML = '';
    
    const bandasMezcladas = [...bandas];
    bandasMezcladas.sort(() => Math.random() - 0.5);
    
    bandasMezcladas.forEach((banda, index) => {
        gruposHTML += `
            <div class="grupo" data-banda="${banda}">
                <h3>${banda}</h3>
                <div class="calificacion">
                    <span>Calificación: <span class="valor-seleccionado">5</span></span>
                    <input type="range" min="1" max="10" value="5" class="slider" id="banda${index}">
                </div>
            </div>
        `;
    });
    
    container.innerHTML = gruposHTML;
    
    document.querySelectorAll('.slider').forEach(slider => {
        slider.addEventListener('input', function() {
            this.parentElement.querySelector('.valor-seleccionado').textContent = this.value;
        });
    });
}

function procesarCalificaciones() {
    const calificacionesUsuario = [];
    
    bandas.forEach(banda => {
        const grupoElement = document.querySelector(`.grupo[data-banda="${banda}"]`);
        const calificacion = parseInt(grupoElement.querySelector('.slider').value);
        calificacionesUsuario.push(calificacion);
    });
    
    const userVotes = tf.tensor2d([calificacionesUsuario], [1, bandas.length]); // matriz 1x13
    const bandFeats = tf.tensor2d(bandFeatsData); // matriz 13x10
    
    const userFeats = tf.matMul(userVotes, bandFeats);
    
    const userFeatsData = userFeats.arraySync()[0];
    
    const suma = userFeatsData.reduce((acc, val) => acc + val, 0);
    const porcentajes = userFeatsData.map(valor => (valor / suma) * 100);
    
    const resultados = generos.map((genero, i) => ({
        genero: genero,
        valor: userFeatsData[i],
        porcentaje: porcentajes[i]
    }));
    
    resultados.sort((a, b) => b.valor - a.valor);
    
    mostrarResultados(resultados);
    
    userVotes.dispose();
    bandFeats.dispose();
    userFeats.dispose();
}

function mostrarResultados(resultados) {
    const rankingElement = document.getElementById('ranking');
    rankingElement.innerHTML = '';
    
    rankingElement.innerHTML += `
        <p>Según tus calificaciones, estos son tus géneros musicales preferidos:</p>
    `;
    
    resultados.forEach(resultado => {
        const porcentajeRedondeado = resultado.porcentaje.toFixed(1);
        const valorRedondeado = resultado.valor.toFixed(1);
        
        rankingElement.innerHTML += `
            <div class="barra-preferencia">
                <div><strong>${resultado.genero}</strong> (Puntuación: ${valorRedondeado})</div>
                <div class="barra-valor" style="width: ${porcentajeRedondeado}%">
                    ${porcentajeRedondeado}%
                </div>
            </div>
        `;
    });
    
    document.getElementById('resultado').style.display = 'block';
}

window.addEventListener('DOMContentLoaded', generarInterfaz);

document.getElementById('procesar').addEventListener('click', procesarCalificaciones);