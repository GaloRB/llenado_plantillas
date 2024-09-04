export default class ShowCode{
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