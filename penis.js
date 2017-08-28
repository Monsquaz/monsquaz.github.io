$(document).ready(function(){
    var load = 0;
    if (window.location.href.indexOf('?') != -1) {
        load = window.location.href.substr(window.location.href.indexOf('?')+1);
    }
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    
    canvas.addEventListener('click', function(event){
        var x = event.pageX - canvas.offsetLeft - 1;
        var y = event.pageY - canvas.offsetTop - 1;
        click(x, y);
    });
    
    var default_penis = {
        p:[40,60,45,100,40,200,120,10,20,150,60],
        c:[255,136,153,255,204,153,123,75,42,44,34,43]
    };
    
    if (load != 0) {
        try {
            default_penis = JSON.parse(atob(load));
        }
        catch (err) {
            //invalid link
        }
    }
    
    var base64 = btoa(JSON.stringify(default_penis));
    $("#penisLink").attr('href', '?'+base64);
    
    penises = [
        default_penis,
        mutatePenis(default_penis),
        mutatePenis(default_penis),
        mutatePenis(default_penis),
    ];
    
    drawPenises();
    
    var warp_penis = JSON.parse(JSON.stringify(default_penis)); //clone
    var t = -1; //DEBUG set to 0 to warp a penis
    if (t == 0) {
        setInterval(function(){
            t++;
            for (i = 0; i < warp_penis.p.length; i++) {
                warp_penis.p[i] = default_penis.p[i]+Math.sin((50-i*2)*t*Math.PI/2000+i)*20;
            }
            for (i = 0; i < warp_penis.c.length; i++) {
                warp_penis.c[i] = Math.round(default_penis.c[i]+Math.sin((50-i*2)*t*Math.PI/1000+i)*30-30);
            }
            ctx.clearRect(600, 0, 300, 700);
            drawPenis(750, 150, warp_penis, ctx);
        }, 40);
    }
});

function click(x, y){

    /*
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,150,70);
    ctx.fillStyle = "#000000";
    ctx.fillText("("+x+", "+y+")",5,20);
    */
    
    var selectedPenisID = Math.floor(x/300);
    var selectedPenis = penises[selectedPenisID];
    
    for(var i = 0; i < penises.length; i++) {
        if (selectedPenisID != i) {
            penises[i] = mutatePenis(selectedPenis);
        }
    }
    
    var base64 = btoa(JSON.stringify(selectedPenis));
    $("#penisLink").attr('href', '?'+base64);
    
    drawPenises();
    
};

function drawPenises() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  
    drawPenis(150, 150, penises[0], ctx);
    drawPenis(450, 150, penises[1], ctx);
    drawPenis(750, 150, penises[2], ctx);
    drawPenis(1050, 150, penises[3], ctx);
}

function mutatePenis(penis) {
    var mutatedPenis = JSON.parse(JSON.stringify(penis)); //clone
    
    var s_mutations = 5; //shape mutations
    var c_mutations = 5; //color mutations
    var h_mutations = 5; //hair mutations
    
    for (var i = 0; i < s_mutations; i++) {
        var property = getRandomInt(0, penis.p.length-1);
        mutatedPenis.p[property] += getRandomFloat(-15, 15);
        if (mutatedPenis.p[property] < 5) {
            mutatedPenis.p[property] = 5;
        }
    }
    
    for (var i = 0; i < c_mutations; i++) {
        var property = getRandomInt(0, penis.c.length-1-3);
        mutatedPenis.c[property] += getRandomInt(-15, 15);
        if (mutatedPenis.c[property] < 0) {
            mutatedPenis.c[property] = 0;
        }
        if (mutatedPenis.c[property] > 255) {
            mutatedPenis.c[property] = 255;
        }
    }
    
    /*
    for (var i = 0; i < h_mutations; i++) {
        var property = getRandomInt(0, penis.h.length-1);
        mutatedPenis.p[property] += getRandomFloat(-1, 1);
    }
    */
    
    return mutatedPenis;
}

function drawPenis(x, y, penis, ctx) {
    var p = penis.p; //points
    var c = penis.c; //colors
    
    var grd = ctx.createLinearGradient(0, -5, 0, p[5]);
    grd.addColorStop(0, 'rgb('+c[0]+','+c[1]+','+c[2]+')');
    grd.addColorStop(0.05, 'rgb('+c[3]+','+c[4]+','+c[5]+')');
    grd.addColorStop(1, 'rgb('+c[6]+','+c[7]+','+c[8]+')');
    ctx.strokeStyle="rgba(0, 0, 0, 0.5)";
    ctx.lineWidth="4";
    
    ctx.translate(x, y);
    ctx.beginPath();
    
    //Main shape
    ctx.moveTo(-p[0], 0);
    ctx.bezierCurveTo(-p[0], -p[1], p[0], -p[1], p[0], 0); //tip
    ctx.quadraticCurveTo(p[2], p[3], p[4], p[5]); //right side
    ctx.bezierCurveTo(p[4]+p[6], p[5]+p[7], p[4]+p[8], p[5]+p[9], 0, p[5]+p[10]); //right ball
    ctx.bezierCurveTo(-p[4]-p[8], p[5]+p[9], -p[4]-p[6], p[5]+p[7], -p[4], p[5]); //left ball
    ctx.quadraticCurveTo(-p[2], p[3], -p[0], 0); //left side
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.stroke();
    
    //Horizontal line
    ctx.beginPath();
    ctx.moveTo(-p[0], 0);
    ctx.lineTo(p[0], 0);
    ctx.stroke();
    
    //Vertical line
    ctx.beginPath();
    var offset = -p[1]*0.75;
    ctx.moveTo(0, offset);
    ctx.lineTo(0, offset+15);
    ctx.stroke();
    
    //Hair
    ctx.fillStyle = 'rgb('+c[9]+','+c[10]+','+c[11]+')';
    for (i = 0; i < 50; i++) {
        ctx.save();
        ctx.translate(Math.random()*(p[4]+p[6]/2)*2-(p[4]+p[6]/2), p[5]+Math.random()*(p[10]+p[9]*0.75)/2);
        ctx.rotate(Math.random()*2*Math.PI);
        ctx.fillRect(0,0,2,10);
        ctx.restore();
    }
    ctx.translate(-x, -y);
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
