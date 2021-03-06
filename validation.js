const URL = "http://localhost:8000";
let jsonData = []
let releasedCounter = 0

$(document).on("keyup", "#form_password", function(event){
  if(event.which !== 8 && event.which !== 48 && event.which !== 9) {
    let sample = jsonData[releasedCounter];
    sample.released = event.timeStamp;
    releasedCounter++;
  }
})

$(document).on("keydown", "#form_password", function(event){
  //where key are not backspace and delete
  if(event.which !== 8 && event.which !== 48 && event.which !== 9) {
    let key = event.key;
    let timePressed = event.timeStamp;

    let template = returnNewTemplate();
    template.code = event.which
    template.key = key
    template.pressed = timePressed
    jsonData.push(template)
  }
})

$(document).on("click","#form_try_again", function(event) {
  showFormHolder()
  event.preventDefault()
} )

$( document ).ready(function () {
  $("#form_login_button").unbind("click").bind("click", function() {
    let userName = $("#form_username").val();
    let userPassword = $("#form_password").val();

    sendAjax("POST", "login", {username: userName, password: userPassword}, (result) => {

      if(result && typeof result === "object" && result.validUser === true) {
        $("#error_msg").text("Calculations ... Please wait.")


        sendAjax("POST", "calculation", {id: result.id, data: jsonData}, (result2) => {
          if(result2.success === "true") $("#error_msg").text("Sample saved")
          else if(result2.success === "valid") showSuccessMsg()
          else if(result2.success === "not valid") showErrorMsg()
          else  $("#error_msg").text("Something went wrong!")

          removeValuesFromForm()
        })
      } else {
        $("#error_msg").text("You have entered invalid data. Please try again.")
      }
    })
  })

  $("#form_register_button").unbind("click").bind("click", function() {
    let userName = $("#form_username").val();
    let userPassword = $("#form_password").val();
  })

  $('#form_password').bind('input', function() {
    if($("#form_password").val().length === 0) {
      jsonData = []
      releasedCounter = 0
    } else if($("#form_password").val().length === 1 && jsonData.length > 1) {
      //if user select data but not pressed delete or backspace
      let lastSample = jsonData[jsonData.length-1]
      jsonData = []
      jsonData.push(lastSample)
      releasedCounter = 0
    }
  });
})

function returnNewTemplate() {
  let template = {
    "code": null,
    "key": null,
    "pressed": null,
    "released": null
  }
  return template;
}

function showSuccessMsg() {
  $("#error_msg").text("")
  $("#form_holder").addClass("hide")
  $("#form_login_valid").removeClass("hide")
  //$("#error_msg").text("Passed auth!")
}

function showErrorMsg() {
  $("#error_msg").text("")
  $("#form_holder").addClass("hide")
  $("#form_can_not_login").removeClass("hide")
}

function showFormHolder() {
  $("#error_msg").text("")
  $("#form_can_not_login").addClass("hide")
  $("#form_login_valid").addClass("hide")
  $("#form_holder").removeClass("hide")
  removeValuesFromForm()
}

function removeValuesFromForm() {
  $("#form_username").val("")
  $("#form_password").val("")
}

function sendAjax(aMethod, aUrl, aData, callback) {
  $.ajax({
    url: URL + "/" + aUrl,
    data: aData,
    type: aMethod,
    dataType: "json",
    headers: {
      "allow-control-allow-origin":  "*"
    },
    success: function(result) {
      callback(result)
    },
    error: function() {
      callback(null)
    }
  });
}
