// 定义一个判断函数
var in_array = function(arr){

    // 遍历是否在数组中
    for(var i=0,k=arr.length;i<k;i++){
        if(this==arr[i]){
            return true;    
        }
    }
 
    // 如果不在数组中就会返回false
    return false;
}
 
// 给字符串添加原型
String.prototype.in_array = in_array;
// 给数字类型添加原型
Number.prototype.in_array = in_array;

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

function getAllGroups (uId) {
	$.ajax({
		url:'securitygroups',
		type:'get',
		async   : false,
		success:function (data) {
			if (data.statusCode === 0 ) {
				if (uId == "0") {
					for (var i = data.data.length - 1; i >= 0; i--) {
						var group = data.data[i];
						var temp = "<option value='" + group.GROUP_ID + "'>" + group.DESCRIPTION + "</option>";
						$("#groupSelect").append(temp);
					};
					$('#groupSelect').selectpicker();
				}else{
					$("#groupSelect").empty();
					$("#groupSelect").append(' <option value="0">-- 请选择权限组 --</option>');
					var temp;
					for (var i = data.data.length - 1; i >= 0; i--) {
						var group = data.data[i];
						$.ajax({
							url:'/users/'+uId+'/securitygroups',
							type:'get',
							async   : false,
							success:function (data2) {
								if (data2.statusCode === 0) {
									var datas = new Array();
									for (var i = data2.data.length - 1; i >= 0; i--) {
										var userGroup = data2.data[i];
										datas[i] = userGroup.GROUP_ID;
									};
									if(datas.length){
										if (group.GROUP_ID.in_array(datas)) {
											 temp = "<option disabled='disabled' value='" + group.GROUP_ID + "'>" + group.DESCRIPTION + "</option>";
										}else{
											 temp = "<option value='" + group.GROUP_ID + "'>" + group.DESCRIPTION + "</option>";
										}
									}else{
										 temp = "<option value='" + group.GROUP_ID + "'>" + group.DESCRIPTION + "</option>";
									}
									
								};
							}
						})
						
						$("#groupSelect").append(temp);
						$('#groupSelect').selectpicker('refresh');
					};
					$('#groupSelect').selectpicker();

				}
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