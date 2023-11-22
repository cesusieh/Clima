const API_KEY = '85e840bbcc583778a50895619e12434f';
const form = document.getElementById('form');
const input = document.getElementById('search_cidade');

const infoCidade = document.getElementById('info_cidade');
const infoPais = document.getElementById('info_pais');
const longitude = document.getElementById('info_long');
const latitude = document.getElementById('info_lati');
const temperatura = document.getElementById('info_temp');
const sensacao = document.getElementById('info_sensacao');
const minTemp = document.getElementById('info_min');
const maxTemp = document.getElementById('info_max');
const pressao = document.getElementById('info_press');
const umidade = document.getElementById('info_umi');
const velVento = document.getElementById('info_vel_vento');
const fixButton = document.getElementById('fix_button');
const areaFix = document.getElementById('area_fixo');

const callApi = async (cidade,key) => {
    const APIResponse = await fetch (`http://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}`);
    if (APIResponse.status === 200){
        const data = await APIResponse.json();
        return data;
    }
}

const renderInfo = async(cidade) => {
    const data = await callApi(cidade, API_KEY);
    input.value = '';
    if(data){
        infoCidade.innerHTML = data.name;
        infoPais.innerHTML = data['sys']['country'];
        temperatura.innerHTML = `TEMPERATURA: ${Math.trunc((data['main']['temp'] - 273.1))}°C`;
        sensacao.innerHTML = `SENSAÇÃO TÉRMICA: ${Math.trunc((data['main']['feels_like'] - 273.1))}°C`;
        minTemp.innerHTML = `MÍNIMA: ${Math.trunc((data['main']['temp_min'] - 273.1))}°C`;
        maxTemp.innerHTML = `MÁXIMA: ${Math.trunc((data['main']['temp_max'] - 273.1))}°C`;
        pressao.innerHTML = `PRESSÃO: ${data['main']['pressure']} hPa`;
        umidade.innerHTML = `UMIDADE: ${data['main']['humidity']}%`;
        velVento.innerHTML = `VENTO: ${Math.trunc((data['wind']['speed'])*3.6) } km/h`;
    } else {
        infoCidade.innerHTML = 'Cidade não encontrada';
        infoPais.innerHTML = '';
        temperatura.innerHTML = '';
        sensacao.innerHTML = '';
        minTemp.innerHTML = '';
        maxTemp.innerHTML = '';
        pressao.innerHTML = '';
        umidade.innerHTML = '';
        velVento.innerHTML = '';
    }
}

/* Fixos */

var fix = JSON.parse(localStorage.getItem("fixados")) || [];
var lastSearch = "";
var nFix = fix.length;

function verifyFix(cidade){
    for(item in fix){
        if(cidade.toUpperCase() === fix[item]["nome"]){
            fixButton.innerHTML = "Desfixar";
            break;
        } else {
            fixButton.innerHTML = "Fixar";
        }
    }
}


function addFix(cidade){
    if(cidade != ""){
        fix[nFix] = {nome: cidade.toUpperCase()};
        localStorage.setItem("fixados", JSON.stringify(fix));
        renderFix();
        nFix++;
        fixButton.innerHTML = "Desfixar";
    }
}

function removeFix(cidade){
    let x = '';
    for(item in fix){
        if(cidade.toUpperCase() == fix[item]["nome"]){
            x = item;
            break;
        }
    }
    fix.splice(x, 1);
    nFix--;
    localStorage.setItem("fixados", JSON.stringify(fix));
    fixButton.innerHTML = "Fixar";
    renderFix()
}

fixButton.addEventListener("click", () => {
    if(fixButton.innerHTML === "Fixar"){
        addFix(lastSearch);
    } else if (fixButton.innerHTML === "Desfixar"){
        removeFix(lastSearch);
    }
})

async function renderFix(){
    areaFix.innerHTML = `<h3 class="info_titulo">Fixos</h3>`
    for(item in fix){
        const data = await callApi(fix[item]["nome"], API_KEY);
        areaFix.innerHTML += `<div class="info_texto">${fix[item]["nome"]} - ${ Math.trunc((data['main']['temp'] - 273.1)) }°C</div>`
    }
}

/* Search submit */

form.addEventListener('submit', (event) => {
    event.preventDefault();
    lastSearch = input.value;
    verifyFix(lastSearch);
    renderInfo(input.value);
});

renderFix();