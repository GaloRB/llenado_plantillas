export default class Notificaction{
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