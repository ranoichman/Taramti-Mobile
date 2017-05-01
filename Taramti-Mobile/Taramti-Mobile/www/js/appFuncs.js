var allPics = ["Audi", "Bravo", "Desert", "Koala", "Tulips"];
var picArr = new Array();
var i = 0;
var marker;

//יצירת אובייקט תמונה
function pic(path, loc, title, desc) {
    this.picPath = path;
    this.picLocation = loc;
    this.picName = i; //data-name
    this.picTitle = title;
    this.picDesc = desc;
    this.picUpdate = null;
    this.isFav = "false";
}

//פתיחת מצלמה
function openCamera() {
    navigator.camera.getPicture(function (fileUri) {
        navigator.geolocation.getCurrentPosition(function (position) {
            loc = { lat: position.coords.latitude, lng: position.coords.longitude };
            var tempPic = new pic(fileUri, loc, "", "");
            picArr.push(tempPic);
            addToList(tempPic);
            i++;
        }  // gps success end
        ) // gps end
    }, function (err) {
        alert(err)
    }, { targetWidth: 200, targetHeight: 200 });

} // openCamera


//יצירת איחסון מקומי
function CreateLocalStorage() {
    localStorage.clear();
    var lsIndex = 0;
    for (j in picArr) {
        if (picArr[j] != null) {
            localStorage.setItem(lsIndex, JSON.stringify(picArr[j]));
            lsIndex++;
        }
    }
    localStorage.setItem("lsIndex", lsIndex);
};

function Fav(obj) {
    var $li = $("<li>").attr("id", i);
    var $a = $("<a>").attr({ "class": "ui-btn ui-btn-icon-right ui-icon-plus", "id": "Gal_" + i, "data-name": obj.picName });
    var $img = $("<img>").attr({ "src": obj.picPath });
    var $name = $("<h2>").attr({ "class": "name" }).text(obj.picTitle);
    var $desc = $("<p>").attr({ "class": "desc" }).text(obj.picDesc);
    var t = time();
    if (obj.picUpdate != null) {
        t = obj.picUpdate;
    }
    var $time = $("<p>").attr({ "class": "time" }).append("Last update: " + t);
    $a.append($img);
    $a.append($name);
    $a.append($desc);
    $a.append($time);
    $li.append($a);
    $("#PicsFav").append($li);
    $("#PicsFav").listview().listview("refresh");

    // צביעה באדום למטרת מחיקה
    $a.on("taphold", function () {
        $("footer").show();
        $(this).addClass('w3-red');
        $(this).attr({ "data-color": "red" });
        checkedCount = 1;
    })

    // אחרי שתמונה אחת סומנה באדום, השאר יסומנו בלחיצה כדי לאפשר מחיקה. אחרת, התמונה תשלח לדף עריכה
    $a.on("tap", function () {
        if (checkedCount != 0) {
            if ($(this).attr("data-color") == "red") {
                $(this).removeClass('w3-red');
                $(this).removeAttr("data-color");
                checkedCount--;
                if (checkedCount == 0) {// הסתרת פוטר
                    $("footer").hide();
                }
            }
            else {
                $(this).addClass('w3-red');
                $(this).attr({ "data-color": "red" });
                checkedCount++;
            }
        }
        else {
            editPic(obj);

        }
    });
    $("#PicsFav").listview().listview("refresh");
}

//הוספת תמונה לרשימה
function addToList(obj) {

    var $li = $("<li>").attr("id", i);
    var $a = $("<a>").attr({ "class": "ui-btn ui-btn-icon-right ui-icon-plus", "id": "Gal_" + i, "data-name": obj.picName });
    var $img = $("<img>").attr({ "src": obj.picPath });
    var $name = $("<h2>").attr({ "class": "name" }).text(obj.picTitle);
    var $desc = $("<p>").attr({ "class": "desc" }).text(obj.picDesc);
    var t = time();
    if (obj.picUpdate != null) {
        t = obj.picUpdate;
    }
    if (obj.isFav === "true") {
        $a.addClass('w3-green')
    }
    var $time = $("<p>").attr({ "class": "time" }).append("Last update: " + t);
    $a.append($img);
    $a.append($name);
    $a.append($desc);
    $a.append($time);
    $li.append($a);


    //li החלפת רקע בלחיצה על
    $a.on("tap", function () {
        if (!($(this).attr("class") == 'ui-btn ui-btn-icon-right ui-icon-plus w3-green')) {
            $(this).addClass('w3-green');

            var $liFav = $("<li>").attr("id", "Fav" + i);
            var $aFav = $("<a>").attr({ "class": "ui-btn ui-btn-icon-right ui-icon-edit", "id": "Fav_" + i, "data-name": obj.picName });
            var $imgFav = $("<img>").attr({ "src": obj.picPath });

            //מציאת הטקסט של התמונה מתוך הגלריה
            var $iName = $($(this).find("h2")[0]).text();
            var $descp = $($(this).find("p")[0]).text();
            var $t = $($(this).find("p")[1]).text();

            //הזנת הטקסט לתוך אלמנט במועדפים
            var $nameFav = $("<h2>").attr({ "class": "name" }).text($iName);
            var $descFav = $("<p>").attr({ "class": "desc" }).text($descp);
            var $timeFav = $("<p>").attr({ "class": "time" }).text($t);

            $aFav.append($imgFav);
            $aFav.append($nameFav);
            $aFav.append($descFav);
            $aFav.append($timeFav);
            $liFav.append($aFav);

            // הוספת התמונה למועדפים
            var dName = obj.picName;
            index = picArr.findIndex(x => x.picName.toString() == dName.toString());
            picArr[index].isFav = "true";

            $("#PicsFav").append($liFav);

            // צביעה באדום למטרת מחיקה
            $aFav.on("taphold", function () {
                $("footer").show();
                $(this).addClass('w3-red');
                $(this).attr({ "data-color": "red" });
                checkedCount = 1;
            })

            // אחרי שתמונה אחת סומנה באדום, השאר יסומנו בלחיצה כדי לאפשר מחיקה. אחרת, התמונה תשלח לדף עריכה
            $aFav.on("tap", function () {
                if (checkedCount != 0) {
                    if ($(this).attr("data-color") == "red") {
                        $(this).removeClass('w3-red');
                        $(this).removeAttr("data-color");
                        checkedCount--;
                        if (checkedCount == 0) {// הסתרת פוטר
                            $("footer").hide();
                        }
                    }
                    else {
                        $(this).addClass('w3-red');
                        $(this).attr({ "data-color": "red" });
                        checkedCount++;
                    }
                }
                else {
                    editPic(obj);
                }
            })
        }
        $("#PicsFav").listview().listview("refresh");
    });

    // מחיקת התמונה בלחיצה ארוכה
    $a.on("taphold", function () {
        if (confirm('Are you sure you want to delete the picture ?')) {
            $(this).parent().remove();
            var dName = $(this).attr('data-name');
            //מציאת תמונה במערך ומחיקתה
            index = picArr.findIndex(x => x.picName.toString() == dName.toString());
            picArr.splice(index, 1);


            $("#PicsFav").find("[data-name='" + dName + "']").remove();
        }
    });

    //  הזחה ימינה לעריכת תמונה
    $a.on("swiperight", function () {

        editPic(obj);
    });

    $("#Pics").append($li);

    $("#Pics").listview().listview("refresh");
    $("#PicsFav").listview().listview("refresh");


}

var checkedCount = 0;

//פונקציה לפורמט זמן מתאים
function time() {
    var $current = new Date(Date.now());
    var $correct = $current.toLocaleString();
    return $correct;
}

//פונקציית שמירת נתונים מדף עריכה
function SaveEdit() {
    var title = $("#Title").val();
    var desc = $("#Desc").val();
    var dName = $($("#EditPage").find("img")[0]).attr("data-name");

    // עדכון הנתונים בגלריה
    $("#Pics").find("[data-name='" + dName + "']").find(".name").text(title);
    $("#Pics").find("[data-name='" + dName + "']").find(".desc").text(desc);
    $("#Pics").find("[data-name='" + dName + "']").find(".time").text("Last update: " + time());

    //עדכון הנתונים במועדפים (אם קיים)
    $("#PicsFav").find("[data-name='" + dName + "']").find(".name").text(title);
    $("#PicsFav").find("[data-name='" + dName + "']").find(".desc").text(desc);
    $("#PicsFav").find("[data-name='" + dName + "']").find(".time").text("Last update: " + time());

    //עדכון הנתונים במערך
    var index = picArr.findIndex(a => a.picName.toString() == dName);
    picArr[index].picTitle = title;
    picArr[index].picDesc = desc;
    picArr[index].picUpdate = time();

    //ריקון דף עריכה
    $("#EditPic").html("");
    $("#Title").val("");
    $("#Desc").val("");
    $("#EditPage").hide();
    marker.setMap(null);
    window.location = "#gallery";

}

// פונקציית מחיקת התמונות מדף המועדפים
function deletePics() {
    $("#PicsFav").find('a').each(function () {
        if ($(this).attr("data-color") == "red") {
            $(this).parent().remove();
            var dName = $(this).attr('data-name');
            $("#Pics").find("[data-name='" + dName + "']").removeClass("w3-green");

            index = picArr.findIndex(x => x.picName.toString() == dName.toString());
            picArr[index].isFav = "false";

            $("#PicsFav").listview().listview("refresh");
        }
        $("footer").hide();
        checkedCount = 0;

    })

}

//פונקציית הוספת תמונה לדף עריכה
function editPic(obj) {
    window.location = "Tar_3.html#edit";
    $("#EditPage").show();

    var dName = obj.picName;
    var $imgFav = $("<img>").attr({ "src": obj.picPath, "data-name": dName });

    // הוספת התמונה לדף
    $("#EditPic").html($imgFav);
    $("#Title").val($("#Pics").find("[data-name='" + dName + "']").find(".name").text());
    $("#Desc").val($("#Pics").find("[data-name='" + dName + "']").find(".desc").text());
    marker = new google.maps.Marker({
        position: obj.picLocation,
        map: map,

    })

    setTimeout(function () {
        google.maps.event.trigger(map, "resize");
    }, 500)
}

// בונוס!!!!!
function Scroll() {

    var dName = $($("#EditPage").find("img")[0]).attr("data-name");
    var index = picArr.findIndex(a => a.picName.toString() == dName);
    if (picArr.length > index) {
        marker.setMap(null);
        editPic(picArr[++index]);
    }
    else {
        alert("Last Pic!");
    }
}
function Scrolleft() {
    var dName = $($("#EditPage").find("img")[0]).attr("data-name");
    var index = picArr.findIndex(a => a.picName.toString() == dName);
    if (index >= 0) {
        marker.setMap(null);
        editPic(picArr[--index]);
    }
    else {
        alert("First Pic!");
    }
}