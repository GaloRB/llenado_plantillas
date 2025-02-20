import Buttons from "./Buttons.js";
import OfferOptions from "./OfferOptions.js";
import {labelTxtCode,OffersNav,formDimensionsAlts,formDimensions,fileField} from "../selectors.js"
import { clean,generateWithCode,test, handleAuthClick, validate} from "../functions.js";

export default class Toggle{

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
        //formDimensions.addEventListener('submit', generateWithCode);
    }

    addAlts(show, hide, enabled, disabled, txt){
        this.addTxtAlt = true;
        fileField.classList.add('d-none');
        labelTxtCode.textContent = txt;
        this.toggleElement(show, hide, enabled, disabled);
        OffersNav.classList.add('d-none');
        formDimensionsAlts.classList.remove('d-none');
        this.buttons = new Buttons();
        this.buttons.show(2);
        //formDimensionsAlts.addEventListener('submit', validate);
    }

    offers(show, hide, enabled, disabled){
        this.toggleElement(show, hide, enabled, disabled)
        OffersNav.classList.remove('d-none');
        new OfferOptions();
    }

}