const btnAlts = document.querySelector('#btn-alts');
const btnOffersBlock = document.querySelector('#btn-offersBlock');
const mainContainerAlts = document.querySelector('#main-container-alts');
const mainContainerOffersBlock = document.querySelector('#main-container-offersBlock')
const btnGroupAlts = document.querySelector('#btn-group-alts');
const btnView = document.querySelector('#btn');
const btnDownload = document.querySelector('#btn-download');
const btnCopy = document.querySelector('#btn-copy');
const btnCopy3 = document.querySelector('#btn-copy3');
const btnEdit = document.querySelector('#btn-edit');
const form = document.querySelector('#form');
const mainContainer = document.querySelector('#main-container');
const buttonsNav = document.querySelectorAll('.btn-outline-primary');
const containerAlert = document.querySelector('#container-alert');
const textAreaCode = document.querySelector('#text-area-code');
const labelTxtCode = document.querySelector('#label-txt-code');
const formDimensions = document.querySelector('#form-dimensions');
const formDimensionsAlts = document.querySelector('#form-dimensions-alts');
const formDimensionsImgs = document.querySelector('#form-dimensions-imgs');
const label = document.querySelector('#label');
const offersCodeText = document.querySelector('#code');
const offersCodeText2 = document.querySelector('#code2');
const offerContainer = document.querySelector('#offer-container');
const isVisible = document.querySelector('.d-none');
const Offerimgs = [];
const OffersNav = document.querySelector('#main-container-offersBlock-nav')

class Alts{

    constructor(file){
        this.file = file;
    }

    isSelected(){
        if(this.file.length === 0){
            this.pasteCode();
        }else{
            console.log('hhhh');
            this.readFile(this.file);
        }
    }

    readFile(file){
        formDimensions.classList.add('d-none');
        const reader = new FileReader();
        reader.fileName = file[0].name;
        console.log(reader.fileName);
        reader.onload = (e) => {
            this.processFileSelection(e,reader);
            const {fileName, newCode} = this.processFileSelection(e,reader)
            showResults(fileName, newCode);
        };

        reader.onerror = function(e){
            console.log('Valio chetos');
        }

        // Leemos el archivo
        reader.readAsText(file[0]);
    }

    processFileSelection(e,reader){
         // corta el nombre en la extensión de archivo para pooder cambiar el nombre antes de la extensión
        const fileName = e.target.fileName.replace('.html', '_alts_vacios.html');
        //guarda el codigo en la variable
        const code = reader.result;

        this.cut(code);

        const newCode = this.cut(code);

        return {fileName, newCode};
    }

    pasteCode(){
        const code = document.querySelector('#code-alts').value;
        if(code === ''){
            new Notificaction('Debés pegar el código de tu pieza para poder limpiar los alts', 'alert-danger', 3000, 'e.target.id')
        }else{
         this.cut(code);
         const newCode = this.cut(code);
;         showResults('alts_vacios',newCode);
        }
    }

    cut(code){
        // corta el código apartir de esa linea
     const start = code.search('<!-- CONTENIDO -->');
     // termina de cortar el código apartir de esa linea
     const end = code.search('<!-- === FOOTER === -->');
     // bloque de codigo que se va a modificar
     const codeToModify = code.substring(start, end);
     // asigna el primer bloque de codigo que no se modifica a header
     const header = code.substring(0,start);
     // asigna el bloque final de codigo que no se modifica a footer
     const footer = code.substring(end);
     // se alamacenara el nuevo c'odigo ya modificado 
     let newCode = ''
     // se almacena el codigo ya modificado sin alts que retorna la función
     newCode = this.modifyAlts(codeToModify);
     // une el codigo del header + el codigo del contenido ya modificado + el código del footer
     newCode = header + newCode + footer;

     return newCode;
    }

    modifyAlts(data){
        const altRegex = /alt="([^"]*)"/g;
        const modifiedCode = data.replace(altRegex, 'alt="___"');
        return modifiedCode;
    }


}

class Toggle{

    toggleElement(showElement, hideElement, enableBtn, disabledBtn){
        if(showElement.classList.contains('d-none')){
            hideElement.classList.add('d-none');
            showElement.classList.remove('d-none');
            enableBtn.disabled = false;
            disabledBtn.disabled = true;
            clean();
        }else{
            showElement.classList.add('d-none');
        }
}

    alts(show, hide, enabled, disabled, txt){
        labelTxtCode.textContent = txt;
        this.toggleElement(show, hide, enabled, disabled);
        OffersNav.classList.add('d-none');
        formDimensionsAlts.classList.remove('d-none');
        this.buttons = new Buttons();
        this.buttons.show();
        formDimensions.addEventListener('submit', generateWithCode);
    }

    offers(show, hide, enabled, disabled){
        this.toggleElement(show, hide, enabled, disabled)
        OffersNav.classList.remove('d-none');
        new OfferOptions();
    }

}

class OfferOptions{
    constructor(){
        this.btnBlock = document.querySelector('#btn-block');
        this.btnUrl = document.querySelector('#btn-img');

        this.toggle = new Toggle();
        this.show();
    }

    show(){
        this.btnUrl.addEventListener('click', (e)=>{
            this.toggle.toggleElement(formDimensionsImgs, formDimensions, this.btnBlock, this.btnUrl);
        })

        this.btnBlock.addEventListener('click', (e)=>{
            this.toggle.toggleElement(formDimensions,formDimensionsImgs,this.btnUrl,this.btnBlock);
            this.buttons = new Buttons();
            this.buttons.show(true);
            this.buttons.copyCode(offersCodeText2.value,'primero');
            formDimensions.addEventListener('submit', generateWithCode);
        })
    }
}

class Notificaction{
    constructor(text, type, time, id){
    this.text = text;
    this.type = type;
    this.time = time;
    this.id = id;
    this.show();
}

show(){
    const containerAlert = document.createElement('DIV');
    const alert = document.createElement('div');
    const containerElements = document.querySelector('#container-elements');
    

    alert.classList.add('alert', this.type, 'mt-3', 'p-2', 'text-center');
    alert.role = 'alert';
    alert.textContent = this.text;
    containerAlert.appendChild(alert);
    containerElements.insertBefore(containerAlert, containerElements.firstChild);
    setTimeout(() => {
        alert.remove();
    }, this.time);
    }
}

class ShowCode{
    constructor(label,text,offersCodeText2,offerContainer,textAreaCode,codeHtml){
        this.label = label;
        this.text = text;
        this.offersCodeText2 = offersCodeText2;
        this.offerContainer = offerContainer;
        this.textAreaCode = textAreaCode;
        this.codeHtml = codeHtml;
        this.btnGetCode = document.querySelector('#btn-get-code');
        this.btnCopy2 = document.querySelector('#btn-copy-2');
    }

    show(textLabel,textP){
        this.label.textContent = textLabel;
        this.text.textContent = textP;
        this.label.classList.remove('d-none');
        this.offersCodeText2.classList.remove('d-none');
        this.text.classList.add('text-center', 'fs-4', 'fw-bold');
        this.offerContainer.appendChild(this.text);
        this.offerContainer.appendChild(this.codeHtml);
        this.textAreaCode.classList.add('d-none');
    }
}

class Buttons{

    constructor(){
        this.btnGetCode();
        this.btnCopyCode();
        this.btnClear();
    }

    btnGetCode(){
        this.btnGetCode = document.createElement('button');
        this.btnGetCode.type = 'submit';
        this.btnGetCode.id = 'btn-get-code';
        this.btnGetCode.classList.add('btn', 'btn-success', 'm-1');
        this.btnGetCode.textContent = 'Obtener Codigo';
    }

    btnCopyCode(){
        this.btnCopy2 = document.createElement('button');
        this.btnCopy2.type = 'button';
        this.btnCopy2.id = 'btn-copy-2';
        this.btnCopy2.classList.add('btn', 'btn-primary', 'm-1');
        this.btnCopy2.textContent = 'Copiar Codigo';
    }

    btnClear(){
        this.btnReset = document.createElement('button');
        this.btnReset.type = 'button';
        this.btnReset.id = 'btn-reset';
        this.btnReset.classList.add('btn', 'btn-danger', 'm-1');
        this.btnReset.textContent = 'Limpiar test';
        this.btnReset.addEventListener('click', clean);
    }

    show(ifExist){
        const existButtons = document.querySelector('.btn-container')
        existButtons?.remove();
        if(ifExist){
            console.log('true');
            this.fieldSetOffersBlock = document.querySelector('#field-set-offersBlock');
            this.buttonsContainer = document.createElement('DIV');
            this.buttonsContainer.classList.add('col-auto', 'mt-3', 'text-center', 'btn-container');
            this.buttonsContainer.appendChild(this.btnGetCode);
            this.buttonsContainer.appendChild(this.btnCopy2);
            this.buttonsContainer.appendChild(this.btnReset);
            this.fieldSetOffersBlock.appendChild(this.buttonsContainer);
        }else{
            console.log('fasle');
            this.fieldSetOffersBlockAlts = document.querySelector('#field-set-offersBlock-alts');
            this.buttonsContainer = document.createElement('DIV');
            this.buttonsContainer.classList.add('col-auto', 'mt-3', 'text-center', 'btn-container');
            this.buttonsContainer.appendChild(this.btnGetCode);
            this.buttonsContainer.appendChild(this.btnReset);
            this.fieldSetOffersBlockAlts.appendChild(this.buttonsContainer);
        }
        
    }

    hide(){
        if(this.btnGetCode){
            this.btnGetCode.remove();
        }else{
            console.log('no esta')
        }
    }

    copyCode(code,text){
        this.btnCopy2.addEventListener('click', ()=>{
            copyCode(code);
            console.log(text);
        });
    }
}


// toggle de nav de alts y bloque de ofertas
const toggle = new Toggle();

btnAlts.addEventListener('click', ()=>{
    toggle.alts(mainContainerAlts, mainContainerOffersBlock,btnOffersBlock,btnAlts, 'Pega aquí el código completo de tu pieza a la cual le quieres vaciar los alts');
})

btnOffersBlock.addEventListener('click', ()=>{
    toggle.offers(mainContainerOffersBlock, mainContainerAlts,btnAlts,btnOffersBlock);
})

formDimensionsAlts.addEventListener('submit', handleInputSource);

formDimensionsImgs.addEventListener('submit', (e)=>{
    e.preventDefault();
    console.log(e.target.id);
    const inputs = formDimensionsImgs.getElementsByTagName('input');
    const input1 = document.querySelector('#img-1');
    const input2 = document.querySelector('#img-2');
    const input3 = document.querySelector('#img-3');

        if(input1.value.trim() === '' || !input1.value.match(/\.(jpeg|jpg|gif|png)$/i) || input2.value.trim() === '' || !input2.value.match(/\.(jpeg|jpg|gif|png)$/i) || input3.value.trim() === '' || !input3.value.match(/\.(jpeg|jpg|gif|png)$/i)){
        new Notificaction('Debés llenar los 3 campos y debe ser una url valida de imagen', 'alert-danger', 3000, e.target.id)
        return;
    }


    for(let i = 0; i < inputs.length; i++){
        Offerimgs.push(inputs[i].value);
    }
   
    const parser = new DOMParser();
    const parsedCode = parser.parseFromString(offersCodeText2.value, 'text/html');
    const codeHtml = parsedCode.body.firstChild;
    const div = codeHtml.getElementsByTagName('div');

    Array.from(div).forEach((divs,i)=>{
        const imgs = divs.getElementsByTagName('img');
        const tds = divs.getElementsByTagName('td');
            
        if(i === 0){    
            Array.from(imgs).forEach(img=>{
            img.src = Offerimgs[0];
            Offerimgs.shift();
        });
        }else{
            Array.from(imgs).forEach(img=>{
                img.src = Offerimgs.shift();
            });
        }
    });
    processCode(codeHtml.outerHTML);
    btnCopy3.classList.remove('d-none');

})

btnCopy3.addEventListener('click', (e)=>{
    copyCode(offersCodeText2.value, e.target.id);
})

label.textContent = 'Código de bloque ofertas con medidas ya establecidas (lo puedes copiar para usar como base)';

function isEmpty(){
    const code = document.querySelector('#code-alts').value;
        if(code === ''){
            new Notificaction('Debés pegar el código de tu pieza para poder limpiar los alts', 'alert-danger', 3000, 'e.target.id')
        }
}

function showAlert(text,type,time,id){
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

function clean(){
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

function generateWithCode(e){
    e.preventDefault();
    console.log('qqq');
    let offersCode = offersCodeText.value;

    if(offersCodeText.value === ''){
        console.log(e.target.id);
        new Notificaction('Debés pegar el código de tu bloque ofertas para generar uno nuevo con las medidas correctas', 'alert-danger', 3000, e.target.id)
    }else{
        processCode(offersCode);
    }
}

function processCode(offersCode){
    let heights = [];
    let maxHeight;
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

function calculateHeights(height){
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


function offersBlock(heights, code){
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

function setHeights(codeHtml, heights){
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

let action = null;
btnGroupAlts.classList.add('d-none');


/* ************************************************************ */

function handleInputSource(e){
    const file = document.querySelector('#file').files;
    if(file.length === 0){
        e.preventDefault();
    }
    const selected = new Alts(file);
    selected.isSelected();
}

// muestra los resultados en pantalla
function showResults(fileName, newCode){
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
function escapeHTML(data) {
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
function highlight(data){
    const txt = data.innerHTML;
    const txt2 = txt.replace(/alt="___"/g, '<span class="text-light bg-primary">alt="___"</span>');
    data.innerHTML = txt2;
}

// revisa si tiene la extensión html y si no, la agrega
function containsWord(fileName){
    if(!fileName.includes('.html')){
        fileName += '.html';
    }
    return fileName;
}

// función para descargar el nuevo codigo ya modificado
function downloadCode (data, fileName) {
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

function copyCode(code, id){
    navigator.clipboard.writeText(code)
    .then(() => {
        new Notificaction('Código HTML copiado', 'alert-success',2000, id)
    }).catch(err => {
        console.error('nel pastel:', err)
    })
    
}


function showForm(){
    mainContainer.classList.add('d-none');
    form.classList.remove('d-none');

    form.addEventListener('submit', validateForm);
}

function validateForm(e){
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
