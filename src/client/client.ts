/// <reference path="lib/scratch_card/index.ts" />

let formatName = function (text: string) {
    let words: Array<string> = text.slice(0, -4).split('-');

    // Concatenate all capitalized words to get camelized string
    let result: string = "";
    for (let i = 0; i < words.length; i++) {
        let word: string = words[i];
        let capitalizedWord: string = word.charAt(0).toUpperCase() + word.slice(1);
        result += ' ' + capitalizedWord;
    }

    return result;
}


let publicUrl: string = "";

let drawText = function () {
    var canvas = <HTMLCanvasElement>document.getElementById('scratchcard');
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#abc";
    ctx.font = "30px 'Indie Flower'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    var rectHeight = canvas.height;
    var rectWidth = canvas.width;
    var rectX = 10;
    var rectY = 10;
    ctx.fillText("Scratch to discover!", rectX + (rectWidth / 2), rectY + (rectHeight / 2));
}
function loadImage() {
    $("#buttons").hide();
    $("#location").hide();
    $.get('/css/random.css?v=' + Math.floor(Math.random() * 1000), function (data) {
        $("#random-css").remove();
        $('head').append('<style id="random-css">' + data + '</style>')
        var regex = /\/[\s\S]*\.\w\w\w/g;
        var match = data.match(regex)[0];
        var pictureName = match.substring(match.lastIndexOf('/') + 1);

        $("#location").text(formatName(pictureName));

        $.get('/db?id=' + pictureName, function (url: string) {
            publicUrl = url
        });

    });

    initializeScratchCard();
    WebFont.load({
        google: {
            families: ['Indie Flower']
        },
        active: function () {
            drawText();
        }
    });

    $("scratchcard").focus();

}

function shareToFacebook() {
    FB.ui({
        method: 'share',
        href: publicUrl,
        quote: "Let's go there with @scravelgame."
    }, function (response) { });
}

function initializeScratchCard() {
    let options = {
        id: 'scratchcard',
        brushSize: 50,
        lineJoin: 'round',
        percentRequired: 65,
        fillColor: '#2c3651'
    };

    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('scratchcard');
    let context: any = canvas.getContext('2d');
    if (window.innerWidth >= 800)
        canvas.width = 800;
    else
        canvas.width = window.innerWidth - 30;

    canvas.height = 500;

    let scratchCard: any = new ScratchCard(options);
    scratchCard.getCanvas().addEventListener('success', function (e: any) {
        if (publicUrl.length > 0) {
            $("#buttons").show();
            $("#location").show();
            $("#travelButton").focus();
        }
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('scratchcard');
        let context: any = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    }, false);

    WebFont.load({
        google: {
            families: ['Indie Flower']
        },
        active: function () {
            drawText();
        }
    });
}

