vars = ['rots', 'radii']

force_update_dict = {}
for(v of vars){
    force_update_dict[v] = make_force_update(v)
}


rots = {
    attr: 'rots',
    min: -0.05,
    max: 0.05,
    value: 0,
    step: 0.0005,
    dom: 'rots_div',
    layers: 6
}

radii = {
    attr: 'radii',
    min: -0.005, 
    max: 0.005, 
    value: 0, 
    step: 0.00005,
    dom: 'radii_div',
    layers: 4
}

// create dom
elements = {
    'rots': rots,
    'radii': radii
}

for(elem in elements){
    dict = elements[elem]
    let dom_elem = document.getElementById(dict.dom)

    for(let i=0; i<dict.layers; i++){
        dom_elem.appendChild(createSliderFrom(dict, make_single_emiter(elem, i)))
    }
    stop_func = string_together(make_set_all(elem, 0), force_update_dict[elem])
    dom_elem.appendChild(createButton('Stop', stop_func))
    rand_func = string_together(make_randomize_all(elem, dict.min, dict.max, false), force_update_dict[elem])
    dom_elem.appendChild(createButton('Randomize', rand_func))
}
