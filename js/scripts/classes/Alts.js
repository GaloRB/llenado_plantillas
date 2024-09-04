import Notificaction from "./Notificaction.js"
import { formDimensions } from "../selectors.js";
import { showResults } from "../functions.js";

export default class Alts{

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