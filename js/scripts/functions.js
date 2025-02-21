import Alts from "./classes/Alts.js";
import ShowCode from "./classes/ShowCode.js"
import Buttons from "./classes/Buttons.js";
import Notificaction from "./classes/Notificaction.js";
import {label,offersCodeText2,formDimensions,formDimensionsImgs,offerContainer,textAreaCode,offersCodeText,formDimensionsAlts,btnGroupAlts,mainContainer,btnView,btnDownload,btnCopy,btnEdit,form, CLIENT_ID, API_KEY, DISCOVERY_DOC, SCOPES, gapiInited, gisInited, gapi, divModal, btnAddAlts} from "./selectors.js"
let action = null;

export function isEmpty(){
    const code = document.querySelector('#code-alts').value;
        if(code === ''){
            new Notificaction('Debes pegar el código de tu pieza para poder limpiar los alts', 'alert-danger', 3000, 'e.target.id')
        }
}

export function showAlert(text,type,time,id){
    const alertExist = document.querySelector('.alert')
    if(!alertExist){
        if(id === 'btn-copy2' || id === 'form-dimensions'){
            const containerAlert = document.createElement('DIV');
            const alert = document.createElement('div');
            const fieldSetOffersBlock = document.querySelector('#field-set-offersBlock');
            alert.classList.add('alert', type, 'mt-3', 'p-2', 'text-center');
            alert.role = 'alert';
            alert.textContent = text;
            containerAlert.appendChild(alert);
            fieldSetOffersBlock.appendChild(containerAlert);
            setTimeout(() => {
                alert.remove();
            }, time);
        }else if(id === 'form-dimensions-imgs' || id === 'btn-copy3'){
            console.log('llego');
            const containerAlert = document.createElement('DIV');
            const alert = document.createElement('div');
            const test = document.querySelector('#form-dimensions-imgs');
            alert.classList.add('alert', type, 'mt-3', 'p-2', 'text-center');
            alert.role = 'alert';
            alert.textContent = text;
            containerAlert.appendChild(alert);
            test.appendChild(containerAlert);
            setTimeout(() => {
                alert.remove();
            }, time);
        }else{
            const alert = document.createElement('div');
            alert.classList.add('alert', type, 'mt-3', 'p-2', 'text-center');
            alert.role = 'alert';
            alert.textContent = text;
            containerAlert.appendChild(alert);
            setTimeout(() => {
                alert.remove();
            }, time);
        }
    }
}

export function clean(){
    label.classList.add('d-none');
    offersCodeText2.classList.add('d-none');
    console.log('que pex');
    formDimensions.reset();
    formDimensionsImgs.reset();
    while(offerContainer.firstChild){
        offerContainer.removeChild(offerContainer.firstChild);
    }
    textAreaCode.classList.remove('d-none');
}

export function generateWithCode(e){
    e.preventDefault();
    console.log('qqq');
    let offersCode = offersCodeText.value;

    if(offersCodeText.value === ''){
        console.log(e.target.id);
        new Notificaction('Debes pegar el código de tu bloque ofertas para generar uno nuevo con las medidas correctas', 'alert-danger', 3000, e.target.id)
    }else{
        processCode(offersCode);
    }
}

export function processCode(offersCode){
    let heights = [];
    //let maxHeight;
    const tempDiv = document.createElement('div');

    tempDiv.innerHTML = offersCode;

    const images = tempDiv.getElementsByTagName('img');

    Array.from(images).forEach(imgs=> {
        imgs.onload = () => {
            const originalHeight = imgs.naturalHeight;
            heights.push({height: originalHeight});
            if (heights.length === images.length) {
                const height = heights.reduce((prev, current) => {
                    return (prev.height > current.height) ? prev : current;
                }).height;
                const calculatedHeights = calculateHeights(height);
                offersBlock(calculatedHeights, offersCode);
            }
        }

        imgs.onerror = () => {
            console.log('no se cargaron las imagenes, mamaste');
        }
    });
}

export function calculateHeights(height){
    const textBlockHeight = 76;
    const originalWidth = 648;
    const blockWidth = 324;
    let maxHeight;

    const result = (blockWidth*height)/originalWidth;
    maxHeight = Math.round(result);
    console.log(result)
    console.log(maxHeight);
    if(maxHeight % 2 !== 0){
        maxHeight+=1;
    }

    const div_1_2 = maxHeight+textBlockHeight+8;
    const tdHeight = div_1_2/2;
    const tdImgHeight = tdHeight-textBlockHeight-8;
    const objHeights = {
    div_1_2,
    imgHeight: maxHeight,
    tdHeight,
    tdImgHeight,
    textBlockHeight
    }

    return objHeights;
}


export function offersBlock(heights, code){
    const parser = new DOMParser();
    const parsedCode = parser.parseFromString(code, 'text/html');
    const codeHtml = parsedCode.body.firstChild;
    const text = document.createElement('p');
    const href = codeHtml.getElementsByTagName('a');
    
    setHeights(codeHtml, heights);

    const showCode = new ShowCode(label, text, offersCodeText2,offerContainer,textAreaCode,codeHtml);
    const copy = new Buttons();
    const finalCode = offersCodeText2.value = codeHtml.outerHTML.replaceAll('&amp;', '&');
    copy.show(true);
    copy.hide();
    copy.copyCode(finalCode, 'segundo');
    showCode.show('Código con medidas ya establecidas copialo y pegalo en tu documento html', 'Así quiedaría tu bloque ofertas')
}

export function setHeights(codeHtml, heights){
    const div = codeHtml.getElementsByTagName('div');
    const {div_1_2, imgHeight,tdHeight, tdImgHeight, textBlockHeight} = heights;

    Array.from(div).forEach((divs,i)=>{
        const imgs = divs.getElementsByTagName('img');
        const tds = divs.getElementsByTagName('td');

        if(i === 0){    
            divs.style.height = div_1_2;
            Array.from(imgs).forEach(img=>{
            img.style.height = imgHeight;
            img.height = imgHeight;
        });
        }else{
            divs.style.height = div_1_2;
            Array.from(tds).forEach(td=>{
                td.height=tdHeight;
            })
            Array.from(imgs).forEach(img=>{
                img.height = tdImgHeight;
            });
        }
    });
}


/* ************************************************************ */


export function handleInputSource(e){
    const file = document.querySelector('#file').files;
    if(file.length === 0){
        e.preventDefault();
    }
    const selected = new Alts(file);
    selected.isSelected(e.target[3].id);
}

// muestra los resultados en pantalla
export function showResults(fileName, newCode){
    const containerInput = document.querySelector('#container-input');
    containerInput.style.display = 'none';
    btnGroupAlts.classList.toggle('d-none');
    formDimensionsAlts.classList.add('d-none');

    // crea contenedores para el código y el contenido de la pieza
    let titleCode = document.createElement('P');
    let codePreview = document.createElement('P');
    let preview = document.createElement('P');


    // Muestra los datos leídos y "filtrados" a HTML y los agrega a su contenedor para poder ver el código en pantalla
    titleCode.classList.add('fs-4', 'text-center', 'fw-bold');
    titleCode.innerHTML = `Código de la piza: ${fileName} <br>`;
    mainContainer.classList.add('fs-6', 'm-3');
    codePreview.innerHTML = escapeHTML(newCode).replaceAll("\n", "<br>");
    mainContainer.appendChild(titleCode);
    mainContainer.appendChild(codePreview);
    document.body.appendChild(mainContainer);
    btnView.textContent = 'Ver contenido de la pieza';
    highlight(codePreview);
    console.log(action);
    file.value='';

    //condicion para mostrar código o contenido
    btnView.addEventListener('click', () =>{
        if(!action){
            // oculta el código en pantalla, agrega el contenido a su contenedor y lo muestra en pantalla
            codePreview.style.display = 'none';
            preview.style.display = 'block';
            preview.innerHTML = newCode;
            mainContainer.appendChild(preview)
            document.body.appendChild(mainContainer);
            btnView.textContent = 'Ver código de la pieza';
            titleCode.textContent = `Contenido de la piza: ${fileName}`;
            action = true;
            console.log(action);
        }else{
            // oculta el contenido en pantalla y muestra en pantalla
            preview.style.display = 'none'
            codePreview.style.display = "block";
            btnView.textContent = 'Ver contenido de la pieza';
            titleCode.textContent = `Código de la piza: ${fileName}`;
            action = false;
            console.log(action);
        }
    });

    // descarga el codigo html        
    btnDownload.addEventListener('click', ()=>{
    downloadCode(newCode,fileName);
    });

    // copia el codigo html
    btnCopy.addEventListener('click', ()=>{
    copyCode(newCode);
    });

    btnEdit.addEventListener('click', showForm);

}

// Función para escapar entidades html
export function escapeHTML(data) {
    let fn = function(tag) {
        let charsToReplace = {
            '&' : '&amp;',
            '<' : '&lt;',
            '>' : '&gt;',
            '"' : '&#34;'
        };
        return charsToReplace[tag] || tag;
    }
    return data.replace(/[&<>"]/g, fn);
}

//resalta el texto modificado
export function highlight(data){
    const txt = data.innerHTML;
    const txt2 = txt.replace(/alt="([^"]*)"/g, (match, contenido) => {
    if (contenido === "___") {
        return `<span class="text-light bg-primary">${match}</span>`; // Azul si es alt="___"
    } else {
        return `<span class="text-light bg-success">${match}</span>`; // Verde si tiene otro contenido
    }
});
    data.innerHTML = txt2;
}

// revisa si tiene la extensión html y si no, la agrega
export function containsWord(fileName){
    if(!fileName.includes('.html')){
        fileName += '.html';
    }
    return fileName;
}

// función para descargar el nuevo codigo ya modificado
export function downloadCode (data, fileName) {
    containsWord(fileName);
    //verifica extensión html
    const fileNameHtml = containsWord(fileName);
    console.log(fileNameHtml);
    const link = document.createElement("a");
    const contenido = data;
    // instancia para el fichero
    const blob = new Blob([contenido], {type: "code/html"});
    // crea la url con el fichero
    const url = window.URL.createObjectURL(blob);
    // agrega la url a el enlace
    link.href = url;
    // hace descargable y agrega el nombre que tendra el archivo
    link.download = fileNameHtml;
    link.click();

    window.URL.revokeObjectURL(url);
};

export function copyCode(code, id){
    navigator.clipboard.writeText(code)
    .then(() => {
        new Notificaction('Código HTML copiado', 'alert-success',2000, id)
    }).catch(err => {
        console.error('nel pastel:', err)
    })
    
}


export function showForm(){
    mainContainer.classList.add('d-none');
    form.classList.remove('d-none');

    form.addEventListener('submit', validateForm);
}

export function validateForm(e){
    e.preventDefault();
    const formElements = form.elements;
    let alert = false;
    for(let i = 0; i < formElements.length; i++){
    if(formElements[i].type !== 'submit'){
        if(formElements[i].value === ''){
            alert = true;
        }
    }
    }
    if(alert){
    showAlert('No dejes campos vacios, si no tienes el copy agrega un "lorem ipsum" y si no tienes la fecha de vigencia marcala con "xx" o "--"', 'alert-danger', 5500);
    }
}


/* ******************   Funciones para leer gooogle sheet y agregar alts      ********************** */

export function test(){
    console.log('eyeye');
}

let tokenClient;

 /**
       * Callback after api.js is loaded.
       */
 export function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
  }

  /**
   * Callback after the API client is loaded. Loads the
   * discovery doc to initialize the API.
   */
 export async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited.value = true;
   /*  maybeEnableButtons(); */
  }

  /**
   * Callback after Google Identity Services are loaded.
   */
  export function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES
    });
    gisInited.value = true;
   /*  maybeEnableButtons(); */
  }

  /**
   * Enables user interaction after all libraries are loaded.
   */
  export function maybeEnableButtons() {
    if (gapiInited && gisInited) {
      document.getElementById('authorize_button').style.visibility = 'visible';
    }
  }

  /**
   *  Sign in the user upon button click.
   */
 export function handleAuthClick(sheet,cells) {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
      /* document.getElementById('signout_button').style.visibility = 'visible';
      document.getElementById('authorize_button').innerText = 'Refresh'; */
      await listMajors(sheet,cells);
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({prompt: ''});
    }
  }

  /**
   *  Sign out the user upon button click.
   */
 export  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      document.getElementById('content').innerText = '';
      document.getElementById('authorize_button').innerText = 'Authorize';
      document.getElementById('signout_button').style.visibility = 'hidden';
    }
  }


  export async function listMajors(sheet,cells) {
    let response;
    console.log(sheet);
    console.log(cells);
    try {
      // Fetch first 10 files
      response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1NqSi0AfQ65NFVKoEFGDO9D3wLRaM1VtQwLMcFTJ8BKI',
        range: `${sheet}!${cells}`,
      });
    } catch (err) {
      console.log(err.body, 'te la pelaste padrino');
      new Notificaction('Argumento invalido, revisa que sea correcto el noombre de la hoja y de las celdas', 'alert-danger', 5000, 'e.target.id');
      return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
      document.getElementById('content').innerText = 'No values found.';
      return;
    }
    // Flatten to string to display
    const ar = []
    range.values.forEach(element => {
        if(element.length > 0 ){
            ar.push(element);
        }
    });
    let ar2 = ar.map(sub => 
        sub.filter(item => item.trim() !== '')
    )
    console.log(ar2);
    const searchText = 'Abre en pestaña nueva';
    const ar3 = ar2.flat().filter(alt => alt.includes(searchText));
    console.log(ar3);

    const X = new Alts;
    X.pasteCode(ar3);
    /* const output = range.values.reduce(
        (str, row) => `${str}${row[0]}, ${row[4]}\n`,
        'Name, Major:\n'); */
    /* document.getElementById('content').innerText = output; */
  }

export function validate(){
    const code = document.querySelector('#code-alts').value;
    const btnAdd = new Buttons();
    if(code.length === 0){
        new Notificaction('Debes pegar el código de tu pieza para poder pegar los alts', 'alert-danger', 3000, 'e.target.id');
    }else{
        createModal();
        //handleAuthClick();
    }
}

function createModal(){
    const modal = `
    <div class="text-center m-4">
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"              data-bs-whatever="@mdo">Seleccionar hoja y celdas</button>
    </div>
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Indica el nombre de la hoja y las celdas</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form>
            <div class="mb-3">
                <label for="sheet" class="col-form-label">Nombre de la hoja:</label>
                <input type="text" class="form-control" id="sheet">
            </div>
            <div class="mb-3">
                <label for="cells" class="col-form-label">Celdas:</label>
                <textarea class="form-control" id="cells"></textarea>
            </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="button" id="add" data-bs-dismiss="modal" class="btn btn-primary">Agregar alts</button>
        </div>
        </div>
    </div>
    </div>`

    divModal.innerHTML = modal;
    getData();

}

function getData(){
    const sheet = document.querySelector('#sheet');
    const cells = document.querySelector('#cells');
    const add = document.querySelector('#add');

    add.addEventListener('click', ()=>{
        console.log(sheet.value, cells.value);
        handleAuthClick(sheet.value, cells.value);
    })
}

/* function editCode(data){
console.log(data)

// variables de texto html copy y fecha de bloque 1 columna 1-4
const regB1C1Copy = /<b id="b1-c1-copy">([^<>]*)<\/b>/;
const regB1C2Copy = /<b id="b1-c2-copy">([^<>]*)<\/b>/;
const regB1C3Copy = /<b id="b1-c3-copy">([^<>]*)<\/b>/;
const regB1C4Copy = /<b id="b1-c4-copy">([^<>]*)<\/b>/;
const regB1C1Valid = /<small id="b1-c1-valid">([^<>]*)<\/small>/;
const regB1C2Valid = /<small id="b1-c2-valid">([^<>]*)<\/small>/;
const regB1C3Valid = /<small id="b1-c3-valid">([^<>]*)<\/small>/;
const regB1C4Valid = /<small id="b1-c4-valid">([^<>]*)<\/small>/;

// variables de input copy y fecha de bloque 1 columna 1-4
const B1C1Copy = document.querySelector('#b1-c1-copy').value;
const B1C2Copy = document.querySelector('#b1-c2-copy').value;
const B1C3Copy = document.querySelector('#b1-c3-copy').value;
const B1C4Copy = document.querySelector('#b1-c4-copy').value;
const B1C1Valid = document.querySelector('#b1-c1-valid').value;
const B1C2Valid = document.querySelector('#b1-c2-valid').value;
const B1C3Valid = document.querySelector('#b1-c3-valid').value;
const B1C4Valid = document.querySelector('#b1-c4-valid').value;

// variables de texto html copy y valid de bloque 3 columna 1-5
const regB3C1Copy = /<b id="b3-c1-copy">([^<>]*)<\/b>/;
const regB3C2Copy = /<b id="b3-c2-copy">([^<>]*)<\/b>/;
const regB3C3Copy = /<b id="b3-c3-copy">([^<>]*)<\/b>/;
const regB3C4Copy = /<b id="b3-c4-copy">([^<>]*)<\/b>/;
const regB3C5Copy = /<b id="b3-c5-copy">([^<>]*)<\/b>/;
const regB3C1Valid = /<small id="b3-c1-valid">([^<>]*)<\/small>/;
const regB3C2Valid = /<small id="b3-c2-valid">([^<>]*)<\/small>/;
const regB3C3Valid = /<small id="b3-c3-valid">([^<>]*)<\/small>/;
const regB3C4Valid = /<small id="b3-c4-valid">([^<>]*)<\/small>/;  
const regB3C5Valid = /<small id="b3-c5-valid">([^<>]*)<\/small>/; 

const frag = data.match(regB1C1Copy);
const frag2 = data.match(regB1C1Fecha);
const b1C1Copy = frag ? (console.log(frag[1]), frag[1]) : (console.log('no esta'), null);
const b1C1Valid = frag2 ? (console.log(frag2[1]), frag2[1]) : (console.log('no esta'), null);
let modifiedCode = '';
if(b1C1Copy != null){
    modifiedCode = data.replace(b1C1Copy, 'Perros').replace(b1C1Fecha, '(Válido para siempre)');
}else{
    console.log('nada');
}
    
return modifiedCode; 
} */
