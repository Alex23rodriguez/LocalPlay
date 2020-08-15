var source = new EventSource("listen");
source.onmessage = function(event){
    d = JSON.parse(event.data)
    rots[0] = parseFloat(d.value)
}

console.log('Listener ready')