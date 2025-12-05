(function(modal) {

    let close = () => {
        let modal = document.querySelector('.overlay--modal');

        if(modal) { 
           modal.remove();
        } 
    }

    let render = (config) => {
        let overlay = document.createElement('DIV');
        let modal = document.createElement('DIV');
        let modalHeader = document.createElement('DIV');
        let modalTitle = document.createElement('H1');
        let modalBody = document.createElement('DIV');
        let modalFooter = document.createElement('DIV');
        let closeBtn = document.createElement('SPAN');
        let cancelBtn = document.createElement('BUTTON');
        let confirmBtn = document.createElement('BUTTON');

        overlay.className = 'overlay overlay--modal';
        modal.className = 'modal';
        modalHeader.className = 'modal__header';
        modalBody.className = 'modal__body';
        modalFooter.className = 'modal__footer';
        modalTitle.className = 'modal__title';
        closeBtn.className = 'modal__close material-symbols-outlined';

        modalTitle.textContent = config.title;
        closeBtn.textContent = 'close';
        cancelBtn.textContent = 'Cancel';
        confirmBtn.textContent = config.actionBtnTxt;

        closeBtn.setAttribute('title', 'Close');

        closeBtn.addEventListener('click', close);
        cancelBtn.addEventListener('click', close);
        confirmBtn.addEventListener('click', config.cbFn);

        modalHeader.append(modalTitle, closeBtn);
        modalBody.textContent = config.content;
        modalFooter.append(cancelBtn, confirmBtn);
        modal.append(modalHeader, modalBody, modalFooter);
        overlay.appendChild(modal);
        
        document.body.appendChild(overlay);
    }


    modal.render = render;
    modal.close = close;

})(window.modal = window.modal || {});