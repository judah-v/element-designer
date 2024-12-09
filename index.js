"use strict";
for (const form of document.forms){
    form.addEventListener('change', modifyTargetStyle);
}
checkOrientation();
screen.orientation.onchange = checkOrientation;

function checkOrientation() {
    if (screen.orientation.type.includes('portrait')) {
        let cover = document.createElement('div');
        cover.innerHTML = "<h1>Please rotate your device.</h1><p>This site does not currently support portrait mode</p>"
        cover.style.height = '100vh'
        cover.style.width = '100vw'
        cover.style.position = 'fixed'
        cover.style.background = 'white'
        cover.style.zIndex = '9'
        cover.id = 'cover'
        document.body.insertBefore(cover, document.body.firstChild)
    } else {
        removeCover()
    }
    function removeCover(){
        let cover = document.getElementById('cover');
        if (cover){
            document.body.removeChild(cover);
        }
    }
}

class Target {
    constructor(name, properties, element){
        this.name = name;
        this.properties = properties;
        this.element = element;
        this.styles = {};
        Target.instances.push([this.name, this]);
    }

    static instances = [];

    stylesToString(){
        let styles = 
    `${this.name.split('-')[0]} { \n`
        for (const property of this.properties) {
            const value = this.styles[property];
            if (value) {
                styles += `    ${property}: ${value};\n`
            }
        }
        styles += `}`
        return styles
    }   
}

const PTarget = new Target('p-tag', ['font-size', 'font-weight', 'color', 'background-color', 'text-decoration', 'font-family'], document.getElementById('p-tag'));

const InputTarget = new Target('input-tag', ['border-radius', 'height', 'width', 'font-size', 'background-color', 'opacity', 'color'], document.getElementById('input-tag'));

const pxls_required = ['font-size', 'border-radius', 'height', 'width']


function modifyTargetStyle(e){
    const modifiedElem = e.target.parentNode.parentNode.className;
    const target = getTarget(modifiedElem);

    for (const propertyName of target.properties){
        let control = document.querySelectorAll(`#${propertyName}`)
        let controlElem = modifiedElem === 'p-tag' ? control[0] : control[control.length -1];
        const propertyValue = controlElem? controlElem.value: null;
        const pText = document.getElementById('p-value').value
        if (pText){
            PTarget.element.textContent = pText;
        }
        if (propertyValue){
            let newValue;
            let needs_pixels = pxls_required.includes(propertyName);
            if (needs_pixels){
                newValue = propertyValue + 'px';
                
            } else if (propertyName === 'text-decoration'){
                
                const td = document.querySelector('label[for="text-decoration"]'); 
                let style = '';
                for (const child of td.children){
                    style += child.value + ' ';
                }

                newValue = style.slice(0, style.length-1);

            } else if (propertyName === 'opacity'){
                newValue = propertyValue + '%';

            } else {
                newValue = propertyValue;
            }
            
            target.styles[propertyName] = newValue;
            target.element.style[propertyName] = newValue;
            // console.log(elem.style[propertyName])
        }

    }
    function getTarget(modifiedElem) {
        for (const targ of Target.instances){
            if (targ[0] == modifiedElem) {
                return targ[1]
            }
        }
    }
}


function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        const display = document.getElementById('copy-result')
        display.style.visibility = 'visible';
        display.textContent = 'Text copied to clipboard';
        setTimeout(()=>{display.style.visibility = 'hidden'}, 1000)
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }
