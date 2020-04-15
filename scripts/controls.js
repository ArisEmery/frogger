Controls = (function() {
    'use strict';
    let upKey="w";
    let leftKey="a";
    let rightKey="d";
    let downKey="s";
    function setControls() {
        upKey=document.getElementById("up").value;
        rightKey=document.getElementById("right").value;
        leftKey=document.getElementById("left").value;
        downKey=document.getElementById("down").value;
        // alert(upKey+" "+leftKey+" "+rightKey);
        window.localStorage.setItem('upKey', document.getElementById("up").value);
        window.localStorage.setItem('leftKey', document.getElementById("left").value);
        window.localStorage.setItem('rightKey', document.getElementById("right").value);
        window.localStorage.setItem('downKey', document.getElementById("down").value);

        // console.log(localStorage.getItem('upKey'));
    }

    let keys={
        upKey:upKey,
        leftKey:leftKey,
        rightKey: rightKey,
        downKey: downKey,
        setControls: setControls
    };

    return keys;
}());
