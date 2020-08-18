function make_tracked_variable(attr, min, max, value, step, dom, layers){
    return {attr:attr, min:min, max:max, value:value, step:step, dom:dom, layers:layers}
}

variables = [
    make_tracked_variable('rots', -0.05, 0.05, 0, 0.0005, 'rots_div', 6),
    make_tracked_variable('radii', -0.005, 0.005, 0, 0.00005, 'radii_div', 4),
    make_tracked_variable('fade', 0, 0.5, 0.5, 0.0005, 'fade_div', 1),
    make_tracked_variable('hues', 0, 360, random(360), 1, 'hues_div', 6),
]

force_update_dict = {}
for(v of variables){
    force_update_dict[v.attr] = make_force_update(v.attr)
}

for(dict of variables){
    elem = dict.attr
    let dom_elem = document.getElementById(dict.dom)

    for(let i=0; i<dict.layers; i++){
        dom_elem.appendChild(createSliderFrom(dict, make_single_emiter(elem, i)))
    }
    dom_elem.appendChild(document.createElement('br'))

    stop_func = string_together(make_set_all(elem, dict.value), force_update_dict[elem])
    dom_elem.appendChild(createButton('Reset', stop_func))
    rand_func = string_together(make_randomize_all(elem, dict.min, dict.max, false), force_update_dict[elem])
    dom_elem.appendChild(createButton('Randomize', rand_func))
}

// force_update_dict['hues']()