$(document).ready( () => {
    $('#mutation-chance').focusout(() => {
        focusOutLimitInput($('#mutation-chance'), 0, 100);
    });

    $('#mutation-chance').keydown(event => {
        if (event.key === 'Enter') {
            $('#mutation-chance').blur();
        }
    });

    $('#rocket-count').focusout(() => {
        focusOutLimitInput($('#rocket-count'), 4, 100);
    });

    $('#rocket-count').keydown(event => {
        if (event.key === 'Enter') {
            $('#rocket-count').blur();
        }
    });

    $('#cycle-rate').focusout(() => {
        focusOutLimitInput($('#cycle-rate'), 100, 1000);
    });

    $('#cycle-rate').keydown(event => {
        if (event.key === 'Enter') {
            $('#cycle-rate').blur();
        }
    });

    $('#chromosome-count').focusout(() => {
        focusOutLimitInput($('#chromosome-count'), 5, 50);
    });

    $('#chromosome-count').keydown(event => {
        if (event.key === 'Enter') {
            $('#chromosome-count').blur();
        }
    });
});

function focusOutLimitInput(el, min, max) {
    if (el.val() > max) {
        el.val(max);
    } else if (el.val() < min) {
        el.val(min);
    }
}

window.addEventListener('keydown', event => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(event.code) > -1) {
        event.preventDefault();
    }
}, false);