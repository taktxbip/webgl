'strict';

import Sketch from './js/modules/class-sketch';

import './scss/main.scss';
import './js/assets';


(function () {
    window.addEventListener('DOMContentLoaded', (event) => {

        new Sketch({
            dom: document.getElementById('container')
        });

    });
})();
