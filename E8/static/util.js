// create DOM
function createSliderFrom(jsn, oninput){
    return createSlider(
        jsn.attr, 
        jsn.min,
        jsn.max,
        jsn.value,
        jsn.step,
        oninput
    )
}

function createSlider(attr, min, max, value, step, oninput){
    let e = document.createElement('input')
    e.setAttribute('attr', attr)
    e.setAttribute('type', 'range')
    e.setAttribute('min', min)
    e.setAttribute('max', max)
    e.setAttribute('step', step)
    e.value = value
    e.oninput = oninput
    return e
}

function createButton(text, onclick){
    let e = document.createElement('input')
    e.setAttribute('type', 'button')
    e.setAttribute('value', text)
    e.onclick = onclick
    return e
}

// manipulate DOM()

function make_set_all(attr, value){
    value = value || 0
    return function(){
        let es = document.querySelectorAll(`[attr="${attr}"]`)
        for(e of es){
            e.value = value
        }
    }
}

function make_randomize_all(attr, min, max, is_int){
    return function(){
        let es = document.querySelectorAll(`[attr="${attr}"]`)
        for(e of es){
            e.value = random(min, max, is_int)
        }
    }
}

// helper funcs

function string_together(){
    let args = arguments
    return function(){
        for(f of args){
            f()
        }
    }
}

function random(min, max, is_int){
    if(max===undefined){
        max = min
        min = 0
    }
    let r =  min + Math.random()*(max-min)
    return is_int ? Math.floor(r) : r
}


// COMM
function make_single_emiter(attr, layer){
    return function(){
        let data = {}
        data[layer] = this.value
        fetch(`/ping?attr=${attr}`, {
            method:'POST',
            body: JSON.stringify(data)
        })
    }
}

function make_force_update(attr){
    return function(){
        let es = document.querySelectorAll(`[attr="${attr}"]`)
        let data = {}
        for(i in es){
            data[i] = es[i].value
        }
        fetch(`/ping?attr=${attr}`, {
            method:'POST',
            body: JSON.stringify(data)
        })
    }
}

/*
function make_send_all(attr, amount, value){
    value = value || 0
    return function(){
        let data = {}
        for(let i=0; i<amount; i++){
            data[i] = value
        }
        fetch(`/ping?attr=${attr}`, {
            method:'POST',
            body: JSON.stringify(data)
        })
    }
}
*/