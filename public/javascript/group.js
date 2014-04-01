
function getAllUsers () {
	$.ajax({
		url:'/users',
		type:'get',
		success:function (data) {
			if (data.statusCode === 0 ) {
				for (var i = data.data.length - 1; i >= 0; i--) {
					var user = data.data[i];
					var temp = "<option value='" + user.USER_ID + "'>" + user.USER_NAME + "</option>";
					$("#userSelect").append(temp);
				};
				$('#userSelect').selectpicker();
			};
		}
	})
}

function getAllGroups () {
	$.ajax({
		url:'securitygroups',
		type:'get',
		success:function (data) {
			if (data.statusCode === 0 ) {
				for (var i = data.data.length - 1; i >= 0; i--) {
					var group = data.data[i];
					var temp = "<option value='" + group.GROUP_ID + "'>" + group.DESCRIPTION + "</option>";
					$("#groupSelect").append(temp);
				};
				$('#groupSelect').selectpicker();
			};
		}
	})
}

function allocGroup () {

	if($("#userSelect").val() == '0' ){
		bootbox.alert("请选择用户!");
		return;
	}
	if($("#groupSelect").val() == '0' ){
		bootbox.alert("请选择权限分组!");
		return;
	}
	$.ajax({
		url:'usersecuritygroups',
		type:"POST",
		data:$('form.groupSec').serialize(),
		success:function (data) {
			if (data.statusCode === 0) {
				bootbox.alert("分配权限成功!");
			}
		}
	})
}