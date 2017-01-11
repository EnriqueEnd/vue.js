function formatterDateTime() {
	var date=new Date()
	var month=date.getMonth() + 1
	var datetime = date.getFullYear()
		+ ""// "年"
	    + (month >= 10 ? month : "0"+ month)
	    + ""// "月"
	    + (date.getDate() < 10 ? "0" + date.getDate() : date
	        .getDate())
	    + ""
	    + (date.getHours() < 10 ? "0" + date.getHours() : date
	        .getHours())
	    + ""
	    + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
	        .getMinutes())
	    + ""
	    + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
	        .getSeconds());
	return datetime;
}
var str = [];
var $page = 1;
var flag = 1;
var app = angular.module('myApp',['ionic'])
	//自定义过滤器   过滤 请求  视频是的Url
	app.filter('trusted', ['$sce', function ($sce) {
	    return function (url) {
	        return $sce.trustAsResourceUrl(url);
	    };
	}]);
	//控制器
	app.controller('myCtrl',['$scope','$ionicSlideBoxDelegate','$http','$ionicSideMenuDelegate',function($scope,$ionicSlideBoxDelegate,$http,$ionicSideMenuDelegate){
		$scope.title = 'myapp';
		
		//点击左栏菜单出现
		$scope.toggleLeft = function(){
			 $ionicSideMenuDelegate.toggleLeft();
		}
		//日间  夜间  模式切换
//		$scope.dayNight = function(){
//			console.log(flag)
//			if(flag==1){
//				$('ion-content').removeClass('blue').addClass('bgcolor')
//				$('.tool').removeClass('blue').addClass('bgcolor')
//				$('contents').attr('background','#252525')
//				flag=0
//				console.log(flag)
//			}else if(flag==0){
//				console.log("cc")
//				$('ion-content').removeClass('bgcolor').addClass('blue')
//				$('contents').removeClass('bgcolor').addClass('bgcolorday')
//				flag=1
//			}
//		}
		//滑动改变时
		$scope.slideHasChanged = function(_index){
			$scope.slideIndex = _index;
			//console.log(_index)
			if(_index!=0){
				$('.col-xs-2 a:first').css('color','#569099');
			}else{
				$('.col-xs-2 a:first').css('color','red');
			}			
		}
		//点击改变时
		$scope.activeSlide = function(_index){
			$ionicSlideBoxDelegate.slide(_index)
			
		}
		//下拉执行的函数
		$scope.doRefresh = function() {
		
			//段子 图片 视频    请求的为   百思不得姐  的API
			if($scope.slideIndex==0 ||$scope.slideIndex== undefined|| $scope.slideIndex==1|| $scope.slideIndex==2){
				$jieUrl = '255-1';
				$jieAppid = '26959';
				$jieSign = 'e866d3a656b14bfcab04de805203872b';				
			}else if($scope.slideIndex==4){
				$jieUrl = '109-35';
				$jieAppid = '27033';
				$jieSign = '6e86fa3667d04607a4da108e72309a93';
			}
						
			if($scope.slideIndex==0 ||$scope.slideIndex== undefined){
				$type = 29 //为段子请求的type
			}else
			if($scope.slideIndex==1){
				$type = 10 //为图片请求的type
			}else if($scope.slideIndex==2){
				$type = 41 //为视频请求的type				
			}else if($scope.slideIndex==4){
				$type = 05 //为视频请求的type				
			}
	
	        $http({	        	
			    type:"get",
			    url : "http://route.showapi.com/"+ $jieUrl,
			     	params: {
				        "showapi_timestamp": formatterDateTime(),
				        "showapi_appid": $jieAppid, //这里需要改成自己的appid '26959'
				        "showapi_sign": $jieSign,  //这里需要改成自己的应用的密钥secret， 
				        "type":$type,
				        "title":"",
				        "page":$page
				       	//"topid":"5"
				        //2da54217a5554135bba424c794c05034 27034   213-4
				    }
			     })  //注意改为自己本站的地址，不然会有跨域问题
	            .success(function(newItems) {                			     	
			     	if($type==29){			     		
			     		$scope.strs = newItems.showapi_res_body.pagebean.contentlist; 	              
	                	$('.tishi').remove(); //移除页面下拉提示
			     	}else if($type==10){
			     		$('.tishi1').remove();//移除页面下拉提示
			     		$scope.img = newItems.showapi_res_body.pagebean.contentlist;
			     	}else if($type==41){
			     		$('.tishi2').remove();//移除页面下拉提示
			     		$scope.video = newItems.showapi_res_body.pagebean.contentlist;			     
			     	}else if($type==05){
			     		$('.tishi4').remove();//移除页面下拉提示
			     		$scope.news = newItems.showapi_res_body.pagebean.contentlist;
			     		console.log(newItems.showapi_res_body.pagebean.contentlist);			     		
			     	}	                
	            })
	            .finally(function() {
	                $scope.$broadcast('scroll.refreshComplete');	                
	                $page++;
	            });	           
	    }
		//搜索天气
		$scope.go = function(){
			$('.todayWeather').html("");			
			var cityname = $('#cityname').val().trim();			
			$.get("http://wthrcdn.etouch.cn/weather_mini?city="+$('#cityname').val().trim(),function(data){
				var $json = JSON.parse(data)						
				initWeather($json);
				$scope.weather = $json.data.forecast;						
			})
			//初始化天气
			var initWeather = function(json){
				//console.log(json.status)
				if(json.status != 1000){
					$('.todayWeather').html("没有对应的天气信息，确认城市名称是否错误!");
					return false;					
				}
				//拼接今天的天气状况
				$('.todayWeather').append('<div class="weather1"></div>');
				$('.weather1').html(
					'<div class="weathers"><p class="wendu"><span>'
					+json.data.wendu+'</span>°</p><p class="address"><i class="ion-android-pin"></i> '
					+json.data.city+ ' | ' 
					+json.data.forecast[0].type+' </p></div>'+'<div class="ganmao"><p class="wx">温馨提示:</p><p>'
					+json.data.ganmao+'</p></div>'+'<div class="other"><div class="col-xs-4" style="padding: 0;margin: 0;text-align: center; border-right: 1px dashed white;"><sapn>'
					+json.data.forecast[0].fengxiang +'</sapn><br /><span class="max">'
					+json.data.forecast[0].fengli+'</span></div><div class="col-xs-4 "style="padding: 0;margin: 0;text-align: center; "><sapn>日期</sapn><br /><span class="max">'
					+json.data.forecast[0].date+'</span></div><div class="col-xs-4"style="padding: 0;margin: 0;text-align: center;border-left: 1px dashed white;"><sapn>空气质量</sapn><br /><span class="max">'
					+json.data.aqi+'</span></div></div></div> '								
				)
				//拼接昨天的天气状况
				$('.todayWeather').append('<div class="weather"></div>');
				$('.weather').html('<div class="col-xs-5"><p class="address"> 昨天</p><p class="address"> '+json.data.yesterday.type+' | '+json.data.yesterday.fl+' </p></div><div class="col-xs-7 font"><span >'+json.data.yesterday.low.replace('低温','')+' --'+json.data.yesterday.high.replace('高温','')+'</span></div></div>')								
				
			}
		}
}])
$(function(){
	$('.col-xs-2 a:first').css('color','red');
	$('.col-xs-2 a').on('click',function(){		
		$('.col-xs-2 a').css('color','#569099');
		$(this).css('color','red')
	})
	//视频控制条   效果不理想  在控制台输入才有效
	$("#myVideo").on("touchstart",function(){
		if(document.getElementById("myVideo").controls == true){
			document.getElementById("myVideo").controls=false;
		}else{
			document.getElementById("myVideo").controls=true;
		}
	})
})

	