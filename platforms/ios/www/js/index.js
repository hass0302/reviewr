var app = {
    image: null,
    imgOptions: null,
    key: 'hass0302.reviewr',
    currentIndex: -1,
    data: {},
    initialize: function () {
        document.addEventListener('DOMContentLoaded', this.onReady.bind(this), false);
    },
    onReady: function () {
        //localStorage.clear();
        console.log(navigator.camera);
        if (localStorage.getItem(app.key)) {
            app.data = JSON.parse(localStorage.getItem(app.key));
        } else {
            console.log("dont have it");
            app.data = {
                "reviews": [
                    {
                        "id": 237428374,
                        "name": "Timmies",
                        "rating": 4,
                        "img": "path/and/filename/on/device.png"
                }
                , {
                        "id": 123987944,
                        "name": "Starbucks",
                        "rating": 4,
                        "img": "path/and/filename/on/device.png"
                }

]
            };
            localStorage.setItem(app.key, JSON.stringify(app.data));
        }
        //console.log(app.data);
        let addItem = document.getElementById("addItemBtn");
        let wModal = document.getElementById("writeModal");
        let wbuttons = wModal.getElementsByTagName("button");
        let photoBtn = wbuttons[0];
        let cancelBtn = wbuttons[1];
        let saveBtn = wbuttons[2];
        let dModal = document.getElementById("deleteModal");
        let dButton = dModal.getElementsByTagName("button")[0];
        dButton.addEventListener("touchstart", app.deleteButton);
        photoBtn.addEventListener("touchstart", function () {
            app.callCamera();
        });
        cancelBtn.addEventListener("touchstart", app.cancelButton);
        saveBtn.addEventListener("touchstart", app.saveButton);
        addItem.addEventListener("touchstart", function () {
            app.writeModalScreen();
        });
        app.eventStars();
        app.displayList();
    },
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    },
    displayList: function () {
        app.data = JSON.parse(localStorage.getItem(app.key));

        console.dir(app.data);
        var content = document.querySelector('#item-List');
        content.innerHTML = "";
        app.data.reviews.forEach(function (element, index) {
            let li = document.createElement("li");
            let a = document.createElement('a');
            let span = document.createElement('span');
            let img = document.createElement("img");
            let rateDiv = document.createElement("div");

            rateDiv.className = "stars";
            for (let i = 0; i < 5; i++) {
                let spanStar = document.createElement("span");
                spanStar.content = '&#2606;';
                spanStar.className = "star";
                rateDiv.appendChild(spanStar);
            }

            let runRun = rateDiv.getElementsByClassName("star");
            for (let j = 0; j < element.rating; j++) {
                runRun[j].classList.add("rated");
            }

            img.src = element.img;
            img.className += "media-object pull-left";
            li.className += "table-view-cell";
            span.className += "name";
            // span.style = "padding-left:5px";
            span.appendChild(rateDiv);
            //span.innerHTML = element.rating;
            a.href = "#deleteModal";
            a.setAttribute("data-id", index);
            a.innerHTML = element.name;
            a.addEventListener("touchstart", function () {
                app.currentIndex = index;
                app.deleteModalScreen();
            });
            li.appendChild(img);
            li.appendChild(a);
            li.appendChild(span);
            content.appendChild(li);
        });
    },
    cancelButton: function () {
        let modal = document.getElementById('writeModal');
        let inputItem = document.getElementById("inputItem");
        let inputRate = document.getElementById("inputRating");
        inputItem.value = "";
        inputRate.value = "";
        app.currentIndex = -1;
        modal.classList.toggle("active");
    },
    saveButton: function () {
        let modal = document.getElementById('writeModal');
        let inputItem = document.getElementById("inputItem");
        let inputRate = document.getElementById("inputRating");
        let ids = Date.now().toString();
        let doodle = {
            id: ids,
            name: inputItem.value,
            rating: inputRate.value,
            img: app.image
        };
        console.log(doodle);
        app.data.reviews.push(doodle);
        localStorage.setItem(app.key, JSON.stringify(app.data));
        inputItem.value = "";
        inputRate.value = "";
        app.currentIndex = -1;
        modal.classList.toggle("active");
        app.displayList();
    },
    deleteButton: function () {
        app.data.reviews.splice(app.currentIndex, 1);
        app.currentIndex = -1;
        let modal = document.getElementById('deleteModal');
        // localStorage.removeItem(app.key);
        localStorage.setItem(app.key, JSON.stringify(app.data));
        modal.classList.toggle("active");
        app.displayList();
    },
    writeModalScreen: function () {
        console.log("inside write modal screen");
        let inputItem = document.getElementById("inputItem");
        let inputRate = document.getElementById("inputRating");
        inputItem.value = "";
        inputRate.value = "";

        let modal = document.getElementById("writeModal");
        let buttons = modal.getElementsByTagName("button");
        console.log(buttons[0]);
        buttons[0].style.display = "block";

        // console.log(modal);
        let starArr = modal.getElementsByClassName("star");
        //console.log(starArr);

        for (let i = 0; i < starArr.length; i++) {
            starArr[i].className = "star";
        }
    },
    deleteModalScreen: function () {
        console.log(app.currentIndex);
        console.log("inside delete modal screen");
        let inputItem = document.getElementById("delItem");
        let inputRate = document.getElementById("delRating");
        let img = document.createElement("img");
        let imgDiv = document.getElementById("imageBox");
        let doodle = app.data.reviews[app.currentIndex];
        imgDiv.innerHTML = "";
        img.src = doodle.img;
        imgDiv.appendChild(img);
        inputItem.value = doodle.name;
        inputRate.value = doodle.rating;

        let modal = document.getElementById("deleteModal");
        let starsArr = modal.getElementsByClassName("star");

        for (let j = 0; j < 5; j++) {
            starsArr[j].className = "star";
        }

        for (let i = 0; i < doodle.rating; i++) {
            starsArr[i].classList.toggle("rated");
        }

    },
    callCamera: function () {
        app.imgOptions = {
            "quality": 80,
            "destinationType": navigator.camera.DestinationType.FILE_URI,
            "encodingType": navigator.camera.EncodingType.PNG,
            "mediaType": navigator.camera.MediaType.PICTURE,
            "pictureSourceType": navigator.camera.PictureSourceType.CAMERA,
            "allowEdit": true,
            "targetWidth": 300,
            "targetHeight": 300
        }

        navigator.camera.getPicture(app.imgSuccess, app.imgFail, app.imgOptions);
    },
    imgSuccess: function (imageURI) {
        app.image = imageURI;
        console.log("Image loaded just fine");
        let modal = document.getElementById("writeModal");
        let buttons = modal.getElementsByTagName("button");
        console.log(buttons[0]);
        buttons[0].style.display = "none";
        let form = modal.getElementsByClassName("content-padded");
        let img = document.createElement("img");
        img.src = app.image;
        form[0].appendChild(img);
    },
    imgFail: function (msg) {
        console.log("Failed to get image: " + msg);
    },
    eventStars: function () {
        let modal = document.getElementById("writeModal");
        console.log(modal);
        let starSpan = modal.getElementsByClassName("star");
        let netRating = document.getElementById("inputRating");
        console.dir(starSpan);
        for (var a = 0; a < starSpan.length; a++) {
            // console.log(a);
            starSpan[a].addEventListener("touchstart", function (a) {
                return function () {
                    //console.log(a + 1);
                    netRating.value = a + 1;

                    for (let i = 0; i < 5; i++) {
                        if (i < netRating.value) {
                            starSpan[i].className = "star rated";
                        } else
                            starSpan[i].className = "star";
                    }
                };
            }(a));
        }
    }
};
app.initialize();
