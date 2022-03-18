'strict';

import Sketch from './js/modules/class-sketch';


import './scss/template/animate.scss';
import './scss/template/bootstrap.scss';
// import './scss/template/icomoon.scss';
import './scss/template/style.scss';

import './scss/main.scss';
import './js/assets';


(function () {
    window.addEventListener('DOMContentLoaded', (event) => {

        new Sketch({
            dom: document.getElementById('container')
        });

    });
})();
