
/**
 * get user;s group and alloc group to him
 * @param  {strung} uId userid
 * @return {null}     
 */
function getUserGroups (uId) {

	$.ajax({
		url:'/users/'+uId+'/securitygroups',
		type:'get',
		success:function (data) {
			if (data.statusCode === 0) {
				for (var i = data.data.length - 1; i >= 0; i--) {
					var userGroup = data.data[i];
					switch(userGroup.GROUP_ID){ 
					    case "SUPER_ADMIN":    
					      $("#wholeMenu").find("li").show();
					      break; 
					    case "ORDERS": 
					       $("#order").show();
					      break; 
					    case "PRE_STOCK_IN": 
					      $("#pStockIn").show();
					      break; 
					    case "PRODUCT": 
					      $("#product").show();
					      $("#product_category").show();
					      $("#otherPro").show();
					      break; 
					    case "STOCK_IN": 
					      $("#stockIn").show(); 
					      break; 
					    case "STOCK_OUT": 
					      $("#stockOut").show();
					      break; 
					    default:
					      break; 
				    }	
				};
			};
		}
	})
}