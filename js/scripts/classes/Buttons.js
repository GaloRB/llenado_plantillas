import {copyCode, clean} from "../functions.js"

export default class Buttons{

    constructor(){
        this.btnGetCode();
        this.btnCopyCode();
        this.btnClear();
        this.btnAddAlts();
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

    btnAddAlts(){
        this.btnAdd = document.createElement('button');
        this.btnAdd.type = 'submit';
        this.btnAdd.id = 'btn-add-alts';
        this.btnAdd.classList.add('btn', 'btn-success', 'm-1');
        this.btnAdd.textContent = 'Continuar';
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
        if(ifExist !== 2 && ifExist){
            console.log('true');
            this.fieldSetOffersBlock = document.querySelector('#field-set-offersBlock');
            this.buttonsContainer = document.createElement('DIV');
            this.buttonsContainer.classList.add('col-auto', 'mt-3', 'text-center', 'btn-container');
            this.buttonsContainer.appendChild(this.btnGetCode);
            this.buttonsContainer.appendChild(this.btnCopy2);
            this.buttonsContainer.appendChild(this.btnReset);
            this.fieldSetOffersBlock.appendChild(this.buttonsContainer);
        }else if(ifExist && ifExist === 2){
            this.fieldSetOffersBlockAlts = document.querySelector('#field-set-offersBlock-alts');
            this.buttonsContainer = document.createElement('DIV');
            this.buttonsContainer.classList.add('col-auto', 'mt-3', 'text-center', 'btn-container');
            this.buttonsContainer.appendChild(this.btnAdd);
            this.fieldSetOffersBlockAlts.appendChild(this.buttonsContainer);
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
        if(this.btnGetCode || this.btnAdd){
            this.btnGetCode.remove();
            console.log(this.btnAdd);
            this.btnAdd.textContent = 'dddd';
            console.log(this.btnAdd);
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