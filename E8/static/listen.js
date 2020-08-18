var source = new EventSource("listen");

function link_list_variable(src, attr, is_int){
    src.addEventListener(attr, function(event){
        d = JSON.parse(event.data)
        for(k in d){
            variables[attr][k] = is_int ? parseInt(d[k]) : parseFloat(d[k])
        }
    });
}

function link_normal_variable(src, attr, is_int){
    src.addEventListener(attr, function(event){
        v = JSON.parse(event.data)[0]
        variables[attr] = is_int ? parseInt(v) : parseFloat(v)
    })
}

link_list_variable(source, 'rots')
link_list_variable(source, 'hues')
link_list_variable(source, 'radii')
link_normal_variable(source, 'fade')

console.log('Listener ready')