const promotionsDB = ["/img/promotion/watch.jpg", "/img/promotion/tablet.jpg", "/img/promotion/toothbrush.jpg"]

const image=document.querySelector("#slideshow");

let index=1;

const changePic = () => {
    image.src = `${promotionsDB[index]}`;

    index++

    if(index >= promotionsDB.length)
    {
        index=0;
    }
}

setInterval(changePic, 2000);

module.exports=promotions;