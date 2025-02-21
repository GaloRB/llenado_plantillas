import Notificaction from "./Notificaction.js"
import { btnAddAlts, formDimensions } from "../selectors.js";
import { showResults, validate } from "../functions.js";
import Buttons from "./Buttons.js";

export default class Alts{

    constructor(file){
        this.file = file;
    }

    isSelected(addTxtAlt){
        if(this.file.length === 0){
            this.pasteCode(addTxtAlt);
            console.log(addTxtAlt)
        }
        else{
            console.log('file');
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

    pasteCode(addTxtAlt){
        const code = document.querySelector('#code-alts').value;
        if(code === '' && addTxtAlt === 'btn-get-code'){
            new Notificaction('Debes de pegar el código de tu pieza para poder limpiar los alts', 'alert-danger', 3000, 'e.target.id')
        }else if(addTxtAlt === 'btn-add-alts'){
            validate();
        }
        else{
         //this.cut(code,addTxtAlt);
         const newCode = this.cut(code,addTxtAlt);
         //console.log(newCode);
;         showResults('alts_vacios',newCode);
        }
    }

    cut(code,alts){
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
        // se alamacenara el nuevo codigo ya modificado 
        let newCode = ''
        // se almacena el codigo ya modificado sin alts que retorna la función
        newCode = this.modifyAlts(codeToModify,alts);
        console.log(newCode)
        // une el codigo del header + el codigo del contenido ya modificado + el código del footer
        newCode = header + newCode + footer;

        return newCode;
    }

    modifyAlts(data,alts){
        const emptyAltRegex = /alt="___"/g;
        const altRegex = /alt="([^"]*)"/g;
        let i = 0;
        //console.log(typeof(data));
        if (emptyAltRegex.test(data)) {
            // Si ya están vacíos, los llenamos con el contenido de `alts`
            console.log(data);
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/html");
            
            
            this.addAlts(doc,alts);
        
            const newHtmlString = new XMLSerializer().serializeToString(doc);
            console.log(newHtmlString);
            return newHtmlString; // Devolver el HTML modificado
        } else {
            // Si los `alt` tienen contenido, los vaciamos
            return data.replace(altRegex, 'alt="___"');
        }

            /* const modifiedCode = data.replace(altRegex, 'alt="___"');
            return modifiedCode; */
    }

    add(data, alts) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        let i = 0; // Índice para recorrer el array de alts
    
        // Seleccionar todos los divs con class "borde-izq" o "borde-der"
        const specialDivs = doc.querySelectorAll('.borde-izq, .borde-der');
    
        specialDivs.forEach(div => {
            const images = div.querySelectorAll('img[alt]'); // Obtener imágenes con atributo alt
            if (images.length > 0 && i < alts.length) {
                const sharedAlt = alts[i++]; // Tomar un valor del array alts
                images.forEach(img => img.setAttribute('alt', sharedAlt)); // Asignarlo a todas las imágenes del div
            }
        });
    
        // Para el resto de imágenes fuera de estos divs, asignar alts de forma normal
        const allImages = doc.querySelectorAll('img[alt="___"]');
        allImages.forEach(img => {
            if (!img.closest('.borde-izq, .borde-der') && i < alts.length) {
                img.setAttribute('alt', alts[i++]);
            }
        });
    
        return doc.body.innerHTML; // Devolver el HTML modificado
    }


    addAlts(doc, alts) {
        let i = 0; 
        let lastAlt = null; 
        let alts_banner = []; 
    
        // Seleccionar todas las imágenes del documento
        const allImages = doc.querySelectorAll('img[alt="___"]');
    
        allImages.forEach(img => {
            const parent = img;
            console.log(parent);
            if (parent.classList.contains("borde-izq")) {
                // Si la imagen está dentro de un borde-izq, le asignamos un nuevo alt y lo guardamos
                console.log(1)
                if (i < alts.length) {
                    lastAlt = alts[i]; 
                    img.setAttribute("alt", lastAlt);
                    alts_banner.push(lastAlt);
                    i++; // Avanzamos en el array de alts
                }
            } else if (parent.classList.contains("borde-der")) {
                console.log(2);
                // Si la imagen está dentro de un borde-der, repetimos el último alt del borde-izq
                if (lastAlt !== null) {
                    img.setAttribute("alt", lastAlt);
                    alts_banner.push(lastAlt);
                }
            } else {
                console.log(3);
                // Para imágenes normales, asignamos el siguiente alt en orden
                if (i < alts.length) {
                    img.setAttribute("alt", alts[i]);
                    alts_banner.push(alts[i]);
                    i++; // Avanzamos en `alts`
                }
            }
        });
    
        console.log('Alts asignados:', alts_banner);
    }
    

    divBanner(data, alts){
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        let i = 0; // Índice para recorrer el array de alts

        // Seleccionar todos los divs con class "borde-izq" o "borde-der"
        const specialDivs = doc.querySelectorAll('.borde-izq, .borde-der');

        specialDivs.forEach(div => {
            const images = div.querySelectorAll('img[alt]'); // Obtener imágenes con atributo alt
            if (images.length > 0 && i < alts.length) {
                const sharedAlt = alts[i++]; // Tomar un valor del array alts
                images.forEach(img => img.setAttribute('alt', sharedAlt)); // Asignarlo a todas las imágenes del div
            }
        });
    }


}