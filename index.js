function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
const CANVAS_HEIGHT = 850 ; 
const CANVAS_WIDTH = 1500 ; 
const NUMBER_OF_POINTS = 10 ; 
const array = [] ; 
const mainHullColor = "white" ;
const hullColor = "green" ; 
const nextColor = "blue" ; 
const currentPointColor = "yellow" ;
const pointColor = "red" ; 
const hullRadius = 20 ; 
const nextRadius = 16 ; 
const currentRadius = 12 ; 
const pointRadius = 10 ; 

// function startAlgorithm(){
var canvas = document.getElementById("id_screen") ; 
canvas.setAttribute("height" , CANVAS_HEIGHT) ; 
canvas.setAttribute("width" , CANVAS_WIDTH) ; 
var context = canvas.getContext("2d") ;
createRandomArray() ; 
const hullPoint = leftMostPoint(array) ; 
for( let i = 0 ; i< array.length; i++){
    if (array[i] == hullPoint) {
        drawPoint(hullPoint , context , hullColor , hullRadius) ; 
    }
    else{ 
        drawPoint(array[i] , context , pointColor , pointRadius) ; 
    }
} ; 
var hullArray = JarvisMarch(array) ;
console.log(hullArray);
// createHullFence(hullArray , context) ;


function drawLineBetweenPoints(point1 , point2 , context , color ) {
    context.beginPath();
    context.strokeStyle = color ;
    context.lineWidth = 5 ; 
    context.moveTo(point1[0] , point1[1] ) ; 
    context.lineTo(point2[0] , point2[1] ) ; 
    context.stroke();
}

function createHullFence(hullArray , context) {
    context.clearRect(0 , 0 , CANVAS_WIDTH , CANVAS_HEIGHT) ;  
    for ( let i = 0 ; i<hullArray.length-1 ; i++){
        context.strokeStyle = "yellow" ; 
        context.lineWidth = 4 ; 
        context.moveTo(hullArray[i][0] , hullArray[i][1]) ; 
        context.lineTo(hullArray[i+1][0] , hullArray[i+1][1]) ; 
        context.stroke() ;
    }
    context.strokeStyle = "yellow" ; 
    context.lineWidth = 4 ; 
    context.moveTo(hullArray[0][0] , hullArray[0][1]) ; 
    context.lineTo(hullArray[hullArray.length-1][0] , hullArray[hullArray.length-1][1]) ; 
    context.stroke() ;
    for ( let i = 0 ; i<array.length ; i++) {
        drawPoint(array[i] , context , pointColor , pointRadius) ; 
    }
}

function leftMostPoint(array){
    let left_most_point = array[0] ; 
    for ( i = 0 ; i<array.length ; i++) {
        if(array[i][0] < left_most_point[0]) {
            left_most_point = array[i] ; 
        }
    }
    return left_most_point ; 
}

function drawPoint(point , context , color , radius  ) { 
    let x = point[0] ; 
    let y = point[1] ; 
    context.moveTo(x , y) ;
    context.beginPath(); 
    context.fillStyle = color;  
    context.arc(x , y , radius , 0 * Math.PI, 2 * Math.PI);
    context.fill() ;
}

function createRandomPoint(){   
    let height_max_num = CANVAS_HEIGHT - 20 ; 
    let height_min_num = 20 ; 
    let width_max_num = CANVAS_WIDTH - 20 ; 
    let width_min_num = 20 ; 
    x = Math.floor(Math.random() * (width_max_num - width_min_num + 1) + width_min_num)
    y = Math.floor(Math.random() * (height_max_num - height_min_num + 1) + height_min_num)
    return [x,y] ; 
}

function createRandomArray(){
    for (let i = 0 ; i < NUMBER_OF_POINTS ; i++) {
        point = createRandomPoint() ; 
        array.push(point) ;
    }
}

function pointOrientation(point1 , point2 , point3) {
    var x1 = point1[0] ; 
    var y1 = point1[1] ; 
    var x2 = point2[0] ; 
    var y2 = point2[1] ; 
    var x3 = point3[0] ; 
    var y3 = point3[1] ;

    var d = (y3 - y2) * (x2 - x1) - (y2 - y1)*(x3 - x2) ; 
    if (d > 0 ) {
        return 1
    }
    else if(d<0 ) {
        return -1
    }
    else {
        return 0
    } ; 
}

function animateHull(main_hull , points , hullArray , on_hull , next_point , point , color ) { 
    context.clearRect(0 , 0 , CANVAS_WIDTH , CANVAS_HEIGHT) ; 
    for ( let i = 0 ; i<array.length ; i++) {
        drawPoint(points[i] , context , pointColor , pointRadius) ; 
    }
    drawPoint(main_hull , context , mainHullColor , hullRadius) ;
    if (on_hull != main_hull) { 
    drawPoint(on_hull , context , hullColor , hullRadius) ;
    } 
    drawPoint(next_point , context , nextColor , nextRadius) ; 
    drawPoint(point , context , currentPointColor , currentRadius) ; 
    for(let i = 0 ; i < hullArray.length -1; i++) {
            drawLineBetweenPoints(hullArray[i] , hullArray[i+1] , context , pointColor);
        }
        drawLineBetweenPoints(on_hull , next_point , context , hullColor) ; 
        drawLineBetweenPoints(next_point , point , context , hullColor) ; 
}

async function JarvisMarch(points) {
    var on_hull = leftMostPoint(points) ;
    var main_hull = on_hull ; 
    var hull = [] ;
    while (true) {
        hull.push(on_hull) ;
        var next_point = points[0] ;
        for( let i = 0 ; i < points.length ; i++ ){
            var o = pointOrientation(on_hull , next_point , points[i]) ; 
            animateHull(main_hull , points , hull , on_hull , next_point , points[i] , pointColor ) ;
            await sleep(100) ;
            if ( next_point == on_hull || o == 1) {
                animateHull(main_hull , points , hull , on_hull , next_point , points[i] , nextColor) ;
                await sleep(100) ;
                next_point = points[i] ;  
            }
        }
       on_hull = next_point; 
        if (on_hull == hull[0]) {
            break ; 
        }
    }
    createHullFence(hull , context) ;
    return hull ;
}