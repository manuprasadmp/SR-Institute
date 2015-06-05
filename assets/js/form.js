
$(document).ready(function(){
	addHeader();
	/* json loading*/
	$.getJSON('../assets/JSON/country.json',function(data){
		$('#country').html('<option value="" disabled selected class="place">Country</option>');
		$('#state').html('<option value="" disabled selected class="place">State</option>');
		$.each(data.list, function (index, d) {
			$("#country").append("<option value=\"" + d.country + "\">" + d.country + "</option>");
		});
		$("#country").on("change",function(){
			$('#state').empty(); 
			$('#state').html('<option value="" disabled selected class="place">State</option>');
			for(var i = 0; i<data.list.length; i++){
				if(data.list[i].country == $(this).val()){
					$.each(data.list[i].states, function (index, d) {
						$("#state").append("<option value=\"" + d + "\">" + d + "</option>");
					});
				}
			}
		});
	});
	$.getJSON('../assets/JSON/homeData.json',function(homedata){
		$('.about #p1').text(homedata.p1);
		$('.about #p2').text(homedata.p2);
	});
	$.getJSON("../assets/JSON/gallery.json",function(gallery){
		img=gallery;
		var totalImg=gallery.image.length;
		$.each(gallery.image,function(index){
			var $output ='<div class="image"  data-index="'+index+'" ><img class="pic" src= "'+this.thumbnails+'" alt ="'+this.name+'"><span class="name">'+this.name+'</span></div>';
			$('.gallery_wrap').append($output);
		});
		$(".image").bind("click", function() {
			var imgIndex=$(this).data("index");
			var activeImg=img.image[imgIndex];
			open_popup(activeImg,imgIndex,totalImg);
		});
	});
});

var img;
var $details;

function addHeader() {
	$('.head').load('header.html');
}
function saveProfile(){
	if(validateForm()){  store();
		alert("succesfully submitted");
	}
	else{
		console.log('error');
	}
}
function validateForm(){
	// unameValidation();
	// age();
	// emailValidation();
	// addressValidation();
	// pwdValidation();
	// agreeValidation();
	if(unameValidation()&&age()&&emailValidation()&&addressValidation()&&placeValidation()&&pwdValidation()&&agreeValidation()){
		return true;
	}
}

/*username validation*/
function unameValidation(){
	var formSelector = ".register_wrap form.registraion_form";
    var fieldSelector = "";
	$(formSelector + " p.error").remove();
	fieldSelector = formSelector + ' input[type="text"]#uname';
	if(isEmptyField(fieldSelector)){
		$(fieldSelector).parent().append("<p class='error'>Please provide your user name</p>");
		return false;
	}
	if(!hasNoSpecialCharecters($(fieldSelector).val())){
		$(fieldSelector).parent().append("<p class='error'>avoid special characters</p>");
		return false;
	}
    return true;
}
/*email validation*/
function emailValidation(){
	var formSelector = ".register_wrap form.registraion_form";
    var fieldSelector = "";
	$(formSelector + " p.error").remove();
	fieldSelector = formSelector + ' input[type="text"]#email';
	if(isEmptyField(fieldSelector)){
		$(fieldSelector).parent().append("<p class='error'>please provide your email</p>");
		return false;
	}
	if(!validateEmail($(fieldSelector).val())){
		$(fieldSelector).parent().append("<p class='error'>please provide valid email</p>");
		return false;
	}
	return true;
}
/* adress validation*/
function addressValidation(){
	var formSelector = ".register_wrap form.registraion_form";
    var fieldSelector = "";
	$(formSelector + " p.error").remove();
	fieldSelector = document.getElementById("address");
	if(isEmptyField(fieldSelector)){
		$(fieldSelector).parent().append("<p class='error'>Please provide your address</p>");
		return false;
	}
    return true;
}
/*age validation*/
function age(){
	var formSelector = ".register_wrap form.registraion_form";
    var fieldSelector = "";
	$(formSelector + " p.error").remove();
	fieldSelector = formSelector + ' input[type="text"].dob';
	var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
	var Val_date = $(fieldSelector).val();
	var textLength = Val_date.length;
	if (Val_date != "") {
		if (Val_date.match(dateformat)) {
			var seperator1 = Val_date.split('/');
			if (seperator1.length > 1) {
				var splitdate = Val_date.split('/');
			} 
			var dd = parseInt(splitdate[0]);
			var mm = parseInt(splitdate[1]);
			var yy = parseInt(splitdate[2]);
			validDate(dd,mm,yy,fieldSelector);
		}
	    else if(textLength==8){
           var dd = parseInt(Val_date.substring(0, 2));
			var mm=parseInt(Val_date.substring(2, 4));
			var yy=parseInt(Val_date.substring(4));			
            validDate(dd,mm,yy,fieldSelector);
		}
		else{
		   	$(fieldSelector).parent().append("<p class='error'>Invalid date format</p>");
			return false;
		}
	} 
	else{
				
		$(fieldSelector).parent().append("<p class='error'>please provide your DOB</p>");
	    $("#age").html('');
		return false;
	}
	return true;   
    } 
	/* append slash*/
	var count=0;
	function appendSlash(){
	   	var formSelector = ".register_wrap form.registraion_form";
	   	var fieldSelector = formSelector + ' input[type="text"].dob';
		count++;
		if(count==2||count==4){
		var fieldContent=$(fieldSelector).val();
	    $(fieldSelector).val(fieldContent+"/");
	}
}
/*date validation*/
function validDate(dd,mm,yy,fieldSelector){
	var ListofDays = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
	if (mm == 1 || mm > 2) {
		if (dd > ListofDays[mm - 1]) {
			$(fieldSelector).parent().append("<p class='error'>Invalid date</p>");
			return false;
		}
	}
	if (mm == 2) {
		var lyear = false;
		if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
			lyear = true;
		}
		if ((lyear == false) && (dd >= 29)) {
			$(fieldSelector).parent().append("<p class='error'>Invalid date</p>");
			return false;
		}
		if ((lyear == true) && (dd > 29)) {
			$(fieldSelector).parent().append("<p class='error'>Invalid date</p>");
			return false;
		}
	}
	var today=new Date();
    var age=today.getFullYear()-yy;
    if((today.getMonth()+1)<mm || ((today.getMonth()+1)==mm && today.getDate()<dd)){age--;}
    $("#age").html(age);
    $(fieldSelector).val(dd+"/"+mm+"/"+yy);
    localStorage.setItem("age", age);
}
/* place validation*/
function placeValidation(){
  	if($('#country').val()==null){
		$('#country').parent().append("<p class='error'>Choose a country</p>")
	}
	if($('#state').val()==null){
        		$('#state').parent().append("<p class='error'>Choose a State</p>")
	}
}
/* password validation*/
function pwdValidation(){
	var formSelector = ".register_wrap form.registraion_form";
	var fieldSelector = "";
	var acc_pw = "";
	var con_pw = "";
	$(formSelector + " p.error").remove();
	fieldSelector = formSelector + ' input[type="password"].pwd';
	if(isEmptyField(fieldSelector)){
		$(fieldSelector).parent().append("<p class='error'>Please provide a password for your account</p>");
		return false;
	}
	else if($(fieldSelector).val().length < 3){
		$(fieldSelector).parent().append("<p class='error'>Password should have atleast three charecters</p>");
		return false;
	}
	else{
		acc_pw = $(fieldSelector).val();
	}
	fieldSelector = formSelector + ' input[type="password"].confirmpwd';
	if(isEmptyField(fieldSelector)){
		$(fieldSelector).parent().append("<p class='error'>Password confirmation field is empty</p>");
		return false;
	} 
	else{
		con_pw = $(fieldSelector).val();
	}
	if(con_pw != acc_pw){
		$(fieldSelector).parent().append("<p class='error'>Mismatch between provided passwords</p>");
		return false;
	}
	return true;
}
/*agree validation*/
function agreeValidation(){
	var formSelector = ".register_wrap form.registraion_form";
	var fieldSelector = "";
	$(formSelector + " p.error").remove();
	fieldSelector = formSelector + ' input[type="checkbox"].form_check';
	if(!$(fieldSelector).is(':checked')){
		$(fieldSelector).parent().append("<p class='error'>You should agree to submit</p>");
		return false;
	}
	return true;
}
/*local storage*/
function store()
{
	var uname=document.getElementById("uname").value;
	var gender=$("input[name=sex]:checked").val();
	var address=document.getElementById("address").value;
	var dob=document.getElementById("dob").value;
	var email=$("input[name=eid]").val();
	var language = $('input[type="checkbox"]:checked').val();
	var e = document.getElementById("country");
    var country = e.options[e.selectedIndex].value;

	localStorage.setItem("uname", uname);
	localStorage.setItem("gender", gender);
	localStorage.setItem("dob", dob);
	localStorage.setItem("address", address);
	localStorage.setItem("language",language);
	localStorage.setItem("email", email);
	localStorage.setItem("country", country);
}
function open_popup(activeImg,imgIndex,totalImg){
	var picId=activeImg.idname;
    $details='<div  id="'+picId+'"  class="popup_image"><a class="close_btn" href = "javascript:void(0)" onclick = "close_popup('+picId+')">&#10799;</a><a class="previous" href = "javascript:void(0)" onclick = "prev_image('+totalImg+','+imgIndex+')"><img src="../assets/images/prev.png"></a><a class="next" href = "javascript:void(0)" onclick = "next_image('+totalImg+','+imgIndex+')"><img src="../assets/images/next.png"></a><div class="name">'+activeImg.name+'</div><img class="enlarged_pic" src= "'+activeImg.images+'"><div class="details"><span class="model">Model no: '+activeImg.model_no+'</span><span class="model">Type: '+activeImg.type+'</span></div></div>';
	$('.popup_container').html($details);
	document.getElementById(picId).style.display='block';
    document.getElementById('fade').style.display='block';
}
function close_popup(picId){
	navCount=0;
	$(picId).hide();
	$('#fade').hide();
}
function prev_image(totalImg,imgIndex){
	var imgIndex=imgIndex-1;
	console.log(imgIndex);
	var activeImg;
	var picId;
	if(imgIndex<0){
		imgIndex=totalImg-1;
		activeImg=img.image[totalImg-1];
		picId= activeImg.idname;
		$details='<div  id="'+picId+'"  class="popup_image"><a class="close_btn" href = "javascript:void(0)" onclick = "close_popup('+picId+')">&#10799;</a><a class="previous" href = "javascript:void(0)" onclick = "prev_image('+totalImg+','+imgIndex+')"><img src="../assets/images/prev.png"></a><a class="next" href = "javascript:void(0)" onclick = "next_image('+totalImg+','+imgIndex+')"><img src="../assets/images/next.png"></a><div class="name">'+activeImg.name+'</div><img class="enlarged_pic" src= "'+activeImg.images+'"><div class="details"><span class="model">Model no: '+activeImg.model_no+'</span><span class="model">Type: '+activeImg.type+'</span></div></div>';
		$('.popup_container').html($details);
	}
	else{
		activeImg=img.image[imgIndex];
		picId= activeImg.idname;
		$details='<div  id="'+picId+'"  class="popup_image"><a class="close_btn" href = "javascript:void(0)" onclick = "close_popup('+picId+')">&#10799;</a><a class="previous" href = "javascript:void(0)" onclick = "prev_image('+totalImg+','+imgIndex+')"><img src="../assets/images/prev.png"></a><a class="next" href = "javascript:void(0)" onclick = "next_image('+totalImg+','+imgIndex+')"><img src="../assets/images/next.png"></a><div class="name">'+activeImg.name+'</div><img class="enlarged_pic" src= "'+activeImg.images+'"><div class="details"><span class="model">Model no: '+activeImg.model_no+'</span><span class="model">Type: '+activeImg.type+'</span></div></div>';
		$('.popup_container').html($details);
	}
	$('#fade').show();
	document.getElementById(picId).style.display='block';
}
function next_image(totalImg,imgIndex){
	var imgIndex=imgIndex+1;
	console.log(imgIndex);
	var activeImg;
	var picId;
	if(imgIndex>13){
		imgIndex=0;
		activeImg=img.image[0];
		picId= activeImg.idname;
		$details='<div  id="'+picId+'"  class="popup_image"><a class="close_btn" href = "javascript:void(0)" onclick = "close_popup('+picId+')">&#10799;</a><a class="previous" href = "javascript:void(0)" onclick = "prev_image('+totalImg+','+imgIndex+')"><img src="../assets/images/prev.png"></a><a class="next" href = "javascript:void(0)" onclick = "next_image('+totalImg+','+imgIndex+')"><img src="../assets/images/next.png"></a><div class="name">'+activeImg.name+'</div><img class="enlarged_pic" src= "'+activeImg.images+'"><div class="details"><span class="model">Model no: '+activeImg.model_no+'</span><span class="model">Type: '+activeImg.type+'</span></div></div>';
		$('.popup_container').html($details);
	}
	else{
		activeImg=img.image[imgIndex];
		picId= activeImg.idname;
		$details='<div  id="'+picId+'"  class="popup_image"><a class="close_btn" href = "javascript:void(0)" onclick = "close_popup('+picId+')">&#10799;</a><a class="previous" href = "javascript:void(0)" onclick = "prev_image('+totalImg+','+imgIndex+')"><img src="../assets/images/prev.png"></a><a class="next" href = "javascript:void(0)" onclick = "next_image('+totalImg+','+imgIndex+')"><img src="../assets/images/next.png"></a><div class="name">'+activeImg.name+'</div><img class="enlarged_pic" src= "'+activeImg.images+'"><div class="details"><span class="model">Model no: '+activeImg.model_no+'</span><span class="model">Type: '+activeImg.type+'</span></div></div>';
		$('.popup_container').html($details);
	}
	$('#fade').show();
	document.getElementById(picId).style.display='block';
}
/*process*/
function isEmptyField(fieldSelector){
	if($(fieldSelector).val() == null || 
		$(fieldSelector).val() == ""){
		return true
	} 
	else{
		return false
	}
}
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function hasNoSpecialCharecters(string){
	var re = /^[a-zA-Z0-9 ]*$/;
	return re.test(string);
}





 


