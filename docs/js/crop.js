
var jcrop_api;

function cropImage (target,modal,btnSave) {

    $(".jcrop-keymgr").hide();
    $(".jcrop-keymgr").remove();

    var x1, y1, x2, y2;

    jQuery(function ($) {
        if (target == "target" || target == "targetTemp") {
            $('#'+target).Jcrop({
                addClass: 'jcrop-circle',
                setSelect: [0, 0, 150, 150],
                aspectRatio: 1,
                onChange: showCoords,
                onSelect: showCoords,
                minSize: [50, 50],
                maxSize: [640, 640]
            }, function () {
                jcrop_api = this;
            });
        } else if (target == "storyCrop" || target == "storyCropTemp") {
            $('#'+target).Jcrop({
                setSelect: [0, 0, 640, 320],
                aspectRatio: 2,
                onChange: showCoords,
                onSelect: showCoords,
                minSize: [640, 320],
                maxSize: [6400, 3200]
            }, function () {
                jcrop_api = this;
            });
        }

        // ????? ?????????
        $('#release').click(function (e) {
            release();
        });


        // ????????? ?????????
        function showCoords(c) {
            x1 = c.x;
            $('#x1').val(c.x);
            y1 = c.y;
            $('#y1').val(c.y);
            x2 = c.x2;
            $('#x2').val(c.x2);
            y2 = c.y2;
            $('#y2').val(c.y2);

            $('#w').val(c.w);
            $('#h').val(c.h);

            if (c.w > 0 && c.h > 0) {
                $('#crop').show();
            } else {
                $('#crop').hide();
            }

        }
    });


    function release() {
        jcrop_api.release();
        $('#crop').hide();
    }

    jQuery(function ($) {
        $('#'+btnSave).one('click', function (e) {

            var img = $('#'+target).attr('src');

            $('#'+modal).removeClass('in');

            release();
            var controller = "";
            if (target == "target" || target == "targetTemp") {
                controller = "user";
            } else if (target == "storyCrop" || target == "storyCropTemp") {
                controller = "story";
            }
            $.ajax({
                type: "POST",
                url: "/" + controller + "/crop.html",
                data: {'x1': x1, 'x2': x2, 'y1': y1, 'y2': y2, 'img': img},
                success: function (data) {
                    if (target == "target" || target == "targetTemp") {
                        location.reload();
                    } else if (target == "storyCrop" || target == "storyCropTemp") {
                        //console.log(data);
                        if (data) {
                            var jData = JSON.parse(data);
                            var sImg = jData['storyImage'];
                            $('#temp-image').attr('src', sImg);
                        }
                        $("#cropModal").modal('hide');
                        $("#cropModalTemp").modal('hide');
                        //$('.modal-backdrop').hide();
                        //$('#cropModalTemp').hide();
                    }
                }
            });


        });
    });
// ??????? ??????????? ? ????? ??????????


}

