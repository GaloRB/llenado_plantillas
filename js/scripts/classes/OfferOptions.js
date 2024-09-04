import Toggle from "./Toggle.js";
import Buttons from "./Buttons.js";
import { generateWithCode } from "../functions.js";
import { formDimensions,formDimensionsImgs,offersCodeText2 } from "../selectors.js";

export default class OfferOptions{
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