var source = new EventSource("listen");
source.addEventListener('rots', function(event){
    d = JSON.parse(event.data)
    for(k in d){
        rots[k] = parseFloat(d[k])
    }
})
source.addEventListener('radii', function(event){
    d = JSON.parse(event.data)
    for(k in d){
        radii[k] = parseFloat(d[k])
    }
})

console.log('Listener ready')