import Toggle from "./classes/Toggle.js";
import Notificaction from "./classes/Notificaction.js";
import {btnAlts, btnOffersBlock, formDimensionsAlts, formDimensionsImgs, btnCopy3, btnGroupAlts, mainContainerAlts, mainContainerOffersBlock,fileAlts,Offerimgs,offersCodeText2, btnAddAlts, gapi, gis} from "./selectors.js"
import {handleInputSource,copyCode,processCode, gapiLoaded, gisLoaded} from "./functions.js"

gapi.addEventListener('load', gapiLoaded());
gis.addEventListener('load', gisLoaded());

// toggle de nav de alts y bloque de ofertas
const toggle = new Toggle();

fileAlts.addEventListener('change', handleInputSource)

btnAlts.addEventListener('click', ()=>{
    toggle.alts(mainContainerAlts, mainContainerOffersBlock,btnOffersBlock,btnAlts, 'Pega aquí el código completo de tu pieza a la cual le quieres vaciar los alts');
})

btnAddAlts.addEventListener('click', ()=>{
    toggle.addAlts(mainContainerAlts, mainContainerOffersBlock,btnOffersBlock,btnAlts, 'Pega aquí el código completo de tu pieza a la cual le quieres agregar los alts');
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
        new Notificaction('Debes llenar los 3 campos y debe ser una url valida de imagen', 'alert-danger', 3000, e.target.id)
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



btnGroupAlts.classList.add('d-none');

