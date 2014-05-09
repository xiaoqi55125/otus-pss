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
var tdCont = {
  cell: function(item) {
    return $("<td style='line-height: 35px;'></td>").html(item);
  },

  row: function() {
    return $("<tr></tr>");
  },
  deleteUserGroup: function(userId,groupId) {
    return function() {
      deleteUserGroup(userId,groupId);
    }
  }
};

 
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
										//to do sth. about show the group we have and add them to table 
										
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
					getGroupAlreadyHave(uId);

				}
			};
		}
	})
}

function getGroupAlreadyHave (userId) {
	
	$.ajax({
		url:'/users/'+userId+'/securitygroups',
		type:'get',
		success:function (data2) {
			if (data2.statusCode === 0) {
				if(data2.data.length){
					for (var i = data2.data.length - 1; i >= 0; i--) {
						
						console.log(data2.data.length);
						console.log(data2);
						$("#add_listViewUserGroup").html("");
			            for (var i = data2.data.length - 1; i >= 0; i--) {
			              var userGroup =data2.data[i];
			              var row = tdCont.row();
			              var cellGroupName = tdCont.cell(userGroup.DESCRIPTION);
			              var EditLink = tdCont.cell($("<a href='javascript:void(0);'>删除</a>"));
			              EditLink.click(tdCont.deleteUserGroup(userId,userGroup.GROUP_ID));
			              row.append(cellGroupName);
			              row.append(EditLink);
			              $("#add_listViewUserGroup").append(row);
			              $("#groupDeleteList").show();
			          	}
				         
					}
				}else{
					$("#groupDeleteList").hide();
				}
				
			};
		}
	})
}

function deleteUserGroup (userId,groupId) {
	$.ajax({
		url:'/usersecuritygroups/'+userId+'/'+groupId,
		type:'delete',
		success:function (data) {
			if (data.statusCode === 0) {
				getAllGroups (userId);
			} 
		}
	})
}

function allocGroup () {

	if($("#userSelect").val() == '0' ){
		bootbox.alert("<h4>请选择用户!</h4>");
		return;
	}
	if($("#groupSelect").val() == '0' ){
		bootbox.alert("<h4>请选择权限分组!</h4>");
		return;
	}
	$.ajax({
		url:'usersecuritygroups',
		type:"POST",
		data:$('form.groupSec').serialize(),
		success:function (data) {
			if (data.statusCode === 0) {
				getAllGroups ($("#userSelect").val());
				//bootbox.alert("<h4>分配权限成功!</h4>");
			}
		}
	})
}