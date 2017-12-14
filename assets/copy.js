console.log(result);
let mode = [];
for(let i of result.routes[x].legs[0].steps) {
    if (i.travel_mode === "WALKING") {
        mode.push([transferOption.WALK, i.duration.text]);
    } else {
        mode.push([transferOption[i.transit.line.vehicle.type], i.duration.text, i.transit.line.short_name])
    }
}

let route = $(`<div class="route-set"></div>`);
for(let i of mode) {
    let symbol = $(`<div class="transfer-logo"></div>`);
    let text = $(`<div class="transfer-route"></div>`);
    
    text.append($(`<i class="material-icons ${i[0]}">${i[0]}</i>`));

    if (i[2]) {
        text.append(`<p class="bus-route">${i[2]}</p>`)
    }
    symbol.append(text)
    symbol.append(`<p class="route-duration text-center">${i[1]}</p>`)
    route.append(symbol);
    if (i !== mode[mode.length -1]) {
        route.append($(`<i class="material-icons small-arrow">arrow_forward</i>`));
    }
}
let ahref = $(`<a href="#" class="list-group-item public" num=${x}></a>`);
ahref.append(route)
ahref.append($(`<div class="route-info text-right">${result.routes[x].legs[0].distance.text}  <i class="material-icons">access_time</i> ${result.routes[x].legs[0].duration.text}</div>`))
$('#transport-list-group').append(ahref)