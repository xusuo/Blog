// project util.js
$(function(){
    // 登录注册切换
    $('.j_userTab span').on('click',function(){
        var _index = $(this).index();
        $(this).addClass('user_cur').siblings().removeClass('user_cur');
        $('.user_login,.user_register').hide();
        if( _index==0 ){
            $('.user_login').css('display','inline-block');
            $('.user_register').hide();
        }else{
            $('.user_login').hide();
            $('.user_register').css('display','inline-block');
        }
    });

    // 登录校验
    var reg = /^[^<>"'$\|?~*&@(){}]*$/;
    var $login = $('#login');
    var $register = $('#register');
    var $userForm = $('.user_form');
    var $userLogined = $('.user_logined');
    $('.user_login_btn').on('click',function(){
        if( $login.find('.user_input').eq(0).find('input').val().trim() == '' ){
            $login.find('.user_err span').text('用户名不能为空').show();
            return false;
        }
        if( !reg.test($login.find('.user_input').eq(0).find('input').val().trim()) ){
            $login.find('.user_err span').text('用户名不能含有特殊字符').show();
            return false;
        }
        if( $login.find('.user_input').eq(1).find('input').val().trim() == '' ){
            $login.find('.user_err span').text('密码不能为空').show();
            return false;
        }
        if( !reg.test($login.find('.user_input').eq(1).find('input').val().trim()) ){
            $login.find('.user_err span').text('密码不能含有特殊字符').show();
            return false;
        }
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: $login.find('.user_input').eq(0).find('input').val().trim(),
                password: $login.find('.user_input').eq(1).find('input').val().trim()
            },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if(data.code == 0){
                    window.location.reload()
                }
            }
        })
    });

    $('.user_register_btn').on('click',function(){
        if( $register.find('.user_input').eq(0).find('input').val().trim() == '' ){
            $register.find('.user_err span').text('用户名不能为空').show();
            return false;
        }
        if( !reg.test($register.find('.user_input').eq(0).find('input').val().trim()) ){
            $register.find('.user_err span').text('用户名不能含有特殊字符').show();
            return false;
        }
        if( $register.find('.user_input').eq(1).find('input').val().trim() == '' ){
            $register.find('.user_err span').text('密码不能为空').show();
            return false;
        }
        if( !reg.test($register.find('.user_input').eq(1).find('input').val().trim()) ){
            $register.find('.user_err span').text('密码不能含有特殊字符').show();
            return false;
        }
        if( $register.find('.user_input').eq(1).find('input').val().trim() != 
            $register.find('.user_input').eq(2).find('input').val().trim()
        ){
            $register.find('.user_err span').text('两次输入的密码不一致').show();
            return false;
        }
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                username: $register.find('.user_input').eq(0).find('input').val().trim(),
                password: $register.find('.user_input').eq(1).find('input').val().trim(),
                repassword: $register.find('.user_input').eq(2).find('input').val().trim()
            },
            dataType: 'json',
            success: function(data){
                if(data.code != 0){
                    $register.find('.user_err span').text( data.msg ).show();
                    return false;
                }else{
                    window.location.reload()
                }
            }
        })
    });

    // 退出
    $('#loginOut').on('click',function(){
        $.ajax({
            type: 'post',
            url: '/api/user/loginOut',
            success: function(data){
                console.log(data)
                if(!data.code){
                    window.location.reload();
                }
            }
        })
    });

    

});