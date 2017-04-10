var app = {
    key: 'hass0302.reviewr'
    , currentIndex: -1
    , data: {}
    //    , options: {
    //        quality: 80
    //        , destinationType: Camera.DestinationType.FILE_URI
    //        , encodingType: Camera.EncodingType.PNG
    //        , mediaType: Camera.MediaType.PICTURE
    //        , pictureSourceType: Camera.PictureSourceType.CAMERA
    //        , allowEdit: true
    //        , targetWidth: 300
    //        , targetHeight: 300
    //    }
    
    , initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        //localStorage.clear();
        //  console.log(navigator.camera);
        if (localStorage.getItem(app.key)) {
            app.data = JSON.parse(localStorage.getItem(app.key));
        }
        else {
            console.log("dont have it");
            app.data = {
                "reviews": [
                    {
                        "id": 237428374
                        , "name": "Timmies"
                        , "rating": 4
                        , "img": "path/and/filename/on/device.png"
                }
                , {
                        "id": 123987944
                        , "name": "Starbucks"
                        , "rating": 4
                        , "img": "path/and/filename/on/device.png"
                }

]
            };
            localStorage.setItem(app.key, JSON.stringify(app.data));
        }
        console.log(app.data);
        app.displayList();
    }, // deviceready Event Handler
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        console.log("testing");
        //alert (navigator.camera);
    }, // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    }
    , displayList: function () {
        app.data = JSON.parse(localStorage.getItem(app.key));
        var content = document.querySelector('#item-List');
        content.innerHTML = "";
        app.data.reviews.forEach(function (element, index) {
            let li = document.createElement("li");
            let a = document.createElement('a');
            let span = document.createElement('span');
            let addItem = document.getElementById("addItemBtn");
            addItem.addEventListener("touchstart", function () {
                app.writeModalScreen();
            });
            li.className += "table-view-cell";
            span.className += "name";
            span.style = "padding-left:5px";
            span.innerHTML = element.rating;
            a.href = "#deleteModal";
            a.setAttribute("data-id", index);
            a.innerHTML = element.name;
            a.addEventListener("touchstart", function () {
                app.currentIndex = index;
                app.deleteModalScreen();
            });
            li.appendChild(a);
            li.appendChild(span);
            content.appendChild(li);
        });
    }
    , cancelButton: function () {
        let modal = document.getElementById('writeModal');
        let inputItem = document.getElementById("inputItem");
        let inputRate = document.getElementById("inputRating");
        inputItem.value = "";
        inputRate.value = "";
        app.currentIndex = -1;
        modal.classList.toggle("active");
    }
    , saveButton: function () {
        let modal = document.getElementById('writeModal');
        let inputItem = document.getElementById("inputItem");
        let inputRate = document.getElementById("inputRating");
        let ids = Date.now().toString();
        let doodle = {
            id: ids
            , name: inputItem.value
            , rating: inputRate.value
            , img: "path/and/filename/on/device.png"
        };
        console.log(doodle);
        app.data.reviews.push(doodle);
        localStorage.setItem(app.key, JSON.stringify(app.data));
        inputItem.value = "";
        inputRate.value = "";
        app.currentIndex = -1;
        modal.classList.toggle("active");
        app.displayList();
    }
    , deleteButton: function () {
        app.data.reviews.splice(app.currentIndex, 1);
        let modal = document.getElementById('deleteModal');
        app.currentIndex = -1;
        localStorage.removeItem(app.key);
        localStorage.setItem(app.key, JSON.stringify(app.data));
        modal.classList.toggle("active");
        app.displayList();
    }
    , writeModalScreen: function () {
        console.log("inside write modal screen");
        let modal = document.getElementById("writeModal");
        let inputItem = document.getElementById("inputItem");
        let inputRate = document.getElementById("inputRating");
        inputItem.value = "";
        inputRate.value = "";
        let buttons = modal.getElementsByTagName("button");
        let photoBtn = buttons[0]
        let saveBtn = buttons[2];
        let cancelBtn = buttons[1];
        cancelBtn.addEventListener("touchstart", app.cancelButton);
        saveBtn.addEventListener("touchstart", app.saveButton);
    }
    , deleteModalScreen: function () {
        //        console.log(app.currentIndex);
        //        console.log("inside delete modal screen");  
        let modal = document.getElementById("deleteModal");
        let inputItem = document.getElementById("delItem");
        let inputRate = document.getElementById("delRating");
        let doodle = app.data.reviews[app.currentIndex];
        inputItem.value = doodle.name;
        inputRate.value = doodle.rating;
        let button = modal.getElementsByTagName("button")[0];
        button.addEventListener("touchstart", app.deleteButton);
    }
};
app.initialize();